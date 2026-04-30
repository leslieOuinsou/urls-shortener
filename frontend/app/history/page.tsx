export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Link from "next/link";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3001";

type UserLink = {
    id: number;
    createdAt: string;
    shortCode: string;
    longUrl: string;
    expiresAt: string | null;
    userId: number | null;
};

export default async function HistoryPage() {
    const session = await auth();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

    if (!session?.user?.email) {
        return (
            <main className="min-h-screen pt-28 px-4">
                <section className="max-w-2xl mx-auto border border-gray-200 bg-white p-6">
                    <h1 className="text-2xl font-semibold text-gray-900">Historique réservé</h1>
                    <p className="mt-2 text-sm text-gray-600">Connectez-vous pour voir vos liens sauvegardés.</p>
                    <Link href="/login" className="inline-block mt-4 border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 hover:bg-gray-50">
                        Se connecter
                    </Link>
                </section>
            </main>
        );
    }

    try {
        // On récupère l'id de l'utilisateur depuis la DB (auth gérée côté frontend)
        const dbUser = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!dbUser) {
            return (
                <main className="min-h-screen pt-28 px-4">
                    <div className="max-w-2xl mx-auto border border-gray-200 bg-white p-6 text-sm text-gray-700">
                        Compte introuvable.
                    </div>
                </main>
            );
        }

        // On appelle le backend pour récupérer les liens de cet utilisateur
        const res = await fetch(`${BACKEND_URL}/urls?userId=${dbUser.id}`, {
            cache: "no-store",
        });

        const links: UserLink[] = res.ok ? await res.json() : [];
        const totalLinks = links.length;

        return (
            <main className="min-h-screen pt-28 pb-12 px-4">
                <section className="max-w-3xl mx-auto">
                    <header className="mb-6">
                        <h1 className="text-2xl font-semibold text-gray-900">Historique</h1>
                        <p className="mt-1 text-sm text-gray-600">{totalLinks} lien(s)</p>
                    </header>
                    {totalLinks === 0 ? (
                        <div className="border border-gray-200 bg-white p-6 text-sm text-gray-600">
                            Aucun lien pour le moment.
                        </div>
                    ) : (
                        <ul className="border border-gray-200 bg-white divide-y divide-gray-200">
                            {links.map((link: UserLink) => (
                                <li key={link.id} className="p-4">
                                    <Link
                                        href={`${baseUrl}/${link.shortCode}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm font-medium text-gray-900 hover:underline break-all"
                                    >
                                        {baseUrl}/{link.shortCode}
                                    </Link>
                                    <p className="mt-1 text-sm text-gray-600 break-all">{link.longUrl}</p>
                                    <p className="mt-2 text-xs text-gray-500">
                                        Créé le {new Date(link.createdAt).toLocaleDateString()}
                                        {link.expiresAt ? ` — Expire le ${new Date(link.expiresAt).toLocaleDateString()}` : " — Permanent"}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </main>
        );
    } catch {
        return (
            <main className="min-h-screen pt-28 px-4">
                <div className="max-w-2xl mx-auto border border-gray-200 bg-white p-6 text-sm text-gray-700">
                    Erreur de chargement de l'historique.
                </div>
            </main>
        );
    }
}