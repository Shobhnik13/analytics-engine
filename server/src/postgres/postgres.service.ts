import { Injectable, OnModuleInit } from "@nestjs/common";
import { Client } from "pg"
import { logger } from "src/common/logger";

@Injectable()
export class PostgresService implements OnModuleInit {
    private client: Client

    constructor() {
        // setting up singleton client instance
        this.client = new Client({
            host: process.env.POSTGRES_HOST || 'localhost',
            port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
            user: process.env.POSTGRES_USER || 'insightuser',
            password: process.env.POSTGRES_PASSWORD || 'insightpass',
            database: process.env.POSTGRES_DB || 'insightplus'
        })
    }

    async onModuleInit() {
        await this.client.connect();
        await this.client.query(`
            CREATE TABLE IF NOT EXISTS events (
                uuid TEXT PRIMARY KEY,
                event TEXT NOT NULL,
                distinct_id TEXT NOT NULL,
                properties JSONB,
                event_timestamp TIMESTAMPTZ DEFAULT NOW()
                )`)
        logger.info("CURRENT DB IS POSTGRES, CHANGE TO CLICKHOUSE IN .ENV FILE")
        logger.info("[INFO] POSTGRES CLIENT SETUP COMPLETED AND TABLES ARE READY");
    }

    async insertMany(rows: any[]) {
        if (!rows || rows.length === 0) return;

        // unoptimized shit
        // for every row, the pg driver will take a new round trip and open closes the connection
        // so if 1k inserts then 1k round trips will happen
        // so this is very slow for large data inserts

        // const q = `INSERT INTO events (uuid, event, distinct_id, properties, event_timestamp)
        //   VALUES ($1, $2, $3, $4, $5)
        //  ON CONFLICT (uuid) DO NOTHING;`
        // for (const r of rows) {
        //     await this.client.query(q, [
        //         r.uuid,
        //         r.event,
        //         r.distinct_id,
        //         JSON.stringify(r.properties),
        //         r.event_timestamp
        //     ]
        //     )
        // }


        // optimized batch insert
        // we will preserve round trips
        // only 1 trip for these rows

        const q = `INSERT INTO events (uuid, event, distinct_id, properties, event_timestamp) 
        VALUES ${rows.map((_, i) => `($${i * 5 + 1}, $${i * 5 + 2}, $${i * 5 + 3}, $${i * 5 + 4}, $${i * 5 + 5})`).join(',')} 
        ON CONFLICT (uuid) DO NOTHING;`;

        // this will make smth like
        // $1,$2,$3,$4,$5,$6,$7,$8,$9,$10 for 2 rows
        // so only 1 query will execute for multiple rows

        // this is basically flattening the rows array of objects into a single array of values
        // so that we can pass it to the query like $1,$2,...
        // but if we didnt flatten it would have been [[row1_values],[row2_values],...]

        const valsToInsert = rows.flatMap(r => [
            r.uuid,
            r.event,
            r.distinct_id,
            JSON.stringify(r.properties),
            new Date(r.event_timestamp)
        ])

        await this.client.query(q, valsToInsert)
    }

    async query(sql: string) {
        const res = await this.client.query(sql)
        return res.rows
    }
}