import { IsIn, IsNumber, IsOptional, IsString, IsUrl, MaxLength, Min } from 'class-validator';

export class CreateUrlDto {
  @IsUrl({}, { message: "L'URL fournie n'est pas valide." })
  longUrl: string;

  @IsOptional()
  @IsString()
  @MaxLength(10, { message: 'Le code personnalisé ne peut pas dépasser 10 caractères.' })
  customCode?: string;

  // 24h, 7d ou permanent — les non-connectés sont forcés à 24h dans le service
  @IsOptional()
  @IsIn(['24h', '7d', 'permanent'])
  ttl?: string;

  // Identifiant de l'utilisateur connecté, fourni par le frontend après vérification de session
  @IsOptional()
  @IsNumber()
  @Min(1)
  userId?: number;
}
