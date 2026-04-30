"use client"
import { useState } from "react";
import { useSession } from "next-auth/react";
import { createShortUrl } from "@/app/actions";

export default function ShortenerForm() {
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { data: session } = useSession();

    async function clientAction(formData: FormData) {
        setLoading(true);
        const res = await createShortUrl(formData);
        setLoading(false);
        if (res.success && res.shortUrl) {
            setResultUrl(res.shortUrl);
        } else {
            alert(res.message);
        }
    }

    return (
        <div className="flex flex-col items-center gap-6">
            <form action={clientAction} className="flex flex-col gap-4 w-[38rem] max-w-full bg-white/5 p-6 rounded-xl border border-white/10">
                <div className="mx-auto w-full md:w-[34rem]">
                    <label htmlFor="url" className="block text-sm font-medium text-heading">Url long *</label>
                    <input type="url" id="url" name="url" className="bg-neutral-secondary-medium border border-default-medium text-heading text-xs rounded-lg focus:ring-brand focus:border-brand block w-full px-3 py-1.5 shadow-xs placeholder:text-body" placeholder="https://example.com" required />
                </div>
                <div className="mx-auto w-full md:w-[34rem]">
                    <label htmlFor="customCode" className="block text-sm font-medium text-heading">Personnalisé la fin du lien</label>
                    <div className="relative w-full">
                        <input name="customCode" type="text" className="bg-neutral-secondary-medium border border-default-medium text-heading text-xs rounded-lg focus:ring-brand focus:border-brand block w-full px-3 py-1.5 pr-10 shadow-xs placeholder:text-body" placeholder="Personnalisé la fin du lien" maxLength={10} />
                        <div className="group absolute inset-y-0 right-2 flex items-center">
                            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white cursor-help">i</span>
                            <div className="pointer-events-none absolute right-0 top-7 z-10 hidden w-72 rounded-lg border border-blue-200 bg-white p-2 text-xs text-gray-700 shadow-lg group-hover:block">
                                Choisissez un mot court et memorable qui apparaitra dans votre lien.
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mx-auto w-full md:w-[34rem]">
                    <label htmlFor="ttl" className="block text-sm font-medium text-heading">Durée de validité</label>
                    <select name="ttl" className="bg-neutral-secondary-medium border border-default-medium text-heading text-xs rounded-lg focus:ring-brand focus:border-brand block w-full px-3 py-1.5 shadow-xs placeholder:text-body">
                        <option value="24h" className="text-black">Expire dans 24 Heures</option>
                        <option value="7d" className="text-black">Expire dans 7 Jours</option>
                        {session && (
                            <option value="permanent" className="text-black">Permanent (Compte requis)</option>
                        )}
                    </select>
                </div>

                <button type="submit" disabled={loading} className="text-white bg-blue-600 box-border cursor-pointer border border-transparent hover:bg-blue-700 focus:ring-4 focus:ring-blue-500 shadow-xs font-medium leading-5 rounded-lg text-sm px-4 py-2.5 focus:outline-none">
                    {loading ? "Raccourcissement..." : "Raccourcir"}
                </button>
            </form>

            {resultUrl && (
                <div className="mt-4 p-4 bg-green-500/20 border border-green-500 text-green-400 rounded-lg w-full max-w-sm text-center">
                    <p className="text-sm mb-1">C'est prêt !</p>
                    <a href={resultUrl} target="_blank" rel="noopener noreferrer"
                        className="font-mono font-bold break-all hover:underline">
                        {resultUrl}
                    </a>
                    <button
                        onClick={() => navigator.clipboard.writeText(resultUrl)}
                        className="mt-2 text-xs underline hover:text-white"
                    >
                        Copier le lien
                    </button>
                </div>
            )}
        </div>
    );
}