import { HeroSection } from '@/components/home/HeroSection';
import { Pillars } from '@/components/home/Pillars';
import { Clients } from '@/components/home/Clients';
import { ClosingCTA } from '@/components/home/ClosingCTA';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <Pillars />
      <Clients />
      <ClosingCTA index="03" />
    </>
  );
}
