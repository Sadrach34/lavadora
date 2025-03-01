import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FormServicios } from '@/components/FormServicios';

async function getServicios() {
    const res = await fetch('http://localhost:3000/api/note?table=servicios');
    const data = await res.json();
    return data;
}

async function deleteServicio(id) {
    const res = await fetch(`http://localhost:3000/api/note/${id}?table=servicios`, {
        method: 'DELETE',
    });
    return res.json();
}

async function getServicio(id) {
    const res = await fetch(`http://localhost:3000/api/note/${id}?table=servicios`, {
        method: 'GET',
    });
    return res.json();
}

async function updateServicioDisponible(id, disponible) {
    const res = await fetch('/api/note/upSuspendido', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, table: 'servicios', field: 'Disponible', value: disponible }),
    });
    return res.json();
}

export const Servicios = () => {
    const [servicios, setServicios] = useState([]);
    const [searchId, setSearchId] = useState('');
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('Todos');
    const router = useRouter();
    const { data: session } = useSession();

    const texts = {
        es: {
            title: 'Servicios',
            search: 'Buscar...',
            all: 'Todos',
            available: 'Disponibles',
            notAvailable: 'No disponibles',
            notFound: 'Servicio no encontrado',
            error: 'Error al buscar el servicio',
            id: 'ID Servicio',
            service: 'Servicio',
            price: 'Precio',
            available: 'Disponible',
            options: 'Opciones',
            delete: 'Eliminar',
            modify: 'Modificar',
            toggleAvailability: 'Cambiar disponibilidad'
        },
        en: {
            title: 'Services',
            search: 'Search...',
            all: 'All',
            available: 'Available',
            notAvailable: 'Not available',
            notFound: 'Service not found',
            error: 'Error searching service',
            id: 'ID Service',
            service: 'Service',
            price: 'Price',
            available: 'Available',
            options: 'Options',
            delete: 'Delete',
            modify: 'Modify',
            toggleAvailability: 'Toggle availability'
        }
    }

    const language = session?.user?.Idioma === 2 ? 'en' : 'es';
    const t = texts[language];

    useEffect(() => {
        async function fetchData() {
            const data = await getServicios();
            setServicios(data);
        }
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        await deleteServicio(id);
        setServicios((prevServicios) => prevServicios.filter((servicio) => servicio.id_servicio !== id));
    };

    const handleGet = async () => {
        try {
            const data = await getServicio(searchId);
            if (data.record) {
                setServicios([data.record]);
                setError(null);
            } else {
                setError(t.notFound);
                setServicios([]);
                alert(t.notFound);
            }
        } catch (err) {
            setError(t.error);
            setServicios([]);
            alert(t.error + err + { error });
        }
    };

    const handleEdit = (id) => {
        router.push(`/interfaces/Archivo/EditServicio?id=${id}`);
    };

    const handleToggleAvailability = async (id, currentStatus) => {
        const newStatus = currentStatus === 1 ? 0 : 1;
        await updateServicioDisponible(id, newStatus);
        setServicios((prevServicios) =>
            prevServicios.map((servicio) =>
                servicio.id_servicio === id ? { ...servicio, Disponible: newStatus } : servicio
            )
        );
    };

    const filteredServicios = servicios.filter((servicio) => {
        if (filter === t.all) return true;
        if (filter === t.available) return servicio.Disponible === 1;
        if (filter === t.notAvailable) return servicio.Disponible === 0;
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
                <FormServicios />
                <select className="filtro" value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option>{t.all}</option>
                    <option>{t.available}</option>
                    <option>{t.notAvailable}</option>
                </select>
                <table className="table">
                    <thead>
                        <tr>
                            <th>{t.id}</th>
                            <th>{t.service}</th>
                            <th>{t.price}</th>
                            <th>{t.available}</th>
                            <th>{t.options}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredServicios.map((servicio) => (
                            <tr key={servicio.id_servicio}>
                                <td>{servicio.id_servicio}</td>
                                <td>{servicio.servicio}</td>
                                <td>{servicio.Precio}</td>
                                <td>{servicio.Disponible}</td>
                                {session?.user?.nivel === 1 && (
                                    <td>
                                        <span className="btn-group">
                                            <a className="btn btn2" onClick={() => handleDelete(servicio.id_servicio)}>{t.delete}</a>
                                            <a className="btn btn2" onClick={() => handleEdit(servicio.id_servicio)}>{t.modify}</a>
                                            <a className="btn btn2" onClick={() => handleToggleAvailability(servicio.id_servicio, servicio.Disponible)}>{t.toggleAvailability}</a>
                                        </span>
                                    </td>
                                )}
                                {session?.user?.nivel !== 1 && (
                                    <td>
                                        <span className="btn-group">
                                            <a className="btn btn2" onClick={() => handleToggleAvailability(servicio.id_servicio, servicio.Disponible)}>{t.toggleAvailability}</a>
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