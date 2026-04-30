# backend

Lancer du backend en local :
- npm install
- npm run start:dev

Build du backend :
- npm run build
- npm run start

Générer Prisma (si nécessaire) :
- npx prisma generate

Appliquer les migrations :
- npx prisma migrate deploy

Exécuter les tests backend :
- npm test

Commandes utiles :
- npm run test:watch
- npm run test:coverage

Reset de la base (endpoint de test) :
- DELETE http://localhost:3001/urls/test-reset