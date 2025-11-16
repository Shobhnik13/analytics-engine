import { BadRequestException, Injectable } from "@nestjs/common";
import Redis from "ioredis";
import { isValidEvent } from "src/common/events.config";
import { logger } from "src/common/logger";
import { v4 as uuidv4 } from 'uuid';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

@Injectable()
export class CaptureService {
    private streamName = process.env.REDIS_QUEUE || "";

    async queueEvent(body: {
        event: string,
        distinctId: string,
        properties?: any,
        timestamp?: string
    }) {

        const { event, distinctId, properties, timestamp } = body || {};
        if (!event || !distinctId) throw new BadRequestException("event and distinctId are required fields");
        if (!isValidEvent(event)) throw new BadRequestException(`Invalid event '${event}'`);

        const record = {
            uuid: uuidv4(),
            event,
            distinct_id: distinctId,
            properties: properties || {},
            event_timestamp: timestamp || new Date().toISOString()
        }

        await redis.xadd(this.streamName, '*', 'payload', JSON.stringify(record));
        logger.info(`[INFO] Event queued to Redis Stream ${this.streamName}: ${JSON.stringify(record)}`);
        return {
            status: 'queued',
            event: record.event,
            eventId: record.uuid
        }
    }
}