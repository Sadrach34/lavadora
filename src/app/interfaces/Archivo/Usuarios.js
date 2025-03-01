import React, { useEffect, useState } from 'react';
import { FormUsuario } from '@/components/FormUsuarios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

async function getUsuarios() {
    const res = await fetch('http://localhost:3000/api/note?table=usuarios');
    const data = await res.json();
    return data;
}

async function deleteUsuario(id) {
    const res = await fetch(`http://localhost:3000/api/note/${id}?table=usuarios`, {
        method: 'DELETE',
    });
    return res.json();
}

async function getUsuario(id) {
    const res = await fetch(`http://localhost:3000/api/note/${id}?table=usuarios`, {
        method: 'GET',
    });
    return res.json();
}

async function updateUsuarioActivo(id, activo) {
    const res = await fetch('/api/note/upSuspendido', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, table: 'usuarios', field: 'status', value: activo }),
    });
    return res.json();
}

export const Usuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [searchId, setSearchId] = useState('');
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('Todos');
    const router = useRouter();
    const { data: session } = useSession();
    console.log(error);
    
    const texts = {
        es: {
            title: 'Usuarios',
            search: 'Buscar...',
            all: 'Todos',
            suspended: 'Suspendidos',
            notSuspended: 'No suspendidos',
            notFound: 'Usuario no encontrado',
            error: 'Error al buscar el usuario',
            id: 'ID Usuario',
            user: 'Usuario',
            account: 'Cuenta',
            password: 'Clave',
            level: 'Nivel',
            language: 'Idioma',
            status: 'Estado',
            options: 'Opciones',
            delete: 'Eliminar',
            modify: 'Modificar',
            suspend: 'Suspender'
        },
        en: {
            title: 'Users',
            search: 'Search...',
            all: 'All',
            suspended: 'Suspended',
            notSuspended: 'Not suspended',
            notFound: 'User not found',
            error: 'Error searching the user',
            id: 'ID User',
            user: 'User',
            account: 'Account',
            password: 'Password',
            level: 'Level',
            language: 'Language',
            status: 'Status',
            options: 'Options',
            delete: 'Delete',
            modify: 'Modify',
            suspend: 'Suspend'
        }
    }

    const language = session?.user?.Idioma === 2 ? 'en' : 'es';
    const t = texts[language];

    useEffect(() => {
        async function fetchData() {
            const data = await getUsuarios();
            setUsuarios(data);
        }
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        await deleteUsuario(id);
        setUsuarios((prevUsuarios) => prevUsuarios.filter((usuario) => usuario.id_usuario !== id));
    };

    const handleGet = async () => {
        try {
            const data = await getUsuario(searchId);
            if (data.record) {
                setUsuarios([data.record]);
                setError(null);
            } else {
                setError(t.notFound);
                setUsuarios([]);
                alert(t.notFound);
            }
        } catch (err) {
            setError(t.error);
            setUsuarios([]);
            alert(t.error + err);
        }
    };

    const handleEdit = (id) => {
        router.push(`/interfaces/Archivo/EditUsuario?id=${id}`);
    };

    const handleSuspend = async (id, currentStatus) => {
        const newStatus = currentStatus === 1 ? 0 : 1;
        await updateUsuarioActivo(id, newStatus);
        setUsuarios((prevUsuarios) =>
            prevUsuarios.map((usuario) =>
                usuario.id_usuario === id ? { ...usuario, status: newStatus } : usuario
            )
        );
    };

    const filteredUsuarios = usuarios.filter((usuario) => {
        if (filter === t.all) return true;
        if (filter === t.notSuspended) return usuario.status === 1;
        if (filter === t.suspended) return usuario.status === 0;
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
                <FormUsuario />
                <select className="filtro" value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option>{t.all}</option>
                    <option>{t.notSuspended}</option>
                    <option>{t.suspended}</option>
                </select>
                <table className="table">
                    <thead>
                        <tr>
                            <th>{t.id}</th>
                            <th>{t.user}</th>
                            <th>{t.account}</th>
                            <th>{t.password}</th>
                            <th>{t.level}</th>
                            <th>{t.language}</th>
                            <th>{t.status}</th>
                            <th>{t.options}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsuarios.map((usuario) => (
                            <tr key={usuario.id_usuario}>
                                <td>{usuario.id_usuario}</td>
                                <td>{usuario.Usuario}</td>
                                <td>{usuario.Cuenta}</td>
                                <td>{usuario.Clave}</td>
                                <td>{usuario.Nivel}</td>
                                <td>{usuario.Idioma}</td>
                                <td>{usuario.status}</td>
                                {session?.user?.nivel === 1 && (
                                    <td>
                                        <span className="btn-group">
                                            <a className="btn btn2" onClick={() => handleDelete(usuario.id_usuario)}>{t.delete}</a>
                                            <a className="btn btn2" onClick={() => handleEdit(usuario.id_usuario)}>{t.modify}</a>
                                            <a className="btn btn2" onClick={() => handleSuspend(usuario.id_usuario, usuario.status)}>{t.suspend}</a>
                                        </span>
                                    </td>
                                )}
                                {session?.user?.nivel !== 1 && (
                                    <td>
                                        <span className="btn-group">
                                            <a className="btn btn2" onClick={() => handleSuspend(usuario.id_usuario, usuario.status)}>{t.suspend}</a>
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