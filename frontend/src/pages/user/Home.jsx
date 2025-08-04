import React from "react";
import HeroSection from "../../components/user/HeroSection";

import LatestCollection from "../../components/user/LatestCollection";
import CategoryProducts from "../../components/user/CategoryProducts";
import AdBanner from "../../components/user/AdBanner";
import TopRated from "../../components/user/TopRated";

const Home = () => {
  return (
    <div>
      <div>
        <HeroSection />
        <LatestCollection />
        <CategoryProducts />
        <AdBanner />
        <TopRated />
      </div>
    </div>
  );
};

export default Home;
