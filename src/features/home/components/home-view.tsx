"use client";

import { Hero } from "./hero";
import { MainSections } from "./main-section";
import { SiteHeader } from "./site-header";

export const HomeView = () => {
  return (
    <main>
      <SiteHeader />
      <Hero />
      <MainSections />
    </main>
  );
};
