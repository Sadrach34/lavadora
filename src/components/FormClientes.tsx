"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function FormCliente() {
    const [cliente, setCliente] = useState('');
    const [tipoCarro, setTipoCarro] = useState('');
    const [direccion, setDireccion] = useState('');
    const [Telefono, setTelefono] = useState('');
    const [Activo, setActivo] = useState('');

    const router = useRouter();

    const validateInputs = () => {
        if (!cliente || !tipoCarro || !direccion || !Telefono || !Activo) {
            alert("Debes de llenar todos los campos.");
            return false;
        }
        if (isNaN(Number(Telefono)) || Telefono.length !== 10) {
            alert("El campo Telefono debe ser un número y contener 10 dígitos.");
            return false;
        }
        if (Activo !== '0' && Activo !== '1') {
            alert("El campo Activo debe ser '0' o '1'.");
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
            const res = await fetch('/api/note?table=clientes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cliente: cliente,
                    tipoCarro: Number(tipoCarro),
                    direccion: direccion,
                    Telefono: Telefono,
                    Activo: Number(Activo),
                }),
            });
            const data = await res.json();
            console.log(data);

            router.refresh();
        }}>
            <div className="FormCliente">
                <input 
                type="text" name="cliente" 
                autoFocus placeholder="Cliente" 
                onChange={(e) => setCliente(e.target.value)}/>

                <input 
                type="text" name="tipoCarro" 
                placeholder="Tipo de Carro" 
                onChange={(e) => setTipoCarro(e.target.value)}/>

                <input
                type="text" name="direccion" 
                placeholder="Dirección" 
                onChange={(e) => setDireccion(e.target.value)}/>

                <input 
                type="text" name="Telefono" 
                placeholder="Teléfono" 
                onChange={(e) => setTelefono(e.target.value)}/>

                <input 
                type="text" name="Activo" 
                placeholder="Activo" 
                onChange={(e) => setActivo(e.target.value)}/>
                
                <button>Agregar</button>
            </div>
        </form>
    );
}