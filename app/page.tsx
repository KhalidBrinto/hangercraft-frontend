import Footer from "@/components/footer";
import HeroSection from "@/components/hero-section";
import NewArrival from "@/components/new-arrival";
import TopSelling from "@/components/top-selling";

export default function Home() {
  return (
    
      <div className="flex flex-col items-center justify-center">
        <HeroSection/>
        <TopSelling/>
        <NewArrival/>
        <Footer/>
      </div>
  );
}
