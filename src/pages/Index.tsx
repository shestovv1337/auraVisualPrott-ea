import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import FeaturesSection from "@/components/FeaturesSection";
import GallerySection from "@/components/GallerySection";
import BeforeAfterSection from "@/components/BeforeAfterSection";
import AdvantagesSection from "@/components/AdvantagesSection";
import VideoReviewsSection from "@/components/VideoReviewsSection";
import UpdatesSection from "@/components/UpdatesSection";
import MediaSection from "@/components/MediaSection";
import FooterSection from "@/components/FooterSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <GallerySection />
      <BeforeAfterSection />
      <AdvantagesSection />
      <VideoReviewsSection />
      <UpdatesSection />
      <MediaSection />
      <FooterSection />
    </div>
  );
};

export default Index;
