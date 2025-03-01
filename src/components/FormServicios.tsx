"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function FormServicios() {
    const [servicio, setServicio] = useState('');
    const [Precio, setPrecio] = useState('');
    const [Disponible, setDisponible] = useState('');

    const router = useRouter();

    const validateInputs = () => {
        if (!servicio || !Precio || !Disponible) {
            alert("Debes de llenar todos los campos.");
            return false;
        }
        if (isNaN(Number(Precio)) || isNaN(Number(Disponible))) {
            alert("El campo Precio y Disponible deben ser números.");
            return false;
        }
        return true;
    };

    return (
        <form onSubmit={async (e) => {
            e.preventDefault();
            if (!validateInputs()) {
                return;
            }
            const res = await fetch('/api/note?table=servicios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    servicio: servicio,
                    Precio: Number(Precio),
                    Disponible: Number(Disponible),
                }),
            });
            const data = await res.json();
            console.log(data);

            router.refresh();
        }}>
            <div className="FormServicios">
                <input 
                type="text" name="servicio" 
                autoFocus placeholder="Servicio" 
                onChange={(e) => setServicio(e.target.value)}/>

                <input 
                type="text" name="Precio" 
                placeholder="Precio" 
                onChange={(e) => setPrecio(e.target.value)}/>

                <input
                type="text" name="Disponible" 
                placeholder="Disponible" 
                onChange={(e) => setDisponible(e.target.value)}/>

                <button>Agregar</button>
            </div>
        </form>
    );
}