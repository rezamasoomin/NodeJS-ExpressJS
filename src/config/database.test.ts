import { DataSource } from "typeorm";
import { User } from "../components/users/data-access/user.entity";
import { Post } from "../components/posts/data-access/post.entity";

export const TestDataSource = new DataSource({
    type: "sqlite",
    database: ":memory:",
    entities: [User, Post],
    synchronize: true,
    logging: false
});