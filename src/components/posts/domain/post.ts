import { z } from 'zod';

export const CreatePostSchema = z.object({
    title: z.string().min(3).max(100),
    content: z.string().min(10),
    published: z.boolean().optional().default(false)
});

export const UpdatePostSchema = CreatePostSchema.partial();

export type CreatePostDTO = z.infer<typeof CreatePostSchema>;
export type UpdatePostDTO = z.infer<typeof UpdatePostSchema>;

export interface IPostRepository {
    create(post: CreatePostDTO & { userId: string }): Promise<Post>;
    findById(id: string): Promise<Post | null>;
    findByUser(userId: string): Promise<Post[]>;
    update(id: string, post: UpdatePostDTO): Promise<Post>;
    delete(id: string): Promise<void>;
    findAll(options?: { published?: boolean }): Promise<Post[]>;
}

export interface Post {
    id: string;
    title: string;
    content: string;
    published: boolean;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}