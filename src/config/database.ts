import { DataSource } from "typeorm";
import { User } from "../components/users/data-access/user.entity";
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "nodejs_best_practices",
  synchronize: process.env.NODE_ENV === "development", // Don't use in production
  logging: process.env.NODE_ENV === "development",
  entities: [User],
  migrations: ["src/migrations/*.ts"],
  subscribers: [],
});