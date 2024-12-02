import { beforeAll, afterAll, beforeEach } from '@jest/globals';
import { TestDataSource } from '../src/config/database.test';

beforeAll(async () => {
    try {
        await TestDataSource.initialize();
        console.log("Test database initialized");
    } catch (error) {
        console.error("Error initializing test database:", error);
        throw error;
    }
});

beforeEach(async () => {
    try {
        // Clear data in correct order due to foreign key constraints
        const entities = TestDataSource.entityMetadatas;
        const sortedEntities = entities.sort((a, b) => 
            b.foreignKeys.length - a.foreignKeys.length
        );

        for (const entity of sortedEntities) {
            const repository = TestDataSource.getRepository(entity.name);
            await repository.delete({});
        }
    } catch (error) {
        console.error("Error clearing test data:", error);
        throw error;
    }
});

afterAll(async () => {
    if (TestDataSource.isInitialized) {
        await TestDataSource.destroy();
    }
});