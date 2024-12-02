import { Repository, DataSource } from 'typeorm';
import { Post } from './post.entity';
import { IPostRepository, CreatePostDTO, UpdatePostDTO } from '../domain/post';
import { AppError } from '../../../libraries/error-handler';

export class PostRepository implements IPostRepository {
    private repository: Repository<Post>;

    constructor(dataSource: DataSource) {
        this.repository = dataSource.getRepository(Post);
    }

    async create(postData: CreatePostDTO & { userId: string }): Promise<Post> {
        const post = this.repository.create(postData);
        return this.repository.save(post);
    }

    async findById(id: string): Promise<Post | null> {
        const post = await this.repository.findOne({
            where: { id },
            relations: ['user']
        });
        return post;
    }

    async findByUser(userId: string): Promise<Post[]> {
        return this.repository.find({
            where: { userId },
            order: { createdAt: 'DESC' }
        });
    }

    async update(id: string, postData: UpdatePostDTO): Promise<Post> {
        const post = await this.findById(id);
        if (!post) {
            throw new AppError(404, 'Post not found');
        }

        const updatedPost = this.repository.merge(post, postData);
        return this.repository.save(updatedPost);
    }

    async delete(id: string): Promise<void> {
        const result = await this.repository.delete(id);
        if (!result.affected) {
            throw new AppError(404, 'Post not found');
        }
    }

    async findAll(options?: { published?: boolean }): Promise<Post[]> {
        const where = options?.published !== undefined ? { published: options.published } : {};
        return this.repository.find({
            where,
            order: { createdAt: 'DESC' },
            relations: ['user']
        });
    }
}