import jwt from 'jsonwebtoken';
import { User } from '../../src/components/users/data-access/user.entity';
import { TestDataSource } from '../../src/config/database.test';
import bcrypt from 'bcrypt';

export class TestHelper {
  static async createTestUser() {
    const userRepository = TestDataSource.getRepository(User);
    const hashedPassword = await bcrypt.hash('TestPass123!', 10);
    
    const user = userRepository.create({
      name: 'Test User',
      email: 'test@test.com',
      password: hashedPassword,
      isActive: true
    });
    
    await userRepository.save(user);
    return user;
  }

  static generateTestToken(user: User) {
    return jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '1h' }
    );
  }
}