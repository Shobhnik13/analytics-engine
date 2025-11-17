import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { CaptureController } from './capture/capture.controller';
import { AnalyticsService } from './analytics/analytics.service';
import { CaptureService } from './capture/capture.service';
import { AnalyticsController } from './analytics/analytics.controller';

@Module({
  imports: [DatabaseModule.register()],
  controllers: [CaptureController, AnalyticsController],
  providers: [CaptureService, AnalyticsService],
})
export class AppModule { }
