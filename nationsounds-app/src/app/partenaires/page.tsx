'use client';

import React from 'react';
import Image from 'next/image';

interface Partner {
  id: number;
  name: string;
  description: string;
  logo: string;
  website: string;
  category: 'principal' | 'officiel' | 'technique';
}

const partners: Partner[] = [
  {
    id: 1,
    name: 'Région Bretagne',
    description: 'La Région Bretagne soutient activement le développement culturel et les festivals de musique.',
    logo: 'https://placehold.co/400x200/FFFFFF/000000?text=Région+Bretagne',
    website: 'https://www.bretagne.bzh/',
    category: 'principal'
  },
  {
    id: 2,
    name: 'Ville de Saint-Malo',
    description: 'La ville de Saint-Malo accueille le festival et contribue à son organisation.',
    logo: 'https://placehold.co/400x200/FFFFFF/000000?text=Saint+Malo',
    website: 'https://www.saint-malo.fr/',
    category: 'principal'
  },
  {
    id: 3,
    name: 'France Bleu',
    description: 'Radio partenaire officielle du festival.',
    logo: 'https://placehold.co/400x200/FFFFFF/000000?text=France+Bleu',
    website: 'https://www.francebleu.fr/',
    category: 'officiel'
  },
  {
    id: 4,
    name: 'SNCF',
    description: 'Partenaire transport officiel du festival.',
    logo: 'https://placehold.co/400x200/FFFFFF/000000?text=SNCF',
    website: 'https://www.sncf.com/',
    category: 'officiel'
  },
  {
    id: 5,
    name: 'Yamaha',
    description: 'Fournisseur officiel de matériel sonore et musical.',
    logo: 'https://placehold.co/400x200/FFFFFF/000000?text=Yamaha',
    website: 'https://fr.yamaha.com/',
    category: 'technique'
  }
];

export default function PartenairesPage() {
  return (
    <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
            Nos Partenaires
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-300 sm:mt-4">
            Découvrez les partenaires qui rendent possible le festival NationSounds
          </p>
        </div>

        {/* Partenaires Principaux */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-white mb-8">
            Partenaires Principaux
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2">
            {partners
              .filter(partner => partner.category === 'principal')
              .map(partner => (
                <div
                  key={partner.id}
                  className="relative bg-gray-900 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-800"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-center h-32 bg-white rounded-lg mb-4">
                      <div className="relative w-48 h-24">
                        <Image
                          src={partner.logo}
                          alt={`Logo ${partner.name}`}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-white">{partner.name}</h3>
                    <p className="mt-2 text-gray-300">{partner.description}</p>
                    <a
                      href={partner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center text-indigo-400 hover:text-indigo-300"
                    >
                      Visiter le site
                      <svg className="ml-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Partenaires Officiels */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-white mb-8">
            Partenaires Officiels
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {partners
              .filter(partner => partner.category === 'officiel')
              .map(partner => (
                <div
                  key={partner.id}
                  className="relative bg-gray-900 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-800"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-center h-24 bg-white rounded-lg mb-4">
                      <div className="relative w-36 h-20">
                        <Image
                          src={partner.logo}
                          alt={`Logo ${partner.name}`}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-white">{partner.name}</h3>
                    <p className="mt-2 text-sm text-gray-300">{partner.description}</p>
                    <a
                      href={partner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center text-indigo-400 hover:text-indigo-300"
                    >
                      Visiter le site
                      <svg className="ml-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Partenaires Techniques */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-white mb-8">
            Partenaires Techniques
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {partners
              .filter(partner => partner.category === 'technique')
              .map(partner => (
                <div
                  key={partner.id}
                  className="relative bg-gray-900 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-800"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-center h-24 bg-white rounded-lg mb-4">
                      <div className="relative w-36 h-20">
                        <Image
                          src={partner.logo}
                          alt={`Logo ${partner.name}`}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-white">{partner.name}</h3>
                    <p className="mt-2 text-sm text-gray-300">{partner.description}</p>
                    <a
                      href={partner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center text-indigo-400 hover:text-indigo-300"
                    >
                      Visiter le site
                      <svg className="ml-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
} 