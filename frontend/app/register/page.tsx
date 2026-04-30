"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { register } from "@/app/actions/register";

export default function RegisterPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError(null);

        const res = await register(formData);

        setLoading(false);

        if (!res.success) {
            setError(res.message ?? "Une erreur est survenue.");
        } else {
            router.push("/login");
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center">
            <div className="flex flex-col gap-4 w-full max-w-md bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h1 className="text-black text-xl font-bold text-center">Inscription</h1>

                {error && (
                    <p className="text-red-400 text-sm text-center">{error}</p>
                )}

                <form action={handleSubmit} className="flex flex-col gap-4">
                    <input
                        name="name"
                        type="text"
                        placeholder="Nom (optionnel)"
                        className="w-full md:w-[26rem] text-black placeholder:text-gray-500 p-3 text-base rounded-lg border border-gray-300 bg-white"
                    />
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        required
                        className="w-full md:w-[26rem] text-black placeholder:text-gray-500 p-3 text-base rounded-lg border border-gray-300 bg-white"
                    />
                    <div className="relative">
                        <input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Mot de passe"
                            required
                            className="w-full md:w-[26rem] text-black placeholder:text-gray-500 p-3 pr-11 text-base rounded-lg border border-gray-300 bg-white"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                            className="absolute inset-y-0 right-0 px-3 text-gray-500 hover:text-gray-700"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                className="h-5 w-5"
                                aria-hidden="true"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12S5.25 6.75 12 6.75 21.75 12 21.75 12 18.75 17.25 12 17.25 2.25 12 2.25 12Z" />
                                <circle cx="12" cy="12" r="3" />
                                {showPassword && (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 20 20 4" />
                                )}
                            </svg>
                        </button>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition p-3 rounded-lg font-bold text-white"
                    >
                        {loading ? "Inscription..." : "S'inscrire"}
                    </button>
                </form>

                <p className="text-gray-600 text-sm text-center">
                    Déjà un compte ?{" "}
                    <Link href="/login" className="text-blue-400 hover:underline">
                        Se connecter
                    </Link>
                </p>
            </div>
        </main>
    );
}