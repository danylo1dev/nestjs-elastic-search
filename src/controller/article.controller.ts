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
import CreateArticleDto from '../dto/create-article.dto';
import UpdateArticleDto from '../dto/update-article.dto';
import PaginationParamsDto from '../dto/pagination-params.dto';
import ArticleService from '../service/article.service';

@Controller('article')
export default class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  async getPosts(
    @Query('search') search: string,
    @Query() query: PaginationParamsDto,
  ) {
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
  async createPost(@Body() body: CreateArticleDto) {
    return this.articleService.createPost(body);
  }

  @Patch(':id')
  async updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateArticleDto,
  ) {
    return this.articleService.updatePost(Number(id), body);
  }

  @Delete(':id')
  async deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.articleService.deletePost(Number(id));
  }
}
