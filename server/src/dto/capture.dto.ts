import { IsObject, IsOptional, IsString } from "class-validator";

export class CaptureDto {
    @IsString()
    event: string
 
    @IsString()
    distinctId: string

    @IsOptional()
    @IsObject()
    properties?: Record<string, any>

    @IsOptional()
    @IsString()
    timestamp?: string;
} 