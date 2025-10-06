import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { GallerySection } from "@/components/sections/gallery-section";
import { HeroSection } from "@/components/sections/hero-section";
import { SponsorsSection } from "@/components/sections/sponsors-section";
import { SuggestionsSection } from "@/components/sections/suggestions-section";

export default async function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 w-full max-w-screen-xl border-border border-dotted border-x mx-auto">
        <HeroSection />
        <GallerySection />
        <SponsorsSection />
        <SuggestionsSection />
      </div>
      <Footer />
    </div>
  );
}
