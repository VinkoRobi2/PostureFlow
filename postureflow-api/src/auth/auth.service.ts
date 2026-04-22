import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthProvider, Locale } from '@prisma/client';
import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { PostureFlowService } from '../postureflow/postureflow.service';
import {
  GoogleLoginDto,
  LoginDto,
  LogoutDto,
  RegisterDto,
  ResendVerificationDto,
  RestoreSessionDto,
  VerifyEmailDto,
} from './dto/auth.dto';

const SESSION_TTL_MS = 45 * 24 * 60 * 60 * 1000;
const VERIFICATION_TTL_MS = 15 * 60 * 1000;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly postureFlowService: PostureFlowService,
  ) {}

  async register(dto: RegisterDto) {
    await this.postureFlowService.ensureReady();

    const email = this.normalizeEmail(dto.email);
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser?.emailVerifiedAt) {
      throw new ConflictException('An account already exists with this email.');
    }

    const passwordHash = this.hashPassword(dto.password);

    const user = existingUser
      ? await this.prisma.user.update({
          where: { id: existingUser.id },
          data: {
            email,
            firstName: dto.firstName.trim(),
            lastName: dto.lastName?.trim() || null,
            passwordHash,
            locale: dto.locale ?? existingUser.locale,
          },
        })
      : await this.prisma.user.create({
          data: {
            email,
            firstName: dto.firstName.trim(),
            lastName: dto.lastName?.trim() || null,
            passwordHash,
            locale: dto.locale ?? Locale.EN,
          },
        });

    const code = await this.issueVerificationCode(user.id, user.email);

    return {
      ok: true,
      authenticated: false,
      requiresEmailVerification: true,
      email: user.email,
      devVerificationCode: code,
    };
  }

  async login(dto: LoginDto) {
    await this.postureFlowService.ensureReady();

    const email = this.normalizeEmail(dto.email);
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    if (!this.verifyPassword(dto.password, user.passwordHash)) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    if (!user.emailVerifiedAt) {
      const code = await this.issueVerificationCode(user.id, user.email);

      if (dto.locale) {
        await this.prisma.user.update({
          where: { id: user.id },
          data: { locale: dto.locale },
        });
      }

      return {
        ok: true,
        authenticated: false,
        requiresEmailVerification: true,
        email: user.email,
        devVerificationCode: code,
      };
    }

    if (dto.locale && dto.locale !== user.locale) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { locale: dto.locale },
      });
    }

    return this.createAuthenticatedBundle(
      user.id,
      AuthProvider.EMAIL,
      dto.locale ?? user.locale,
    );
  }

  async loginWithGoogle(dto: GoogleLoginDto) {
    await this.postureFlowService.ensureReady();

    const email = this.normalizeEmail(dto.email);
    const existingUser = dto.googleSubject
      ? await this.prisma.user.findFirst({
          where: {
            OR: [{ googleSubject: dto.googleSubject }, { email }],
          },
        })
      : await this.prisma.user.findUnique({
          where: { email },
        });

    const user = existingUser
      ? await this.prisma.user.update({
          where: { id: existingUser.id },
          data: {
            email,
            firstName: dto.firstName.trim(),
            lastName: dto.lastName?.trim() || existingUser.lastName,
            googleSubject: dto.googleSubject ?? existingUser.googleSubject ?? email,
            emailVerifiedAt: existingUser.emailVerifiedAt ?? new Date(),
            locale: dto.locale ?? existingUser.locale,
          },
        })
      : await this.prisma.user.create({
          data: {
            email,
            firstName: dto.firstName.trim(),
            lastName: dto.lastName?.trim() || null,
            googleSubject: dto.googleSubject ?? email,
            emailVerifiedAt: new Date(),
            locale: dto.locale ?? Locale.EN,
          },
        });

    return this.createAuthenticatedBundle(
      user.id,
      AuthProvider.GOOGLE,
      dto.locale ?? user.locale,
    );
  }

  async verifyEmail(dto: VerifyEmailDto) {
    await this.postureFlowService.ensureReady();

    const email = this.normalizeEmail(dto.email);
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Verification code is invalid.');
    }

    const verification = await this.prisma.emailVerificationCode.findFirst({
      where: {
        userId: user.id,
        email,
        code: dto.code.trim(),
        consumedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!verification) {
      throw new UnauthorizedException('Verification code is invalid or expired.');
    }

    await this.prisma.$transaction([
      this.prisma.emailVerificationCode.update({
        where: { id: verification.id },
        data: { consumedAt: new Date() },
      }),
      this.prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerifiedAt: new Date(),
          locale: dto.locale ?? user.locale,
        },
      }),
    ]);

    return this.createAuthenticatedBundle(
      user.id,
      AuthProvider.EMAIL,
      dto.locale ?? user.locale,
    );
  }

  async resendVerification(dto: ResendVerificationDto) {
    await this.postureFlowService.ensureReady();

    const email = this.normalizeEmail(dto.email);
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return {
        ok: true,
        authenticated: false,
        requiresEmailVerification: true,
        email,
      };
    }

    if (user.emailVerifiedAt) {
      return {
        ok: true,
        authenticated: false,
        alreadyVerified: true,
        email,
      };
    }

    const code = await this.issueVerificationCode(user.id, email);

    return {
      ok: true,
      authenticated: false,
      requiresEmailVerification: true,
      email,
      devVerificationCode: code,
    };
  }

  async restoreSession(dto: RestoreSessionDto) {
    await this.postureFlowService.ensureReady();

    const session = await this.prisma.authSession.findUnique({
      where: { token: dto.sessionToken },
      include: {
        user: true,
      },
    });

    if (!session || session.revokedAt || session.expiresAt <= new Date()) {
      throw new UnauthorizedException('Session has expired.');
    }

    if (dto.locale && dto.locale !== session.user.locale) {
      await this.prisma.user.update({
        where: { id: session.user.id },
        data: { locale: dto.locale },
      });
    }

    await this.prisma.authSession.update({
      where: { id: session.id },
      data: { lastUsedAt: new Date() },
    });

    return this.buildBundleFromSession(
      session.token,
      session.provider,
      session.expiresAt,
      session.user.id,
      dto.locale ?? session.user.locale,
    );
  }

  async logout(dto: LogoutDto) {
    await this.postureFlowService.ensureReady();

    const session = await this.prisma.authSession.findUnique({
      where: { token: dto.sessionToken },
    });

    if (!session) {
      return { ok: true };
    }

    await this.prisma.authSession.update({
      where: { id: session.id },
      data: { revokedAt: new Date() },
    });

    return { ok: true };
  }

  private async createAuthenticatedBundle(
    userId: string,
    provider: AuthProvider,
    locale: Locale,
  ) {
    const session = await this.prisma.authSession.create({
      data: {
        token: randomBytes(32).toString('hex'),
        userId,
        provider,
        expiresAt: new Date(Date.now() + SESSION_TTL_MS),
      },
    });

    return this.buildBundleFromSession(
      session.token,
      session.provider,
      session.expiresAt,
      userId,
      locale,
    );
  }

  private async buildBundleFromSession(
    sessionToken: string,
    provider: AuthProvider,
    expiresAt: Date,
    userId: string,
    locale: Locale,
  ) {
    const [bootstrap, dashboard, library, paywall] = await Promise.all([
      this.postureFlowService.getBootstrap(locale, userId),
      this.postureFlowService.getDashboard(userId),
      this.postureFlowService.getLibrary(userId),
      Promise.resolve(this.postureFlowService.getPaywall()),
    ]);

    return {
      ok: true,
      authenticated: true,
      session: {
        token: sessionToken,
        provider: provider === AuthProvider.GOOGLE ? 'google' : 'email',
        expiresAt: expiresAt.toISOString(),
        emailVerified: true,
        user: bootstrap.user,
      },
      bootstrap,
      dashboard,
      library,
      paywall,
    };
  }

  private async issueVerificationCode(userId: string, email: string) {
    const code = `${Math.floor(100000 + Math.random() * 900000)}`;

    await this.prisma.emailVerificationCode.create({
      data: {
        userId,
        email,
        code,
        expiresAt: new Date(Date.now() + VERIFICATION_TTL_MS),
      },
    });

    return code;
  }

  private normalizeEmail(email: string) {
    return email.trim().toLowerCase();
  }

  private hashPassword(password: string) {
    const salt = randomBytes(16).toString('hex');
    const hash = scryptSync(password, salt, 64).toString('hex');
    return `${salt}:${hash}`;
  }

  private verifyPassword(password: string, storedHash: string) {
    const [salt, expectedHash] = storedHash.split(':');

    if (!salt || !expectedHash) {
      throw new BadRequestException('Stored password hash is invalid.');
    }

    const actualHash = scryptSync(password, salt, 64).toString('hex');

    return timingSafeEqual(
      Buffer.from(actualHash, 'hex'),
      Buffer.from(expectedHash, 'hex'),
    );
  }
}
