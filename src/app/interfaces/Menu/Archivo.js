import React, { useState } from 'react';
import { Lavados } from "../Archivo/Lavado";
import { Clientes } from "../Archivo/Clientes";
import { Servicios } from "../Archivo/Servicios";
import { Usuarios } from "../Archivo/Usuarios";
import { signOut, useSession } from 'next-auth/react';

export const Archivo = () => {
    const [activeComponent, setActiveComponent] = useState(null);
    const { data: session } = useSession();
    
    const texts = {
        es: {
            Lavado: 'Lavado',
            clientes: 'Clientes',
            Servicios: 'Servicios',
            usuarios: 'Usuarios',
            salir: 'Salir'
        },
        en: {
            Lavado: 'wash',
            clientes: 'Clients',
            Servicios: 'Services',
            usuarios: 'Users',
            salir: 'Sign out'
        }
    }
    
    const language = session?.user?.Idioma === 2 ? 'en' : 'es';
    const t = texts[language];

    const renderComponent = () => {
        switch (activeComponent) {
            case 'Lavado':
                return <Lavados />;

            case 'clientes':
                return <Clientes />;

            case 'Servicios':
                return <Servicios />;

            case 'usuarios':
                return <Usuarios />;
        }
    };

    return (
        <>
            <div className="menu">
                <div className="mini-menu">
                    <a href="#" onClick={() => setActiveComponent('Lavado')}>{t.Lavado}</a>
                </div>
                <div className="mini-menu">
                    <a href="#" onClick={() => setActiveComponent('clientes')}>{t.clientes}</a>
                </div>
                <div className="mini-menu">
                    <a href="#" onClick={() => setActiveComponent('Servicios')}>{t.Servicios}</a>
                </div>
                
                {session?.user?.nivel === 1 && (
                    <div className="mini-menu">
                        <a href="#" onClick={() => setActiveComponent('usuarios')}>{t.usuarios}</a>
                    </div>
                )}
                <div className="mini-menu">
                    <a href="#" onClick={() => signOut()}>{t.salir}</a>
                </div>
            </div>
            <section className="main">
                {renderComponent()}
            </section>
        </>
    );
};