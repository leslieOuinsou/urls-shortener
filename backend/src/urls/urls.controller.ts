import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from './dto/create-url.dto';

@Controller('urls')
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  // Créer un lien raccourci
  @Post()
  async create(@Body() dto: CreateUrlDto) {
    const link = await this.urlsService.create(dto);
    const baseUrl = process.env.FRONTEND_URL ?? 'http://localhost:3000';

    return {
      shortCode: link.shortCode,
      shortUrl: `${baseUrl}/${link.shortCode}`,
      longUrl: link.longUrl,
      expiresAt: link.expiresAt,
      createdAt: link.createdAt,
    };
  }

  // Lister tous les liens (ou filtrer par userId)
  @Get()
  findAll(@Query('userId') userId?: string) {
    return this.urlsService.findAll(userId ? parseInt(userId, 10) : undefined);
  }

  // Récupérer les infos d'un lien par son shortCode (utilisé par le frontend pour la redirection)
  @Get(':shortCode')
  findOne(@Param('shortCode') shortCode: string) {
    return this.urlsService.findByCode(shortCode);
  }

  // Réinitialisation de la base pour les tests — bloqué en production
  @Delete('test-reset')
  async testReset() {
    if (process.env.NODE_ENV === 'production') {
      return { error: 'Interdit en production.' };
    }
    await this.urlsService.resetAll();
    return { success: true };
  }
}
