"use server"
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3001";

export async function createShortUrl(formData: FormData) {
    const longUrl = formData.get("url") as string;
    const customCode = formData.get("customCode") as string;
    const ttlChoice = formData.get("ttl") as string;

    // Récupère l'utilisateur connecté via NextAuth
    const session = await auth();
    const user = session?.user ?? null;

    // On récupère l'id numérique depuis la DB pour l'associer au lien
    const dbUser = user?.email
        ? await prisma.user.findUnique({ where: { email: user.email } })
        : null;

    try {
        const res = await fetch(`${BACKEND_URL}/urls`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                longUrl,
                customCode: customCode?.trim() || undefined,
                ttl: ttlChoice,
                userId: dbUser?.id ?? undefined,
            }),
        });

        if (!res.ok) {
            return { success: false, message: "Ce code est déjà utilisé ou une erreur est survenue." };
        }

        const data = await res.json();
        return { success: true, shortUrl: data.shortUrl };
    } catch {
        return { success: false, message: "Impossible de contacter le serveur. Réessayez." };
    }
}