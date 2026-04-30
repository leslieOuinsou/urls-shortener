import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUrlDto } from './dto/create-url.dto';

@Injectable()
export class UrlsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUrlDto) {
    const { longUrl, customCode, ttl, userId } = dto;

    const shortCode = (customCode?.trim() || this.generateCode()).toLowerCase();

    // Calcul de l'expiration selon le TTL choisi
    let expiresAt: Date | null = null;
    const now = new Date();

    if (!userId || ttl === '24h') {
      // Anonymes et TTL 24h → expire demain
      expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    } else if (ttl === '7d') {
      expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    }
    // ttl === 'permanent' && userId → expiresAt reste null

    try {
      const link = await this.prisma.link.create({
        data: {
          shortCode,
          longUrl,
          expiresAt,
          userId: userId ?? null,
        },
      });

      return link;
    } catch {
      throw new BadRequestException('Ce code est déjà utilisé. Veuillez en choisir un autre.');
    }
  }

  async findByCode(shortCode: string) {
    const link = await this.prisma.link.findUnique({
      where: { shortCode: shortCode.toLowerCase() },
    });

    if (!link) {
      throw new NotFoundException('Ce lien raccourci est introuvable.');
    }

    if (link.expiresAt && link.expiresAt < new Date()) {
      throw new NotFoundException('Ce lien raccourci a expiré.');
    }

    return link;
  }

  async findAll(userId?: number) {
    if (userId) {
      return this.prisma.link.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
    }

    return this.prisma.link.findMany({ orderBy: { createdAt: 'desc' } });
  }

  // Utilitaire de test — supprime tout, non exposé en production
  async resetAll() {
    await this.prisma.link.deleteMany();
    await this.prisma.user.deleteMany();
  }

  private generateCode(): string {
    return Math.random().toString(36).substring(2, 8);
  }
}
