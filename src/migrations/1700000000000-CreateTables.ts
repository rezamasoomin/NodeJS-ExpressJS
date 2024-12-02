import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1700000000000 implements MigrationInterface {
    name = 'CreateTables1700000000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create users table
        await queryRunner.query(`
            CREATE TABLE users (
                id VARCHAR(36) NOT NULL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                isActive BOOLEAN NOT NULL DEFAULT true,
                createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);

        // Create posts table
        await queryRunner.query(`
            CREATE TABLE posts (
                id VARCHAR(36) NOT NULL PRIMARY KEY,
                title VARCHAR(100) NOT NULL,
                content TEXT NOT NULL,
                published BOOLEAN NOT NULL DEFAULT false,
                userId VARCHAR(36) NOT NULL,
                createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS posts`);
        await queryRunner.query(`DROP TABLE IF EXISTS users`);
    }
}