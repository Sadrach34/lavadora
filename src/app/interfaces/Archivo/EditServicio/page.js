'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

async function getservicio(id) {
    const res = await fetch(`http://localhost:3000/api/note/${id}?table=servicios`, {
        method: 'GET',
    });
    if (!res.ok) {
        throw new Error('Error al obtener los datos del servicio');
    }
    return res.json();
}

async function updateservicio(id, data) {
    const res = await fetch(`http://localhost:3000/api/note/${id}?table=servicios`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const errorText = await res.text();
        console.error('Error response text:', errorText);
        throw new Error(errorText || 'Error al actualizar los datos del servicio');
    }
    return res.json();
}

const EditServi = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [servicio, setServicio] = useState(null);
    const [formData, setFormData] = useState({
        servicio: '',
        Precio: '',
        Disponible: '',
    });
    const [error, setError] = useState(null);
    const { data: session } = useSession();

    const texts = {
        es: {
            title: 'Modificar servicio',
            servicio: 'servicio:',
            price: 'Precio:',
            available: 'Disponible:',
            modify: 'Modificar:',
            cancel: 'Cancelar:',
            low: 'Baja:',
        },
        en: {
            title: 'Edit servicio',
            servicio: 'servicio:',
            price: 'Price:',
            available: 'Available:',
            modify: 'Modify:',
            cancel: 'Cancel:',
            low: 'Low:',
        },
    };
    
    const language = session?.user?.Idioma === 2 ? 'en' : 'es';
    const t = texts[language];

    const handleCancel = () => {
        router.push('/');
    };

    useEffect(() => {
        if (id) {
            async function fetchservicio() {
                try {
                    const data = await getservicio(id);
                    setServicio(data.record);
                    setFormData({
                        servicio: data.record.servicio || '',
                        Precio: data.record.Precio || '',
                        Disponible: data.record.Disponible || '',
                    });
                } catch (err) {
                    setError(err.message);
                }
            }
            fetchservicio();
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
            const updatedData = {
                ...formData,
                Precio: Number(formData.Precio),
                Disponible: Number(formData.Disponible),
            };
            console.log('Updating servicio with data:', updatedData); // Log de los datos enviados
            await updateservicio(id, updatedData);
            router.push('/');
        } catch (err) {
            console.error('Error updating servicio:', err); // Log del error
            setError(err.message);
        }
    };

    if (error) return <div>Error: {error}</div>;
    if (!servicio) return <div>Cargando...</div>;

    return (
        <div className="form-container">
            <h1>{t.title}</h1>
            <form className="form-modi" onSubmit={handleSubmit}>

                <div className="form-fields">
                    <div className="form-row">
                        <label>{t.servicio}</label>
                        <input
                            type="text"
                            name="servicio"
                            placeholder="servicio..."
                            value={formData.servicio}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-row">
                        <label>{t.price}</label>
                        <input
                            type="text"
                            name="Precio"
                            placeholder="Precio..."
                            value={formData.Precio}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-row">
                        <label>{t.available}</label>
                        <input
                            type="text"
                            name="Disponible"
                            placeholder="Disponible..."
                            value={formData.Disponible}
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

export default EditServi;