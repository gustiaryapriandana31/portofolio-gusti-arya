import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Education from "@/components/Education";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Certifications from "@/components/Certifications";
import FeedbackSection from "@/components/FeedbackSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <Hero />
        <About />
        <Education />
        <Experience />
        <Projects />
        <Skills />
        <Certifications />
        <FeedbackSection />
      </main>
      <Footer />
    </>
  );
}
