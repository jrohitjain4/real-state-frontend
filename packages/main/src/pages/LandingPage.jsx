import React, { useState, useEffect } from "react";
import { Navigation } from "../landing/components/navigation";
import { Header } from "../landing/components/header";
import { Features } from "../landing/components/features";
import { About } from "../landing/components/about";
import { Services } from "../landing/components/services";
import { Gallery } from "../landing/components/gallery";
import { Testimonials } from "../landing/components/testimonials";
import { Team } from "../landing/components/Team";
import { Contact } from "../landing/components/contact";
import JsonData from "../landing/data/data.json";
import SmoothScroll from "smooth-scroll";

export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
});

const LandingPage = () => {
  const [landingPageData, setLandingPageData] = useState({});
  
  useEffect(() => {
    setLandingPageData(JsonData);
  }, []);

  return (
    <div>
      <Navigation />
      <Header data={landingPageData.Header} />
      <Features data={landingPageData.Features} />
      <About data={landingPageData.About} />
      <Services data={landingPageData.Services} />
      <Gallery data={landingPageData.Gallery} />
      <Testimonials data={landingPageData.Testimonials} />
      <Team data={landingPageData.Team} />
      <Contact data={landingPageData.Contact} />
    </div>
  );
};

export default LandingPage;