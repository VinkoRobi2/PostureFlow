import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Locale } from '@prisma/client';
import {
  CompleteOnboardingDto,
  CompleteSessionDto,
  DownloadRoutineDto,
  StartSessionDto,
  SyncBatchDto,
  UpdateLocaleDto,
  UpdateSessionProgressDto,
} from './dto/postureflow.dto';
import { PostureFlowService } from './postureflow.service';

@Controller('v1')
export class PostureFlowController {
  constructor(private readonly postureFlowService: PostureFlowService) {}

  @Get('bootstrap')
  getBootstrap(
    @Query('locale') locale?: Locale,
    @Query('userId') userId?: string,
  ) {
    return this.postureFlowService.getBootstrap(locale ?? Locale.EN, userId);
  }

  @Patch('profile/locale')
  updateLocale(@Body() dto: UpdateLocaleDto) {
    return this.postureFlowService.updateLocale(dto);
  }

  @Post('onboarding/complete')
  completeOnboarding(@Body() dto: CompleteOnboardingDto) {
    return this.postureFlowService.completeOnboarding(dto);
  }

  @Get('dashboard/:userId')
  getDashboard(@Param('userId') userId: string) {
    return this.postureFlowService.getDashboard(userId);
  }

  @Get('library/:userId')
  getLibrary(@Param('userId') userId: string) {
    return this.postureFlowService.getLibrary(userId);
  }

  @Post('library/download')
  downloadRoutine(@Body() dto: DownloadRoutineDto) {
    return this.postureFlowService.downloadRoutine(dto);
  }

  @Get('paywall')
  getPaywall() {
    return this.postureFlowService.getPaywall();
  }

  @Post('player/start')
  startSession(@Body() dto: StartSessionDto) {
    return this.postureFlowService.startSession(dto);
  }

  @Patch('player/:sessionId/progress')
  updateSessionProgress(
    @Param('sessionId') sessionId: string,
    @Body() dto: UpdateSessionProgressDto,
  ) {
    return this.postureFlowService.updateSessionProgress(sessionId, dto);
  }

  @Post('player/:sessionId/complete')
  completeSession(
    @Param('sessionId') sessionId: string,
    @Body() dto: CompleteSessionDto,
  ) {
    return this.postureFlowService.completeSession(sessionId, dto);
  }

  @Post('sync')
  sync(@Body() dto: SyncBatchDto) {
    return this.postureFlowService.sync(dto);
  }
}
