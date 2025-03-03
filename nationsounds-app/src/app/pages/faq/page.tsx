"use client";
import React, { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "Qu'est-ce que le Corefeast ?",
    answer: "Corefeast est un festival dédié aux genres Metalcore, Hardcore et Deathcore. Il réunit chaque année des artistes emblématiques et des fans passionnés de musique extrême, offrant une expérience immersive dans l'univers de ces sous-genres du metal."
  },
  {
    question: "Quels genres de musique sont représentés au Corefeast ?",
    answer: "Le festival se concentre principalement sur trois genres :\n\nMetalcore : Un mélange de metal et de hardcore punk, caractérisé par des riffs agressifs, des breakdowns puissants et des alternances entre chants criés et mélodiques.\n\nHardcore : Un sous-genre du punk rock, connu pour son intensité brute, ses paroles souvent engagées, et une approche plus directe et énergique.\n\nDeathcore : Un mélange de death metal et de metalcore, avec des éléments extrêmes comme les growls profonds, des blast beats rapides et des breakdowns dévastateurs."
  },
  {
    question: "Le festival est-il ouvert à tous les âges ?",
    answer: "Corefeast est un événement pour tous, mais en raison de la nature du spectacle et du contenu explicite de certaines paroles, les moins de 16 ans doivent être accompagnés d'un adulte. Une pièce d'identité peut être demandée à l'entrée."
  },
  {
    question: "Quelles sont les règles de sécurité et de comportement ?",
    answer: "Le respect des autres festivaliers, des artistes et du personnel est primordial. Les comportements violents ou discriminatoires ne seront pas tolérés. Les mosh pits sont autorisés, mais veillez à respecter la sécurité des autres participants. Toute personne enfreignant les règles sera expulsée sans remboursement."
  },
  {
    question: "Y a-t-il des options de restauration sur place ?",
    answer: "Oui, Corefeast propose une variété de stands de nourriture, avec des options pour tous les goûts, y compris végétariennes et véganes. Des boissons non alcoolisées et alcoolisées seront également disponibles, avec des zones spécifiques pour la consommation d'alcool."
  },
  {
    question: "Puis-je camper sur le site du festival ?",
    answer: "Corefeast offre un espace de camping pour les festivaliers souhaitant profiter pleinement de l'expérience. Des tickets spéciaux pour le camping doivent être achetés en avance. Les règles du camping interdisent l'apport de boissons alcoolisées et d'objets dangereux sur le site."
  },
  {
    question: "Y a-t-il un service de consignes pour les objets de valeur ?",
    answer: "Oui, des consignes sécurisées seront disponibles sur place pour ranger vos objets de valeur comme les téléphones, portefeuilles, et autres effets personnels."
  },
  {
    question: "Qui sont les têtes d'affiche cette année ?",
    answer: "La programmation varie chaque année, mais Corefeast a accueilli par le passé des groupes légendaires du Metalcore, Hardcore et Deathcore. Consultez notre site officiel pour la liste complète des artistes de cette édition."
  },
  {
    question: "Qu'est-ce qu'un mosh pit, et puis-je y participer ?",
    answer: "Un mosh pit est une forme de danse agressive où les festivaliers se bousculent dans une zone proche de la scène. Bien que cela puisse paraître intense, le mosh pit repose sur une règle non officielle de respect mutuel. Si quelqu'un tombe, les autres s'arrêtent pour l'aider à se relever. Vous pouvez y participer, mais soyez conscient de vos limites physiques."
  },
  {
    question: "Puis-je acheter du merchandising sur place ?",
    answer: "Absolument ! Un large choix de produits dérivés, incluant des T-shirts, des CDs, des vinyles, et autres articles des groupes participants ainsi que du festival lui-même, sera disponible à l'achat."
  },
  {
    question: "Comment puis-je obtenir mes billets pour Corefeast ?",
    answer: "Les billets sont disponibles à l'achat sur notre site officiel, ainsi que via des points de vente partenaires. Il est recommandé d'acheter vos billets à l'avance, car le festival peut être complet."
  },
  {
    question: "Que dois-je apporter avec moi au festival ?",
    answer: "Voici quelques recommandations :\n\n- Votre billet (numérique ou imprimé)\n- Une pièce d'identité\n- Des vêtements adaptés à la météo (ainsi que des chaussures confortables pour les concerts)\n- Des bouchons d'oreilles (la musique peut être très forte)\n- Une gourde (des points d'eau sont disponibles pour la remplir)\n- Un petit sac à dos pour vos effets personnels"
  },
  {
    question: "Comment puis-je rester informé des mises à jour du festival ?",
    answer: "Suivez-nous sur nos réseaux sociaux (@CorefeastFestival sur Instagram, Twitter et Facebook) et abonnez-vous à notre newsletter via notre site web pour toutes les dernières annonces, mises à jour et informations pratiques."
  },
  {
    question: "Quelle est la politique de remboursement ?",
    answer: "Les billets ne sont généralement pas remboursables, sauf en cas d'annulation du festival. Consultez les conditions de vente sur notre site pour plus de détails."
  },
  {
    question: "Y aura-t-il des dispositifs pour les personnes à mobilité réduite ?",
    answer: "Oui, Corefeast s'engage à être accessible à tous. Des infrastructures adaptées aux personnes à mobilité réduite seront présentes sur le site, y compris des rampes d'accès, des sanitaires adaptés et des espaces réservés près de la scène."
  }
];

const FAQItem: React.FC<{ item: FAQItem }> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-700">
      <button
        className="w-full py-4 text-left flex justify-between items-center focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-white text-lg font-medium">{item.question}</span>
        <svg
          className={`w-6 h-6 text-white transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="pb-4 text-gray-300 whitespace-pre-line">
          {item.answer}
        </div>
      </div>
    </div>
  );
};

const Faq: React.FC = () => {
  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        {/* Titre */}
        <div className="relative flex justify-center mb-12">
          <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-transparent bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-75"></div>
          <span className="relative z-10 bg-black px-6 text-white md:text-2xl lg:text-4xl">
            FAQ
          </span>
        </div>

        {/* Liste des questions */}
        <div className="max-w-3xl mx-auto">
          {faqData.map((item, index) => (
            <FAQItem key={index} item={item} />
          ))}
        </div>

        {/* Message de contact */}
        <div className="text-center mt-12 text-gray-400">
          <p>
            Pour toute autre question, n'hésitez pas à nous contacter via notre
            formulaire en ligne ou sur nos réseaux sociaux. On se voit au Corefeast !
          </p>
        </div>
      </div>
    </div>
  );
};

export default Faq;
