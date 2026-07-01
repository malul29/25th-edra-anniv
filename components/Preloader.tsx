'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Preloader() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHidden(true), 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`preloader${hidden ? ' hidden' : ''}`} id="preloader">
      <div className="preloader-inner">
        <Image
          src="/assets/edra-logo.png"
          alt="Edra Logo"
          width={72}
          height={72}
          className="preloader-logo"
          style={{ width: 72, height: 'auto' }}
          priority
        />
        <p className="preloader-tagline">Anno Domini · MMXXVI</p>
        <div className="preloader-bar">
          <div className="preloader-fill" />
        </div>
      </div>
    </div>
  );
}
