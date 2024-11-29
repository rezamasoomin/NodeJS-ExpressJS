import { DataSource } from "typeorm";
import { User } from "../components/users/data-access/user.entity";
import "reflect-metadata";

export const TestDataSource = new DataSource({
    name: "test",
    type: "sqlite",
    database: ":memory:",
    entities: [User],
    synchronize: true,
    logging: false,
    dropSchema: true
});

export const initializeTestDatabase = async () => {
    try {
        if (!TestDataSource.isInitialized) {
            await TestDataSource.initialize();
            console.log("Test database initialized");
        }
        return TestDataSource;
    } catch (error) {
        console.error("Error initializing test database:", error);
        throw error;
    }
};
