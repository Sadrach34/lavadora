import React, { useEffect, useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { FormLavado } from '@/components/FormLavado';
import { useSession } from 'next-auth/react';

async function getLavados() {
    const res = await fetch('http://localhost:3000/api/note?table=lavados');
    const data = await res.json();
    return data; 
}

async function deleteLavado(id) {
    const res = await fetch(`http://localhost:3000/api/note/${id}?table=lavados`, {
        method: 'DELETE',
    });
    return res.json();
}

async function getLavado(id) {
    const res = await fetch(`http://localhost:3000/api/note/${id}?table=lavados`, {
        method: 'GET',
    });
    return res.json();
}

async function updateLavadoInactivo(id, Inactivo) {
    const res = await fetch('/api/note/upSuspendido', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, table: 'lavados', field: 'Inactivo', value: Inactivo }),
    });
    return res.json();
}

export function Lavados() {
    const [lavados, setLavados] = useState([]);
    const [searchId, setSearchId] = useState('');
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('Todos');
    const router = useRouter();
    const { data: session } = useSession();

    const texts = {
        es: {
            search: 'Buscar...',
            all: 'Todos',
            suspended: 'Suspendidos',
            notSuspended: 'No suspendidos',
            options: 'Opciones',
            delete: 'Eliminar',
            modify: 'Modificar',
            suspend: 'Suspender',
            idServi: 'ID_lavado',
            idCli: 'ID_cliente',
            idServi: 'ID_servicio',
            idUsu: 'ID_usuario',
            fecha: 'fecha',
            Inactivo: 'Inactivo',
            error: 'Error al buscar la Lavado',
            notFound: 'Lavado no encontrada',
        },
        en: {
            search: 'Search...',
            all: 'All',
            suspended: 'Suspended',
            notSuspended: 'Not suspended',
            options: 'Options',
            delete: 'Delete',
            modify: 'Modify',
            suspend: 'Suspend',
            idServi: 'id_lavado',
            idCli: 'id_client',
            idServi: 'ID_servicio',
            idUsu: 'Id_user',
            amount: 'Amount',
            fecha: 'fecha',
            Inactivo: 'Inactivo',
            error: 'Error searching sale',
            notFound: 'Sale not found',
        }
    }

    const language = session?.user?.Idioma === 2 ? 'en' : 'es';
    const t = texts[language];

    useEffect(() => {
        async function fetchData() {
            const data = await getLavados();
            setLavados(Array.isArray(data) ? data : []);
        }
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        await deleteLavado(id);
        setLavados((prevLavados) => prevLavados.filter((lavado) => lavado.ID_lavado !== id));
    };

    const handleGet = async () => {
        try {
            const data = await getLavado(searchId);
            if (data.record) {
                setLavados([data.record]);
                setError(null);
            } else {
                setError(t.notFound);
                setLavados([]);
                alert(t.notFound);
            }
        } catch (err) {
            setError(t.error + error);
            setLavados([]);
            alert(t.error + err);
        }
    };

    const handleEdit = (id) => {
        router.push(`/interfaces/Archivo/EditLavado?id=${id}`);
    };

    const handleSuspend = async (id, currentStatus) => {
        const newStatus = currentStatus === 1 ? 0 : 1;
        await updateLavadoInactivo(id, newStatus);
        setLavados((prevLavados) =>
            prevLavados.map((lavado) =>
                lavado.ID_lavado === id ? { ...lavado, Inactivo: newStatus } : lavado
            )
        );
    };

    const filteredLavados = lavados.filter((lavado) => {
        if (filter === t.all) return true;
        if (filter === t.notSuspended) return lavado.Inactivo === 0;
        if (filter === t.suspended) return lavado.Inactivo === 1;
        return true;
    });

    return (
        <>
            <div className="Archivo">
                <div className="busqueda">
                    <input
                        className="buscar"
                        placeholder='Buscar...'
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                    />
                    <a className="btn" onClick={handleGet}>{t.search}</a>
                </div>
                <FormLavado />
                <select className="filtro" value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option>{t.all}</option>
                    <option>{t.notSuspended}</option>
                    <option>{t.suspended}</option>
                </select>
                <table className="table">
                    <thead>
                        <tr>
                            <th>{t.idServi}</th>
                            <th>{t.idCli}</th>
                            <th>{t.idServi}</th>
                            <th>{t.idUsu}</th>
                            <th>{t.fecha}</th>
                            <th>{t.Inactivo}</th>
                            <th>{t.options}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLavados.map((lavado) => (
                            <tr key={lavado.ID_lavado}>
                                <td>{lavado.ID_lavado}</td>
                                <td>{lavado.ID_cliente}</td>
                                <td>{lavado.ID_servicio}</td>
                                <td>{lavado.ID_usuario}</td>
                                <td>{lavado.fecha}</td>
                                <td>{lavado.Inactivo}</td>
                                {session?.user?.nivel === 1 && (
                                    <td>
                                        <span className="btn-group">
                                            <a className="btn btn2" onClick={() => handleDelete(lavado.ID_lavado)}>{t.delete}</a>
                                            <a className="btn btn2" onClick={() => handleEdit(lavado.ID_lavado)}>{t.modify}</a>
                                            <a className="btn btn2" onClick={() => handleSuspend(lavado.ID_lavado, lavado.Inactivo)}>{t.suspend}</a>
                                        </span>
                                    </td>
                                )}
                                {session?.user?.nivel !== 1 && (
                                <td>
                                    <span className="btn-group">
                                        <a className="btn btn2" onClick={() => handleSuspend(lavado.ID_lavado, lavado.Inactivo)}>{t.suspend}</a>
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
}