import { Body, Controller, Post } from "@nestjs/common";
import { CaptureService } from "./capture.service";
import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";
import { CaptureDto } from "src/dto/capture.dto";

@Controller('capture')
export class CaptureController {
    constructor(private readonly captureService: CaptureService) { }

    @Post()
    async captureEvent(@Body() body: any) {
        const dto = plainToInstance(CaptureDto, body)
        await validateOrReject(dto).catch(err => { throw err; });

        return this.captureService.queueEvent({ ...dto })
    }
}