import { Injectable, Optional } from "@nestjs/common";
import { ClickhouseService } from "src/clickhouse/clickhouse.service";
import { PostgresService } from "src/postgres/postgres.service";

@Injectable()
export class AnalyticsService {
    // database instance that contains all the service functions based on selected DB
    // boolean value to execute 
    private db: any
    private isClickhouse: boolean

    constructor(
        @Optional() private readonly click: ClickhouseService,
        @Optional() private readonly pg: PostgresService) {
        this.isClickhouse = process.env.DATABASE_TYPE === "clickhouse";
        this.db = this.isClickhouse ? this.click : this.pg;
    }

    // helper method to run queries on the selected database
    private runQuery(sqlPg: string, sqlCh: string) {
        return this.db.query(this.isClickhouse ? sqlCh : sqlPg)
    }

    // analytics methods

    // most used features
    async mostUsedFeatures() {
        return this.runQuery(
            // Postgres SQL
            `SELECT properties->>'feature' AS feature, COUNT(*) AS usage_count
             FROM events
             WHERE event='most_used_feature'
             GROUP BY feature
             ORDER BY usage_count DESC
             LIMIT 20`,

            // clickhouse SQL
            `SELECT JSON_VALUE(properties,'$.feature') AS feature, COUNT(*) AS usage_count
            FROM events
            WHERE event='most_used_feature
            GROUP BY feature
            ORDER BY usage_count DESC
            LIMIT20`
        )
    }



}