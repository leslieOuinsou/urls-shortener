"use client"
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError(null);

        const res = await signIn("credentials", {
            email: formData.get("email"),
            password: formData.get("password"),
            redirect: false,
        });

        setLoading(false);

        if (res?.error) {
            setError("Email ou mot de passe incorrect.");
        } else {
            router.push("/");
            router.refresh();
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center">
            <div className="flex flex-col gap-4 w-full max-w-md bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h1 className="text-black text-xl font-bold text-center">Connexion</h1>

                {error && (
                    <p className="text-red-400 text-sm text-center">{error}</p>
                )}

                <form action={handleSubmit} className="flex flex-col gap-4">
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
                            {showPassword ? "🙈" : "👁"}
                        </button>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition p-3 rounded-lg font-bold text-white"
                    >
                        {loading ? "Connexion..." : "Se connecter"}
                    </button>
                </form>

                <p className="text-gray-600 text-sm text-center">
                    Pas de compte ?{" "}
                    <Link href="/register" className="text-blue-400 hover:underline">
                        S'inscrire
                    </Link>
                </p>
            </div>
        </main>
    );
}