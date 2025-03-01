"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function FormLavado() {
    const [id_lavado, setId_lavado] = useState('');
    const [id_cliente, setId_cliente] = useState('');
    const [id_servicio, setId_servicio] = useState('');
    const [id_usuario, setId_usuario] = useState('');
    const [fecha, setFecha] = useState('');
    const [inactivo, setInactivo] = useState('');

    const router = useRouter();
    
    const validateInputs = () => {
        if (!id_lavado || !id_cliente || !id_servicio || !id_usuario || !fecha || !inactivo) {
            alert("Los campos deben de estar llenos.");
            return false;
        }
        if (isNaN(Number(id_lavado)) || isNaN(Number(id_cliente)) || isNaN(Number(id_servicio)) || isNaN(Number(id_usuario))) {
            alert("Los campos id_lavado, id_cliente, id_servicio y id_usuario deben ser números.");
            return false;
        }
        if (inactivo !== '0' && inactivo !== '1') {
            alert("El campo inactivo debe ser '0' o '1'.");
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
            const res = await fetch('/api/note?table=lavados', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ID_cliente: Number(id_cliente),
                    ID_servicio: Number(id_servicio),
                    ID_usuario: Number(id_usuario),
                    fecha: new Date(fecha).toISOString(), // Convertir a formato ISO-8601
                    Inactivo: Number(inactivo),
                }),
            });
            const data = await res.json();
            console.log(data);
            
            router.refresh();
        }}>
            <div className="FormLavado">
                <input 
                type="text" name="title" 
                autoFocus placeholder="id_lavado" 
                onChange={(e) => setId_lavado(e.target.value)}/>
        
                <input 
                type="text" name="title" 
                placeholder="id_cliente" 
                onChange={(e) => setId_cliente(e.target.value)}/>
        
                <input 
                type="text" name="title" 
                placeholder="id_servicio" 
                onChange={(e) => setId_servicio(e.target.value)}/>
        
                <input type="text" name="title" placeholder="id_usuario" onChange={(e) => setId_usuario(e.target.value)}/>
        
                <input type="date" name="title" placeholder="Fecha" onChange={(e) => setFecha(e.target.value)}/>
                
                <input type="text" name="title" placeholder="inactivo" onChange={(e) => setInactivo(e.target.value)}/>
                
                <button>Agregar</button>
            </div>
        </form>
    )
}