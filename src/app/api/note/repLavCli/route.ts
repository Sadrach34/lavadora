import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        // Obtener todos los lavados
        const lavados = await prisma.lavados.findMany();
        
        // Obtener todos los clientes
        const clientes = await prisma.clientes.findMany();

        // Crear un mapa de clientes para acceso rápido
        const clientesMap = new Map();
        clientes.forEach(cliente => {
            clientesMap.set(cliente.ID_cliente.toString(), cliente.cliente);
        });

        // Combinar los datos de lavados y clientes
        const lavadosClientesSerialized = lavados.map(lavado => ({
            id_lavados: lavado.ID_lavado.toString(),
            cliente: clientesMap.get(lavado.ID_cliente?.toString()) || 'N/A',
        }));

        return NextResponse.json(lavadosClientesSerialized);

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