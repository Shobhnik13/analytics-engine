import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { CaptureController } from './capture/capture.controller';
import { AnalyticsService } from './analytics/analytics.service';
import { CaptureService } from './capture/capture.service';

@Module({
  imports: [DatabaseModule.register()],
  controllers: [CaptureController],
  providers: [CaptureService, AnalyticsService],
})
export class AppModule { }
