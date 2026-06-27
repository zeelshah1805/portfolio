"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import LoadingScreen from "@/components/effects/LoadingScreen";
import CustomCursor from "@/components/effects/CustomCursor";
import SmoothScroll from "@/components/effects/SmoothScroll";
import EasterEgg from "@/components/effects/EasterEgg";
import NeuralBackground from "@/components/three/NeuralBackground";

import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import TechStack from "@/components/sections/TechStack";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import AILab from "@/components/sections/AILab";
import AIPlayground from "@/components/sections/AIPlayground";
import Achievements from "@/components/sections/Achievements";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

export default function Portfolio() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && <LoadingScreen onDone={() => setLoaded(true)} />}
      <CustomCursor />
      <EasterEgg />
      <NeuralBackground />

      <SmoothScroll>
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: loaded ? 1 : 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <Navbar />
          <Hero />
          <About />
          <TechStack />
          <Experience />
          <Projects />
          <AILab />
          <AIPlayground />
          <Achievements />
          <Contact />
          <Footer />
        </motion.main>
      </SmoothScroll>
    </>
  );
}
