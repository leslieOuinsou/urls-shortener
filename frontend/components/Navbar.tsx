"use client"

import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
    const { data: session } = useSession();

    return (
        <nav className="bg-black fixed w-full z-20 top-0 start-0 border-b border-gray-200">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                  
                    <span className="self-center text-xl text-white font-semibold whitespace-nowrap">URL Shortener</span>
                </Link>
                <div className="flex md:order-2 items-center gap-3">
                    {session ? (
                        <button
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className="text-white bg-red-600 hover:bg-red-700 box-border border border-transparent focus:ring-4 shadow-xs font-medium leading-5 rounded-base text-sm px-3 py-2 focus:outline-none"
                        >
                            Déconnexion
                        </button>
                    ) : (
                        <>
 <Link href="/login"className="text-black bg-white hover:bg-gray-100 border border-gray-300 font-medium rounded-lg text-sm px-3 py-2 focus:outline-none">Connexion</Link>
 <Link href="/register" className="text-black bg-white hover:bg-gray-100 border border-gray-300 font-medium rounded-lg text-sm px-3 py-2 focus:outline-none"> Inscription</Link>
                        </>
                    )}
                    <button data-collapse-toggle="navbar-sticky" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-body rounded-base md:hidden hover:bg-neutral-secondary-soft hover:text-heading focus:outline-none focus:ring-2 focus:ring-neutral-tertiary" aria-controls="navbar-sticky" aria-expanded="false">
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h14" /></svg>
                    </button>
                </div>
                <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
                    <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-default rounded-base bg-neutral-secondary-soft md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-neutral-primary">
                        {session && (
                            <li>
                                <Link href="/history" className="block py-2 px-3 text-white bg-gray-100 rounded-sm md:bg-transparent md:text-black md:p-0 hover:underline" aria-current="page">Historique</Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}