import { DataSource } from "typeorm";
import { User } from "../components/users/data-access/user.entity";
import { Post } from "../components/posts/data-access/post.entity";
import dotenv from 'dotenv';
import path from 'path';

// Load test environment variables
dotenv.config({ path: path.join(__dirname, '../../.env.test') });

export const TestDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "3306"),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.TEST_DB_NAME, // Use test database
    entities: [User, Post],
    synchronize: true, // Auto-sync for test database
    dropSchema: true, // Drop schema for clean tests
    logging: false
});