import {
  Injectable,
  Logger,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, MoreThan, Repository } from 'typeorm';
import Article from '../entity/article.entity';

@Injectable()
export default class ArticleService {
  constructor(
    @InjectRepository(Article)
    private postsRepository: Repository<Article>,
  ) {}

  async getPosts(
    offset?: number,
    limit?: number,
    startId?: number,
    options?: FindManyOptions<Article>,
  ) {
    const where: FindManyOptions<Article>['where'] = {};
    let separateCount = 0;
    if (startId) {
      where.id = MoreThan(startId);
      separateCount = await this.postsRepository.count();
    }

    const [items, count] = await this.postsRepository.findAndCount({
      where,
      order: {
        id: 'ASC',
      },
      skip: offset,
      take: limit,
      ...options,
    });

    return {
      items,
      count: startId ? separateCount : count,
    };
  }

  async getPostsWithAuthors(offset?: number, limit?: number, startId?: number) {
    return this.getPosts(offset, limit, startId);
  }

  async getPostById(id: number) {
    const post = await this.postsRepository.findOne({
      where: { id },
    });
    if (post) {
      return post;
    }
    Logger.warn('Tried to access a post that does not exist');
    throw new NotFoundException(`Post with id ${id} not found`);
  }

  async createPost(body: any) {
    const newPost = await this.postsRepository.create(body);
    await this.postsRepository.save(newPost);
    return newPost;
  }

  async updatePost(id: number, post: any) {
    await this.postsRepository.update(id, post);
    const updatedPost = await this.postsRepository.findOne({
      where: {
        id,
      },
    });
    if (updatedPost) {
      return updatedPost;
    }
    throw new NotFoundException(`Post with id ${id} not found`);
  }

  async deletePost(id: number) {
    const deleteResponse = await this.postsRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
  }

  async searchForPosts(
    text: string,
    offset?: number,
    limit?: number,
    startId?: number,
  ) {
    throw new NotImplementedException();
  }
}
