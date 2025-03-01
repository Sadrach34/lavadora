"use client";

import React, { useState } from 'react';
import { Archivo } from './interfaces/Menu/Archivo.js';
import { PantallaPrincipal } from './PantallaPrincipal';
import { Reportes } from './interfaces/Menu/Reportes';
import { Preferencias } from './interfaces/Menu/Preferencias';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

export default function Home() {
  const [isActive, setIsActive] = useState(false);
  const [activeComponent, setActiveComponent] = useState('');
  const { data: session } = useSession();

  const texts = {
    es: {
      title: 'Lavadora',
      archivo: 'Archivo',
      reportes: 'Reportes',
      preferencias: 'Preferencias',
    },
    en: {
      title: 'Washer',
      archivo: 'File',
      reportes: 'Reports',
    },
  };

  const language = session?.user?.Idioma === 2 ? 'en' : 'es';
  const t = texts[language];

  const renderComponent = () => {
    switch (activeComponent) {
      case 'archivo':
        return <Archivo />;

      case 'reportes':
        return <Reportes />;

      case 'preferencias':
        return <Preferencias />;

      default:
        return <PantallaPrincipal />;
    }
  };

  return (
    <>
      <div className='Titulo'>
        <div onClick={() => setIsActive(!isActive)} className={`nombre ${isActive ? "text-red-500" : "text-blue-500"}`}>
          <h1><a onClick={() => setActiveComponent('index')}>{t.title}</a></h1>
        </div>
        <div className="dropdown">
          <a href="#" onClick={() => setActiveComponent('archivo')}>{t.archivo}</a>
        </div>

        {session?.user?.nivel === 1 && (
          <div className="dropdown">
            <a href="#" onClick={() => setActiveComponent('reportes')}>{t.reportes}</a>
          </div>
        )}

        <div className="dropdown">
          <a href="#" onClick={() => setActiveComponent('preferencias')}>
            <Image src="/login.png" alt="Descripción de la imagen" className="img" width={50} height={30} />
          </a>
        </div>
      </div>

      <section className="main">
        {renderComponent()}
      </section>
    </>
  );
}