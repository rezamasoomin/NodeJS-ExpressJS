import { DataSource } from "typeorm";
import { User } from "../components/users/data-access/user.entity";
import { Post } from "../components/posts/data-access/post.entity";
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from the root .env file
dotenv.config({ path: path.join(__dirname, '../../.env') });

const dataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "3306"),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME, // This should be your main database
    entities: [User, Post],
    migrations: ["src/migrations/*.ts"],
    logging: true,
    synchronize: false
});

console.log('Migration config using database:', process.env.DB_NAME);

export default dataSource;