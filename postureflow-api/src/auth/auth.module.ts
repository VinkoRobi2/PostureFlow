import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PostureFlowModule } from '../postureflow/postureflow.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [PrismaModule, PostureFlowModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
