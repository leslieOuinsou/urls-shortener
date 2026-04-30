import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// Global pour éviter de l'importer dans chaque module qui en a besoin
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
