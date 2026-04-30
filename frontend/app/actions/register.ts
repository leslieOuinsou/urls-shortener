"use server"
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function register(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;

    if (!email || !password) {
        return { success: false, message: "Email et mot de passe requis." };
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        return { success: false, message: "Cet email est déjà utilisé." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
        data: { email, password: hashedPassword, name },
    });

    return { success: true };
}