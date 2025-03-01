import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        // Obtener todas las lavados
        const lavados = await prisma.lavados.findMany();
        
        // Obtener todos los Servicios
        const Servicios = await prisma.servicios.findMany();

        // Crear un mapa de Servicios para acceso rápido
        const ServiciosMap = new Map();
        Servicios.forEach(servicio => {
            ServiciosMap.set(servicio.id_servicio.toString(), servicio.servicio);
        });

        // Combinar los datos de lavados y Servicios
        const lavadosServiciosSerialized = lavados.map(lavado => ({
            id_lavados: lavado.ID_lavado.toString(),
            servicio: ServiciosMap.get(lavado.ID_lavado?.toString()) || 'N/A',
        }));

        return NextResponse.json(lavadosServiciosSerialized);

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