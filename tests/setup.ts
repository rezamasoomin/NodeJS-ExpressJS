import { beforeAll, afterAll, beforeEach } from '@jest/globals';
import { initializeTestDatabase, TestDataSource } from '../src/config/database.test';
import "reflect-metadata";

beforeAll(async () => {
    await initializeTestDatabase();
});

beforeEach(async () => {
    // Clear all tables
    try {
        const entities = TestDataSource.entityMetadatas;
        for (const entity of entities) {
            const repository = TestDataSource.getRepository(entity.name);
            await repository.clear();
        }
    } catch (error) {
        console.error('Error clearing test data:', error);
    }
});

afterAll(async () => {
    if (TestDataSource.isInitialized) {
        await TestDataSource.destroy();
    }
});
