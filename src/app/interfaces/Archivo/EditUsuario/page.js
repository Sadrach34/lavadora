'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

async function getUsuario(id) {
    const res = await fetch(`http://localhost:3000/api/note/${id}?table=usuarios`, {
        method: 'GET',
    });
    if (!res.ok) {
        throw new Error('Error al obtener los datos del usuario');
    }
    return res.json();
}

async function updateUsuario(id, data) {
    const res = await fetch(`http://localhost:3000/api/note/${id}?table=usuarios`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        throw new Error('Error al actualizar los datos del usuario');
    }
    return res.json();
}

const EditUsuario = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [usuario, setUsuario] = useState(null);
    const [formData, setFormData] = useState({
        Usuario: '',
        Cuenta: '',
        Clave: '',
        Nivel: '',
        Idioma: '',
        status: '',
    });
    const [error, setError] = useState(null);
    const { data: session } = useSession();

    const texts = {
        es: {
            title: 'Modificar Usuario',
            user: 'Usuario:',
            account: 'Cuenta:',
            level: 'Nivel:',
            language: 'Idioma:',
            active: 'Activo:',
            modify: 'Modificar:',
            cancel: 'Cancelar:',
        },
        en: {
            title: 'Edit User',
            user: 'User:',
            account: 'Account:',
            level: 'Level:',
            language: 'Language:',
            active: 'Active:',
            modify: 'Modify:',
            cancel: 'Cancel:',
        },
    };
    
    const language = session?.user?.Idioma === 2 ? 'en' : 'es';
    const t = texts[language];

    useEffect(() => {
        if (id) {
            async function fetchUsuario() {
                try {
                    const data = await getUsuario(id);
                    setUsuario(data.record);
                    setFormData({
                        Usuario: data.record.Usuario || '',
                        Cuenta: data.record.Cuenta || '',
                        Nivel: data.record.Nivel || 0,
                        Idioma: data.record.Idioma || 0,
                        status: data.record.status || 0,
                    });
                } catch (err) {
                    setError(err.message);
                }
            }
            fetchUsuario();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: name === 'Nivel' || name === 'Idioma' || name === 'status' ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateUsuario(id, formData);
            router.push('/');
        } catch (err) {
            setError(err.message);
        }
    };

    if (error) return <div>Error: {error}</div>;
    if (!usuario) return <div>Cargando...</div>;

    const handleCancel = () => {
        router.push('/');
    }
    return (
        <div className="form-container">
            <h1>{t.title}</h1>
            <form className="form-modi" onSubmit={handleSubmit}>

                <div className="form-fields">
                    <div className="form-row">
                        <label>{t.user}</label>
                        <input
                            type="text"
                            name="Usuario"
                            placeholder="Usuario..."
                            value={formData.Usuario}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-row">
                        <label>{t.account}</label>
                        <input
                            type="text"
                            name="Cuenta"
                            placeholder="Cuenta..."
                            value={formData.Cuenta}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-row">
                        <label>{t.level}</label>
                        <input
                            type="number"
                            name="Nivel"
                            placeholder="Nivel..."
                            value={formData.Nivel}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-row">
                        <label>{t.language}</label>
                        <input
                            type="number"
                            name="Idioma"
                            placeholder="Idioma..."
                            value={formData.Idioma}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-row">
                        <label>{t.active}</label>
                        <input
                            type="number"
                            name="status"
                            placeholder="Activo..."
                            value={formData.status}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="form-buttons">
                    <button type="submit" name="modificar">{t.modify}</button>
                    <button type="button" onClick={handleCancel}>{t.cancel}</button>
                </div>
            </form>
        </div>
    );
};

export default EditUsuario;