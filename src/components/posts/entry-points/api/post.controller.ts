import { Request, Response, NextFunction } from 'express';
import { PostService } from '../../domain/post.service';
import { CreatePostSchema, UpdatePostSchema } from '../../domain/post.validation';
import { AuthenticatedRequest } from '../../../auth/entry-points/api/auth.middleware';
import { AppError } from '../../../../libraries/error-handler';

export class PostController {
    constructor(private postService: PostService) {}

    createPost = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            // Validate input
            const validationResult = CreatePostSchema.safeParse(req.body);
            if (!validationResult.success) {
                throw new AppError(400, validationResult.error.errors[0].message);
            }

            // Pass userId and postData separately to match service signature
            const post = await this.postService.createPost(
                req.user!.userId,
                validationResult.data
            );

            res.status(201).json(post);
        } catch (error) {
            next(error);
        }
    };

    updatePost = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            // Validate input
            const validationResult = UpdatePostSchema.safeParse(req.body);
            if (!validationResult.success) {
                throw new AppError(400, validationResult.error.errors[0].message);
            }

            const post = await this.postService.updatePost(
                req.params.id,
                req.user!.userId,
                validationResult.data
            );

            res.json(post);
        } catch (error) {
            next(error);
        }
    };

    // ... other controller methods
    
    getPost = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const post = await this.postService.getPost(req.params.id);
            res.json(post);
        } catch (error) {
            next(error);
        }
    };

    getAllPosts = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const published = req.query.published !== 'false';
            const posts = await this.postService.getAllPosts(published);
            res.json(posts);
        } catch (error) {
            next(error);
        }
    };

    deletePost = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            await this.postService.deletePost(req.params.id, req.user!.userId);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    };
}