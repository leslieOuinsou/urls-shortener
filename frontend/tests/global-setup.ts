async function globalSetup() {
    // Réinitialise la base via le backend (bloqué en production)
    const backendUrl = process.env.BACKEND_URL ?? 'http://localhost:3001';
    await fetch(`${backendUrl}/urls/test-reset`, { method: 'DELETE' });
}

export default globalSetup;