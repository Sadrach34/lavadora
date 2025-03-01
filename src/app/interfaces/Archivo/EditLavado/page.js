'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

async function getLavado(id) {
    const res = await fetch(`http://localhost:3000/api/note/${id}?table=lavados`, {
        method: 'GET',
    });
    if (!res.ok) {
        throw new Error('Error al obtener los datos del lavado');
    }
    return res.json();
}

async function updateLavado(id, data) {
    const res = await fetch(`http://localhost:3000/api/note/${id}?table=lavados`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        throw new Error('Error al actualizar los datos del lavado');
    }
    return res.json();
}

const EditLavado = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [lavado, setLavado] = useState(null);
    const [formData, setFormData] = useState({
        ID_cliente: '',
        ID_servicio: '',
        ID_usuario: '',
        fecha: '',
        Inactivo: '',
    });
    const [error, setError] = useState(null);
    const { data: session } = useSession();

    const texts = {
        es: {
            title: 'Modificar Lavado',
            idClient: 'Cliente ID:',
            idService: 'Servicio ID:',
            idUser: 'Usuario ID:',
            date: 'Fecha:',
            inactive: 'Inactivo:',
            modify: 'Modificar:',
            cancel: 'Cancelar:',
        },
        en: {
            title: 'Edit Wash',
            idClient: 'Client ID:',
            idService: 'Service ID:',
            idUser: 'User ID:',
            date: 'Date:',
            inactive: 'Inactive:',
            modify: 'Modify:',
            cancel: 'Cancel:',
        },
    };
    
    const language = session?.user?.Idioma === 2 ? 'en' : 'es';
    const t = texts[language];

    useEffect(() => {
        if (id) {
            async function fetchLavado() {
                try {
                    const data = await getLavado(id);
                    setLavado(data.record);
                    setFormData({
                        ID_cliente: data.record.ID_cliente || '',
                        ID_servicio: data.record.ID_servicio || '',
                        ID_usuario: data.record.ID_usuario || '',
                        fecha: data.record.fecha || '',
                        Inactivo: data.record.Inactivo || '',
                    });
                } catch (err) {
                    setError(err.message);
                }
            }
            fetchLavado();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateLavado(id, formData);
            router.push('/');
        } catch (err) {
            setError(err.message);
        }
    };

    if (error) return <div>Error: {error}</div>;
    if (!lavado) return <div>Cargando...</div>;

    const handleCancel = () => {
        router.push('/');
    }

    return (
        <div className="form-container">
            <h1>{t.title}</h1>
            <form className="form-modi" onSubmit={handleSubmit}>

                <div className="form-fields">
                    <div className="form-row">
                        <label>{t.idClient}</label>
                        <input
                            type="text"
                            name="ID_cliente"
                            placeholder="Cliente ID..."
                            value={formData.ID_cliente}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-row">
                        <label>{t.idService}</label>
                        <input
                            type="text"
                            name="ID_servicio"
                            placeholder="Servicio ID..."
                            value={formData.ID_servicio}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-row">
                        <label>{t.idUser}</label>
                        <input
                            type="text"
                            name="ID_usuario"
                            placeholder="Usuario ID..."
                            value={formData.ID_usuario}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-row">
                        <label>{t.date}</label>
                        <input
                            type="date"
                            name="fecha"
                            placeholder="Fecha..."
                            value={formData.fecha}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-row">
                        <label>{t.inactive}</label>
                        <input
                            type="text"
                            name="Inactivo"
                            placeholder="Inactivo..."
                            value={formData.Inactivo}
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

export default EditLavado;