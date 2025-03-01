import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import CryptoJS from "crypto-js";

const convertBigIntToString = (obj: any) => {
    for (const key in obj) {
        if (typeof obj[key] === 'bigint') {
            obj[key] = obj[key].toString();
        }
    }
    return obj;
};

export async function PUT(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "No autorizado" }, { status: 401 });
        }

        const { currentPassword, newLanguage } = await request.json();
        const hashedPassword = CryptoJS.SHA256(currentPassword).toString();

        const user = await prisma.usuarios.findUnique({
            where: { Usuario: session.user.name },
        });

        if (!user || user.Clave !== hashedPassword) {
            return NextResponse.json({ message: "Contraseña incorrecta" }, { status: 401 });
        }

        const updatedUser = await prisma.usuarios.update({
            where: { Usuario: session.user.name },
            data: { Idioma: newLanguage },
        });

        return NextResponse.json({ message: "Idioma actualizado correctamente", updatedUser: convertBigIntToString(updatedUser) });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}