import { IPostRepository, CreatePostDTO, UpdatePostDTO, Post } from './post';
import { AppError } from '../../../libraries/error-handler';
import logger from '../../../libraries/logger';

export class PostService {
    constructor(private postRepository: IPostRepository) {}

    async createPost(userId: string, postData: CreatePostDTO): Promise<Post> {
        try {
            const post = await this.postRepository.create({
                ...postData,
                userId
            });
            logger.info({ postId: post.id }, 'Post created successfully');
            return post;
        } catch (error) {
            logger.error(error, 'Error creating post');
            throw new AppError(500, 'Error creating post');
        }
    }

    async getPost(id: string): Promise<Post> {
        const post = await this.postRepository.findById(id);
        if (!post) {
            throw new AppError(404, 'Post not found');
        }
        return post;
    }

    async getUserPosts(userId: string): Promise<Post[]> {
        return this.postRepository.findByUser(userId);
    }

    async updatePost(id: string, userId: string, postData: UpdatePostDTO): Promise<Post> {
        const post = await this.getPost(id);
        if (post.userId !== userId) {
            throw new AppError(403, 'Unauthorized to update this post');
        }

        return this.postRepository.update(id, postData);
    }

    async deletePost(id: string, userId: string): Promise<void> {
        const post = await this.getPost(id);
        if (post.userId !== userId) {
            throw new AppError(403, 'Unauthorized to delete this post');
        }

        await this.postRepository.delete(id);
    }

    async getAllPosts(onlyPublished = true): Promise<Post[]> {
        return this.postRepository.findAll({ published: onlyPublished });
    }
}