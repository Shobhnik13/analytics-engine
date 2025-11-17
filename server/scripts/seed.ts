import axios from "axios";
import { logger } from "../src/common/logger";
import { dummyData } from "./duumyData";

const BASE_URL = "http://localhost:7002/api/v1/capture";

async function post(data: any) {
    try {
        const res = await axios.post(BASE_URL, data);
        logger.info("SENT:", data.event, "->", res.data.eventId);
    } catch (err: any) {
        logger.error("ERROR sending event:", data, err.response?.data || err.message);
    }
}

async function seed() {


    for (const e of dummyData) {
        await post(e);
    }

    logger.info("DONE SEEDING EVENTS");
} 

seed();
