import React, { useState } from 'react';
import { CambiarIdio } from '../Preferencia/CambiarIdio';
import { CambiarContra } from '../Preferencia/CambiarContra';
import { AcercaDe } from '../Preferencia/AcercaDe';
import { useSession } from 'next-auth/react';

export const Preferencias = () => {
    const [activeComponent, setActiveComponent] = useState(null);
    const { data: session } = useSession();
        
            const texts = {
                es: {
                    CambiarContra: 'Cambiar contraseña',
                    CambiarIdio: 'Cambiar Idioma',
                    AcercaDe: 'Acerca de ...'
                },
                en: {
                    CambiarContra: 'Change password',
                    CambiarIdio: 'Change Language',
                    AcercaDe: 'About ...'
                }
            }
        
        const language = session?.user?.Idioma === 2 ? 'en' : 'es';
        const t = texts[language];

    const renderComponent = () => {
        switch (activeComponent) {
            case 'CambiarContra':
                return <CambiarContra />;
            case 'CambiarIdio':
                return <CambiarIdio />;
            case 'AcercaDe':
                return <AcercaDe />;
        }
    };
    return (
        <>
            <div className="menu">
                <div className="mini-menu">
                    <a href="#" onClick={() => setActiveComponent('CambiarContra')}>{t.CambiarContra}</a>
                </div>
                <div className="mini-menu">
                    <a href="#" onClick={() => setActiveComponent('CambiarIdio')}>{t.CambiarIdio}</a>
                </div>
                <div className="mini-menu">
                    <a href="#" onClick={() => setActiveComponent('AcercaDe')}>{t.AcercaDe}</a>
                </div>
            </div>

            <section className="main">
                {renderComponent()}
            </section>
        </>
    );
};