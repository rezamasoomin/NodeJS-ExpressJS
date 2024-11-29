import { z } from 'zod';

// User schema validation
export const UserSchema = z.object({
  id: z.string().optional(),
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(6)
});

export type User = z.infer<typeof UserSchema>;

export type UserDTO = Omit<User, 'password'>;

export interface IUserRepository {
  create(user: User): Promise<UserDTO>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<UserDTO | null>;
  update(id: string, user: Partial<User>): Promise<UserDTO>;
  delete(id: string): Promise<void>;
}