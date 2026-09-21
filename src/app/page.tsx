import { HeroSection } from '@/components/home/HeroSection';
import { Pillars } from '@/components/home/Pillars';
import { StatBar } from '@/components/home/StatBar';
import { Clients } from '@/components/home/Clients';
import { ClosingCTA } from '@/components/home/ClosingCTA';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <Pillars />
      <StatBar />
      <Clients />
      <ClosingCTA />
    </>
  );
}
