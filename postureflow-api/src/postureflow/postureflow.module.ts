import { Module } from '@nestjs/common';
import { PostureFlowController } from './postureflow.controller';
import { PostureFlowService } from './postureflow.service';

@Module({
  controllers: [PostureFlowController],
  providers: [PostureFlowService],
  exports: [PostureFlowService],
})
export class PostureFlowModule {}
