import { Body, Controller, Post } from "@nestjs/common";
import { CaptureService } from "./capture.service";
import { CaptureDto } from "src/dto/capture.dto";

@Controller('capture')
export class CaptureController {
    constructor(private readonly captureService: CaptureService) { }

    @Post()
    async captureEvent(@Body() body: CaptureDto) {
        return this.captureService.queueEvent(body)
    }
}