import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        // Obtener todas las Lavado
        const Lavado = await prisma.lavados.findMany();
        
        // Obtener todos los usuarios
        const usuarios = await prisma.usuarios.findMany();

        // Crear un mapa de usuarios para acceso rápido
        const usuariosMap = new Map();
        usuarios.forEach(usuario => {
            usuariosMap.set(usuario.id_usuario.toString(), usuario.Usuario);
        });

        // Combinar los datos de Lavado y usuarios
        const LavadoUsuariosSerialized = Lavado.map(Lavado => ({
            id_Lavado: Lavado.ID_lavado.toString(),
            usuario: usuariosMap.get(Lavado.ID_usuario?.toString()) || 'N/A',
        }));

        return NextResponse.json(LavadoUsuariosSerialized);

    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({
                message: error.message
            }, {
                status: 500,
            });
        }
    }
}