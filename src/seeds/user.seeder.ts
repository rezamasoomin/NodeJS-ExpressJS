import { DataSource } from "typeorm";
import { User } from "../components/users/data-access/user.entity";
import bcrypt from "bcrypt";

export class UserSeeder {
    constructor(private dataSource: DataSource) {}

    async run() {
        const userRepository = this.dataSource.getRepository(User);

        // Check if admin already exists
        const existingAdmin = await userRepository.findOne({ where: { email: "admin@example.com" } });
        if (existingAdmin) {
            return;
        }

        // Create admin user
        const adminPassword = await bcrypt.hash("Admin123!", 10);
        const admin = userRepository.create({
            name: "Admin User",
            email: "admin@example.com",
            password: adminPassword,
            isActive: true
        });

        await userRepository.save(admin);

        // Create test users
        const testUsers = [];
        for (let i = 1; i <= 5; i++) {
            const password = await bcrypt.hash(`TestUser${i}123!`, 10);
            testUsers.push(userRepository.create({
                name: `Test User ${i}`,
                email: `test${i}@example.com`,
                password: password,
                isActive: true
            }));
        }

        await userRepository.save(testUsers);
    }
}
