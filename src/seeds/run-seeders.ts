import { initializeDatabase } from "../config/database";
import { UserSeeder } from "./user.seeder";
import logger from "../libraries/logger";

async function runSeeders() {
    try {
       
        logger.info("Running seeders...");

        const userSeeder = new UserSeeder(await initializeDatabase());
        await userSeeder.run();

        logger.info("Seeders completed successfully");
        process.exit(0);
    } catch (error) {
        logger.error("Error running seeders:", error);
        process.exit(1);
    }
}

runSeeders();
