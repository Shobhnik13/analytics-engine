import { ClickHouseClient, createClient } from "@clickhouse/client";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { logger } from "src/common/logger";

@Injectable()
export class ClickhouseService implements OnModuleInit {
    private client: ClickHouseClient

    constructor() {
        // Initialize ClickHouse client configurations
        const host = process.env.CLICKHOUSE_HOST || 'http://localhost';
        const port = process.env.CLICKHOUSE_PORT || '8123';
        const base = host.includes('://') ? host : `http://${host}`;

        // setting up singleton client instance
        this.client = createClient({
            host: `${base}:${port}`,
            username: process.env.CLICKHOUSE_USER || 'default',
            password: process.env.CLICKHOUSE_PASSWORD || '',
            database: process.env.CLICKHOUSE_DB || 'insightplus'
        })
    }

    async onModuleInit() {
        // create DB table if not exists
        await this.client.exec({
            query: `
            CREATE TABLE IF NOT EXISTS events (
          uuid String,
          event String,
          distinct_id String,
          properties JSON,
          event_timestamp DateTime64(3)
        ) ENGINE = MergeTree()
        PARTITION BY toYYYYMM(event_timestamp)
        ORDER BY (event, event_timestamp, uuid)
            `
        })
        logger.info("[INFO] CLICKHOUSE CLIENT SETUP COMPLETED AND TABLES ARE READY");
    }

    async insertMany(rows: any[]) {
        if (!rows || rows.length === 0) return;

        await this.client.insert({
            table: 'events',
            format: 'JSONEachRow',
            values: rows
        });
    }

    async query(sql: string) {
        const res = await this.client.query({
            query: sql,
            format: 'JSONEachRow'
        })
        return res.json();
    }
}
