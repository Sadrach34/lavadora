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

        const { currentPassword, newPassword } = await request.json();
        const hashedCurrentPassword = CryptoJS.SHA256(currentPassword).toString();

        const user = await prisma.usuarios.findUnique({
            where: { Usuario: session.user.name },
        });

        if (!user || user.Clave !== hashedCurrentPassword) {
            return NextResponse.json({ message: "Contraseña actual incorrecta" }, { status: 401 });
        }

        const hashedNewPassword = CryptoJS.SHA256(newPassword).toString();

        const updatedUser = await prisma.usuarios.update({
            where: { Usuario: session.user.name },
            data: { Clave: hashedNewPassword },
        });

        return NextResponse.json({ message: "Contraseña actualizada correctamente", updatedUser: convertBigIntToString(updatedUser) });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}