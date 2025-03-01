'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormCliente } from '@/components/FormClientes';
import { useSession } from 'next-auth/react';

async function getClientes() {
    const res = await fetch('http://localhost:3000/api/note?table=clientes');
    const data = await res.json();
    return data;
}

async function deleteCliente(id) {
    const res = await fetch(`http://localhost:3000/api/note/${id}?table=clientes`, {
        method: 'DELETE',
    });
    return res.json();
}

async function getCliente(id) {
    const res = await fetch(`http://localhost:3000/api/note/${id}?table=clientes`, {
        method: 'GET',
    });
    return res.json();
}

async function updateClienteActivo(id, activo) {
    const res = await fetch('/api/note/upSuspendido', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, table: 'clientes', field: 'Activo', value: activo }),
    });
    return res.json();
}

export const Clientes = () => {
    const [clientes, setClientes] = useState([]);
    const [searchId, setSearchId] = useState('');
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('Todos');
    const router = useRouter();
    const { data: session } = useSession();

    const texts = {
        es: {
            title: 'Clientes',
            search: 'Buscar...',
            all: 'Todos',
            active: 'Activos',
            notActive: 'No activos',
            notFound: 'Cliente no encontrado',
            error: 'Error al buscar el cliente',
            id: 'ID Cliente',
            client: 'Cliente',
            phone: 'Teléfono',
            tipoCarro: 'tipoCarro',
            address: 'Dirección',
            active: 'Activo',
            options: 'Opciones',
            delete: 'Eliminar',
            modify: 'Modificar',
            activate: 'Activar',
            deactivate: 'Desactivar'
        },
        en: {
            title: 'Clients',
            search: 'Search...',
            all: 'All',
            active: 'Active',
            notActive: 'Not active',
            notFound: 'Client not found',
            error: 'Error searching client',
            id: 'ID Client',
            client: 'Client',
            tipoCarro: 'tipoCarro',
            phone: 'Phone',
            address: 'Address',
            active: 'Active',
            options: 'Options',
            delete: 'Delete',
            modify: 'Modify',
            activate: 'Activate',
            deactivate: 'Deactivate'
        }
    }

    const language = session?.user?.Idioma === 2 ? 'en' : 'es';
    const t = texts[language];

    useEffect(() => {
        async function fetchData() {
            const data = await getClientes();
            setClientes(data);
        }
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        await deleteCliente(id);
        setClientes((prevClientes) => prevClientes.filter((cliente) => cliente.ID_cliente !== id));
    };

    const handleGet = async () => {
        try {
            const data = await getCliente(searchId);
            if (data.record) {
                setClientes([data.record]);
                setError(null);
            } else {
                setError(t.notFound);
                setClientes([]);
                alert(t.notFound);
            }
        } catch (err) {
            setError(t.error);
            setClientes([]);
            alert(t.error + err + { error });
        }
    };

    const handleEdit = (id) => {
        router.push(`/interfaces/Archivo/EditCliente?id=${id}`);
    };

    const handleActivate = async (id, currentStatus) => {
        const newStatus = currentStatus === 1 ? 0 : 1;
        await updateClienteActivo(id, newStatus);
        setClientes((prevClientes) =>
            prevClientes.map((cliente) =>
                cliente.ID_cliente === id ? { ...cliente, Activo: newStatus } : cliente
            )
        );
    };

    const filteredClientes = clientes.filter((cliente) => {
        if (filter === t.all) return true;
        if (filter === t.notActive) return cliente.Activo === 0;
        if (filter === t.active) return cliente.Activo === 1;
        return true;
    });

    return (
        <>
            <div className="Archivo">
                <div className="busqueda">
                    <input
                        className="buscar"
                        type="text"
                        placeholder={t.search}
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                    />
                    <a className="btn" onClick={handleGet}>{t.search}</a>
                </div>
                <FormCliente />
                <select className="filtro" value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option>{t.all}</option>
                    <option>{t.notActive}</option>
                    <option>{t.active}</option>
                </select>
                <table className="table">
                    <thead>
                        <tr>
                            <th>{t.id}</th>
                            <th>{t.client}</th>
                            <th>{t.tipoCarro}</th>
                            <th>{t.address}</th>
                            <th>{t.phone}</th>
                            <th>{t.active}</th>
                            <th>{t.options}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredClientes.map((cliente) => (
                            <tr key={cliente.ID_cliente}>
                                <td>{cliente.ID_cliente}</td>
                                <td>{cliente.cliente}</td>
                                <td>{cliente.tipoCarro}</td>
                                <td>{cliente.direccion}</td>
                                <td>{cliente.Telefono}</td>
                                <td>{cliente.Activo}</td>
                                {session?.user?.nivel === 1 && (
                                    <td>
                                        <span className="btn-group">
                                            <a className="btn btn2" onClick={() => handleDelete(cliente.ID_cliente)}>{t.delete}</a>
                                            <a className="btn btn2" onClick={() => handleEdit(cliente.ID_cliente)}>{t.modify}</a>
                                            <a className="btn btn2" onClick={() => handleActivate(cliente.ID_cliente, cliente.Activo)}>{cliente.Activo === 1 ? t.deactivate : t.activate}</a>
                                        </span>
                                    </td>
                                )}
                                {session?.user?.nivel !== 1 && (
                                    <td>
                                        <span className="btn-group">
                                            <a className="btn btn2" onClick={() => handleActivate(cliente.ID_cliente, cliente.Activo)}>{cliente.Activo === 1 ? t.deactivate : t.activate}</a>
                                        </span>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};