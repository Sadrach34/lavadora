'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

async function getCliente(id) {
    const res = await fetch(`http://localhost:3000/api/note/${id}?table=clientes`, {
        method: 'GET',
    });
    if (!res.ok) {
        throw new Error('Error al obtener los datos del cliente');
    }
    return res.json();
}

async function updateCliente(id, data) {
    const res = await fetch(`http://localhost:3000/api/note/${id}?table=clientes`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        throw new Error('Error al actualizar los datos del cliente');
    }
    return res.json();
}

const EditCliente = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [cliente, setCliente] = useState(null);
    const [formData, setFormData] = useState({
        cliente: '',
        tipoCarro: '',
        direccion: '',
        Telefono: '',
        Activo: '',
    });
    const [error, setError] = useState(null);
    const { data: session } = useSession();

    const texts = {
        es: {
            title: 'Modificar Cliente',
            name: 'Nombre:',
            phone: 'Celular:',
            address: 'Domicilio:',
            suspended: 'Suspendido:',
            modify: 'Modificar:',
            cancel: 'Cancelar:',
        },
        en: {
            title: 'Edit Client',
            name: 'Name:',
            phone: 'Phone:',
            address: 'Address:',
            suspended: 'Suspended:',
            modify: 'Modify:',
            cancel: 'Cancel:',
        }
    }

    const language = session?.user?.Idioma === 2 ? 'en' : 'es';
    const t = texts[language];

    useEffect(() => {
        if (id) {
            async function fetchCliente() {
                try {
                    const data = await getCliente(id);
                    setCliente(data.record);
                    setFormData({
                        cliente: data.record.cliente || '',
                        tipoCarro: data.record.tipoCarro || 0,
                        direccion: data.record.direccion || '',
                        Telefono: data.record.Telefono || '',
                        Activo: data.record.Activo || 0,
                    });
                } catch (err) {
                    setError(err.message);
                }
            }
            fetchCliente();
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
            await updateCliente(id, formData);
            router.push('/');
        } catch (err) {
            setError(err.message);
        }
    };

    if (error) return <div>Error: {error}</div>;
    if (!cliente) return <div>Cargando...</div>;

    const handleCancel = () => {
        router.push('/');
    }

    return (
        <div className="form-container">
            <h1>{t.title}</h1>
            <form className="form-modi" onSubmit={handleSubmit}>
                <div className="image-container">
                    <Image src="/logo.png" alt="Descripción de la imagen" width={250} height={250} />
                    <input type="file" accept="image/*" />
                </div>

                <div className="form-fields">
                    <div className="form-row">
                        <label>{t.name}</label>
                        <input
                            type="text"
                            name="cliente"
                            placeholder="Nombre..."
                            value={formData.cliente}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-row">
                        <label>{t.phone}</label>
                        <input
                            type="text"
                            name="tipoCarro"
                            placeholder="tipoCarro..."
                            value={formData.tipoCarro}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-row">
                        <label>{t.address}</label>
                        <input
                            type="text"
                            name="direccion"
                            placeholder="direccion..."
                            value={formData.direccion}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-row">
                        <label>{t.suspended}</label>
                        <input
                            type="text"
                            name="Telefono"
                            placeholder="Telefono..."
                            value={formData.Telefono}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-row">
                        <label>{t.suspended}</label>
                        <input
                            type="text"
                            name="Activo"
                            placeholder="Activo..."
                            value={formData.Activo}
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

export default EditCliente;