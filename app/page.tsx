import AboutSection from "./_components/home/AboutSection";
import CallToAction from "./_components/home/CallToAction";
import HowItWorks from "./_components/home/HowItWorks";
import LandingFooter from "./_components/home/LandingFooter";
import LandingHero from "./_components/home/LandingHero";
import LandingNav from "./_components/home/LandingNav";
import ServicesSection from "./_components/home/ServicesSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <LandingNav />
      <LandingHero />
      <ServicesSection />
      <HowItWorks />
      <AboutSection />
      <CallToAction />
      <LandingFooter />
    </main>
  );
}
