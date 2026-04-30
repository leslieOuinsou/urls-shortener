import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';

/**
 * Tests fonctionnels — on lance l'application complète avec vraie DB de test.
 * Prérequis : DATABASE_URL pointe sur une base de test (db-test dans docker-compose).
 */
describe('UrlsController (fonctionnel)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    // Nettoyage de la base de test avant les tests
    await request(app.getHttpServer()).delete('/urls/test-reset');
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /urls — création d\'un lien raccourci', () => {
    it('crée un lien valide et retourne shortCode + shortUrl', async () => {
      const res = await request(app.getHttpServer())
        .post('/urls')
        .send({ longUrl: 'https://example.com', ttl: '24h' });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('shortCode');
      expect(res.body).toHaveProperty('shortUrl');
      expect(res.body.shortUrl).toContain(res.body.shortCode);
    });

    it('crée un lien avec un code personnalisé', async () => {
      const code = `tc${Date.now()}`.slice(0, 8);

      const res = await request(app.getHttpServer())
        .post('/urls')
        .send({ longUrl: 'https://example.com', customCode: code, ttl: '7d' });

      expect(res.status).toBe(201);
      expect(res.body.shortCode).toBe(code);
    });

    it('rejette une URL invalide avec une erreur 400', async () => {
      const res = await request(app.getHttpServer())
        .post('/urls')
        .send({ longUrl: 'pas-une-url-valide' });

      expect(res.status).toBe(400);
    });

    it('rejette un code personnalisé trop long (> 10 chars)', async () => {
      const res = await request(app.getHttpServer())
        .post('/urls')
        .send({ longUrl: 'https://example.com', customCode: 'codebientroplongpouretre' });

      expect(res.status).toBe(400);
    });

    it('retourne 400 si le shortCode est déjà utilisé', async () => {
      const code = `dup${Date.now()}`.slice(0, 8);

      await request(app.getHttpServer())
        .post('/urls')
        .send({ longUrl: 'https://example.com', customCode: code });

      const res = await request(app.getHttpServer())
        .post('/urls')
        .send({ longUrl: 'https://autre.com', customCode: code });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /urls — listing des liens', () => {
    it('retourne un tableau de liens', async () => {
      const res = await request(app.getHttpServer()).get('/urls');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('GET /urls/:shortCode — récupération d\'un lien', () => {
    it('retourne les infos du lien pour un code valide', async () => {
      const createRes = await request(app.getHttpServer())
        .post('/urls')
        .send({ longUrl: 'https://example.com', ttl: '24h' });

      const { shortCode } = createRes.body;

      const res = await request(app.getHttpServer()).get(`/urls/${shortCode}`);

      expect(res.status).toBe(200);
      expect(res.body.shortCode).toBe(shortCode);
      expect(res.body.longUrl).toBe('https://example.com');
    });

    it('retourne 404 pour un code inexistant', async () => {
      const res = await request(app.getHttpServer()).get('/urls/code-qui-nexiste-pas');

      expect(res.status).toBe(404);
    });
  });
});
