import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import ArticleService from '../service/article.service';

@Controller('article')
export default class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  async getPosts(@Query('search') search: string, @Query() query: any) {
    const { limit, offset, startId } = query;

    if (search) {
      return this.articleService.searchForPosts(search, offset, limit, startId);
    }
    return this.articleService.getPostsWithAuthors(offset, limit, startId);
  }

  @Get(':id')
  getPostById(@Param('id', ParseIntPipe) id: number) {
    return this.articleService.getPostById(Number(id));
  }

  @Post()
  async createPost(@Body() body: any) {
    return this.articleService.createPost(body);
  }

  @Patch(':id')
  async updatePost(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.articleService.updatePost(Number(id), body);
  }

  @Delete(':id')
  async deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.articleService.deletePost(Number(id));
  }
}
