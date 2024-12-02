import { z } from 'zod';

export const CreatePostSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title must not exceed 100 characters'),
    content: z.string().min(10, 'Content must be at least 10 characters'),
    published: z.boolean().optional().default(false)
});

export const UpdatePostSchema = CreatePostSchema.partial();

export type CreatePostDTO = z.infer<typeof CreatePostSchema>;
export type UpdatePostDTO = z.infer<typeof UpdatePostSchema>;