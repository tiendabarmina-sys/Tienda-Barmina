import React from 'react';
import { StoreConfig } from '../types';

interface HeroSectionProps {
  storeConfig: StoreConfig;
  onExploreClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ storeConfig, onExploreClick }) => {
  return (
    <section className="relative min-h-[580px] lg:min-h-[640px] flex items-center justify-center overflow-hidden rounded-3xl my-4 mx-4 sm:mx-6 lg:mx-8 shadow-md">
      {/* Background Image */}
      <img
        src={storeConfig.heroImageUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuB0mDD-NbofRnh0NeKz-dI8s_3Jc84USuXwX8Ps1a9coaTvLfrLxhO9wmfocY7g1j2w5NCfUStRcVfP5O6b5s3romAAOgWIbPJNVQ-OdrNwNBR5SrvowCx_E98ooHjWIzR2GENSlgaQIWw61ywDGjjLh7T-oxZojROLidQKf75X_RcD3bcV8Q9Jw0Tkw8RJQNxxh4RrYanuCTVjdfUPH1UiHhm-ico7-yqP_L3DhlQefcVQHV051lLNCF7qZIzVaMmCBJsCqI5k2-M"}
        alt={storeConfig.storeName}
        className="absolute inset-0 w-full h-full object-cover object-center scale-105 transition-transform duration-1000"
      />

      {/* Dark editorial gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#162839]/85 via-[#162839]/60 to-transparent" />

      {/* Content */}
      <div className="relative max-w-7xl w-full mx-auto px-6 sm:px-12 py-16 text-white z-10">
        <div className="max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs tracking-wider uppercase font-medium text-[#F9F7F2]">
            <span className="w-2 h-2 rounded-full bg-[#B85C38] animate-pulse" />
            {storeConfig.heroBadge}
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.15] text-[#F9F7F2] tracking-tight">
            {storeConfig.heroTitle}
          </h1>

          <p className="text-base sm:text-lg text-white/80 font-normal leading-relaxed max-w-xl">
            {storeConfig.heroSubtitle}
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <button
              onClick={onExploreClick}
              className="px-8 py-4 bg-[#B85C38] hover:bg-[#a04e2d] text-white text-sm font-semibold rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
              id="hero-explore-cta"
            >
              <span>{storeConfig.heroButtonText}</span>
              <span className="material-symbols-outlined text-lg">east</span>
            </button>

            <div className="flex items-center gap-6 pl-2 text-xs text-white/70">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#6E8371] text-sm">verified</span>
                <span>100% Natural</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#6E8371] text-sm">potted_plant</span>
                <span>Sustentable</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
