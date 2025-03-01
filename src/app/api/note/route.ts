import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const getModel = (table: string) => {
    switch (table) {
        case 'lavados':
            return prisma.lavados;
        case 'clientes':
            return prisma.clientes;
        case 'servicios':
            return prisma.servicios;
        case 'usuarios':
            return prisma.usuarios;
        default:
            throw new Error('Invalid table name');
    }
};

const convertBigIntToString = (obj: any) => {
    for (const key in obj) {
        if (typeof obj[key] === 'bigint') {
            obj[key] = obj[key].toString();
        }
    }
    return obj;
};

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const table = url.searchParams.get('table');
        if (!table) {
            throw new Error('Table parameter is missing');
        }

        const model = getModel(table);
        const records = await model.findMany();
        const convertedRecords = records.map(convertBigIntToString);

        return NextResponse.json(convertedRecords);
    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
            return NextResponse.json({
                message: error.message
            }, {
                status: 500,
            });
        }
    }
}

export async function POST(request: Request) {
    try {
        const url = new URL(request.url);
        const table = url.searchParams.get('table');
        if (!table) {
            throw new Error('Table parameter is missing');
        }

        const model = getModel(table);
        const data = await request.json();
        const record = await model.create({ data });
        const convertedRecord = convertBigIntToString(record);

        return NextResponse.json(convertedRecord);
    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
            return NextResponse.json({
                message: error.message
            }, {
                status: 500,
            });
        }
    }
}
