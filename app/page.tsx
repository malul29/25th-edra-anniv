import Image from 'next/image';
import Preloader from '@/components/Preloader';
import HeroSection from '@/components/HeroSection';
import CountdownSection from '@/components/CountdownSection';
import DetailSection from '@/components/DetailSection';
import MapSection from '@/components/MapSection';
import RsvpSection from '@/components/RsvpSection';
import ScrollReveal from '@/components/ScrollReveal';

export default function Home() {
  return (
    <>
      <Preloader />
      <HeroSection />
      <CountdownSection />
      <DetailSection />
      <MapSection />
      <RsvpSection />

      <footer className="footer">
        {/* Architectural ornament */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 10, marginBottom: 20, opacity: 0.35,
        }}>
          <div style={{ width: 30, height: 1, background: 'linear-gradient(90deg, transparent, #b8b0c8)' }} />
          <svg width="10" height="10" viewBox="0 0 10 10">
            <path d="M5 0 L6 3.5 L10 3.5 L7 5.5 L8 9 L5 7 L2 9 L3 5.5 L0 3.5 L4 3.5 Z" fill="#b8b0c8"/>
          </svg>
          <div style={{ width: 30, height: 1, background: 'linear-gradient(90deg, #b8b0c8, transparent)' }} />
        </div>
        <Image
          src="/assets/edra-logo.png"
          alt="Edra"
          width={40}
          height={40}
          className="footer-logo"
          style={{ width: 40, height: 'auto' }}
        />
        <p className="footer-text">EDRA ARSITEK &copy; MMXXVI</p>
      </footer>

      <ScrollReveal />
    </>
  );
}
