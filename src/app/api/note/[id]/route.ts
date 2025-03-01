import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

interface Params { params: { id: string } }

const getModel = (table: string) => {
    switch (table) {
        case 'clientes':
            return prisma.clientes;
        case 'lavados':
            return prisma.lavados;
        case 'servicios':
            return prisma.servicios;
        case 'usuarios':
            return prisma.usuarios;
        default:
            throw new Error('Invalid table name');
    }
};

const getIdField = (table: string) => {
    switch (table) {
        case 'clientes':
            return 'ID_cliente';
        case 'lavados':
            return 'ID_lavado';
        case 'servicios':
            return 'id_servicio';
        case 'usuarios':
            return 'id_usuario';
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

export async function GET(request: Request, context: Params) {
    try {
        const url = new URL(request.url);
        const table = url.searchParams.get('table');
        if (!table) {
            throw new Error('Table parameter is missing');
        }

        const model = getModel(table);
        const idField = getIdField(table);
        const id = Number(context.params.id);

        if (isNaN(id)) {
            throw new Error('Invalid ID parameter');
        }

        console.log(`Getting from table: ${table}, idField: ${idField}, id: ${id}`);

        const record = await model.findUnique({
            where: {
                [idField]: id,
            },
        });

        if (!record) {
            console.log(`Record not found: ${id}`);
            return NextResponse.json({
                message: `${table} not found`,
            }, {
                status: 404,
            });
        }

        return NextResponse.json({ record: convertBigIntToString(record) });
    } catch (error) {
        console.error(error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                return NextResponse.json({
                    message: `${table} not found (p2025)`,
                }, {
                    status: 404,
                });
            }
        }
        return NextResponse.json({
            message: error.message
        }, {
            status: 500,
        });
    }
}

export async function DELETE(request: Request, context: Params) {
    try {
        const url = new URL(request.url);
        const table = url.searchParams.get('table');
        if (!table) {
            throw new Error('Table parameter is missing');
        }

        const model = getModel(table);
        const idField = getIdField(table);

        const existingRecord = await model.findUnique({
            where: {
                [idField]: Number(context.params.id),
            },
        });

        if (!existingRecord) {
            console.log(`Record not found: ${context.params.id}`);
            return NextResponse.json({
                message: `${table} not found`,
            }, {
                status: 404,
            });
        }

        const deleteRecord = await model.delete({
            where: {
                [idField]: Number(context.params.id),
            },
        });

        return NextResponse.json({ deleteRecord: convertBigIntToString(deleteRecord) });
    } catch (error) {
        console.error(error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                return NextResponse.json({
                    message: `${table} not found (p2025)`,
                }, {
                    status: 404,
                });
            }
        }
        return NextResponse.json({
            message: error.message
        }, {
            status: 500,
        });
    }
}

export async function PUT(request: Request, context: Params) {
    try {
        const url = new URL(request.url);
        const table = url.searchParams.get('table');
        if (!table) {
            throw new Error('Table parameter is missing');
        } 

        const model = getModel(table);
        const idField = getIdField(table);
        const id = Number(context.params.id);

        if (isNaN(id)) {
            throw new Error('Invalid ID parameter');
        }

        const existingRecord = await model.findUnique({
            where: {
                [idField]: id,
            },
        });

        if (!existingRecord) {
            console.log(`Record not found: ${id}`);
            return NextResponse.json({
                message: `${table} not found`,
            }, {
                status: 404,
            });
        }

        const data = await request.json();
        const updateRecord = await model.update({
            where: {
                [idField]: id,
            },
            data: data,
        });

        return NextResponse.json({ updateRecord: convertBigIntToString(updateRecord) });
    } catch (error) {
        console.error(error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                return NextResponse.json({
                    message: `${table} not found (p2025)`,
                }, {
                    status: 404,
                });
            }
        }
        return NextResponse.json({
            message: error.message
        }, {
            status: 500,
        });
    }
}