import { NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:3001';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ shortCode: string }> }
) {
    const { shortCode } = await params;

    try {
        const res = await fetch(`${BACKEND_URL}/urls/${shortCode.toLowerCase()}`);

        if (!res.ok) {
            return NextResponse.redirect(new URL('/', request.url));
        }

        const link = await res.json();
        return NextResponse.redirect(link.longUrl);
    } catch {
        return NextResponse.redirect(new URL('/', request.url));
    }
}