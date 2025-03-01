import React, { useState } from 'react';
import { RepLavados } from '../Reporte/RepLavados';
import { RepClientes } from '../Reporte/RepClientes';
import { RepServicios } from '../Reporte/RepServicios';
import { RepUsuarios } from '../Reporte/RepUsuarios';
import { RepLavServi } from '../Reporte/RepLavServi';
import { RepLavCli } from '../Reporte/RepLavCli';
import { RepLavUsu } from '../Reporte/RepLavUsu';
import { useSession } from 'next-auth/react';

export const Reportes = () => {
    const [activeComponent, setActiveComponent] = useState(null);
    const { data: session } = useSession();
        
            const texts = {
                es: {
                    repLavados: 'Lavados',
                    repClientes: 'Clientes',
                    repServicios: 'Servicios',
                    repUsuarios: 'Usuarios',
                    RepLavCli: 'Lavados por Servicio',
                    RepLavServi: 'Lavados por Cliente',
                    RepLavUsu: 'Lavados por Usuario'
                },
                en: {
                    repLavados: 'Sales',
                    repClientes: 'Customers',
                    repServicios: 'Services',
                    repUsuarios: 'Users',
                    RepLavCli: 'Washes by Service',
                    RepLavServi: 'Washes by Customer',
                    RepLavUsu: 'Washes by User'
                }
            }
        
        const language = session?.user?.Idioma === 2 ? 'en' : 'es';
        const t = texts[language];
    const renderComponent = () => {
    switch (activeComponent) {
        case 'repLavados':
            return <RepLavados />;

        case 'repClientes':
            return <RepClientes />;

        case 'repServicios':
            return <RepServicios />;

        case 'repUsuarios':
            return <RepUsuarios />;

        case 'RepLavServi':
            return <RepLavServi />;

        case 'RepLavCli':
            return <RepLavCli />;

        case 'RepLavUsu':
            return <RepLavUsu />;

    }
    };
    return (
        <>
            <div className="menu">
                <div className="mini-menu">
                    <a href="#" onClick={() => setActiveComponent('repLavados')}>{t.repLavados}</a>
                </div>
                <div className="mini-menu">
                    <a href="#" onClick={() => setActiveComponent('repClientes')}>{t.repClientes}</a>
                </div>
                <div className="mini-menu">
                    <a href="#" onClick={() => setActiveComponent('repServicios')}>{t.repServicios}</a>
                </div>
                <div className="mini-menu">
                    <a href="#" onClick={() => setActiveComponent('repUsuarios')}>{t.repUsuarios}</a>
                </div>
                <div className="mini-menu">
                    <a href="#" onClick={() => setActiveComponent('RepLavCli')}>{t.RepLavServi}</a>
                </div>
                <div className="mini-menu">
                    <a href="#" onClick={() => setActiveComponent('RepLavServi')}>{t.RepLavCli}</a>
                </div>
                <div className="mini-menu">
                    <a href="#" onClick={() => setActiveComponent('RepLavUsu')}>{t.RepLavUsu}</a>
                </div>
            </div>

            <section className="main">
                {renderComponent()}
            </section>
        </>
    );
};