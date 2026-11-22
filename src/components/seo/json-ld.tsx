import type { JSX } from "react";

export function JsonLd({ data }: { data: Record<string, unknown> }): JSX.Element {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "GeneralContractor",
  "@id": "https://www.viciad.org/#organization",
  name: "Viciad Engineering & Construction",
  alternateName: "VICIAD",
  url: "https://www.viciad.org",
  logo: "https://www.viciad.org/apple-touch-icon.png",
  image: "https://www.viciad.org/og-image.jpg",
  description:
    "Quality-assured engineering services capable of satisfying the most stringent requirements of our clients across Nigeria.",
  email: "info@viciad.com",
  telephone: ["+2348075420004", "+2348075422777"],
  address: {
    "@type": "PostalAddress",
    streetAddress: "Plot 7 Agbada 2 Shell Location Road, Off Airport Road",
    addressLocality: "Port Harcourt",
    addressRegion: "Rivers State",
    addressCountry: "NG",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "4.8967",
    longitude: "7.0135",
  },
  // TODO: Replace social media link placeholders with your official handles
  sameAs: [
    "https://www.linkedin.com/company/viciad",
    "https://www.facebook.com/viciad",
    "https://twitter.com/viciad",
  ],
  knowsAbout: [
    "Civil Construction",
    "Road & Bridge Construction",
    "Foundation Construction & Piling",
    "Hook-up & Commissioning Support",
    "Feasibility & Strategy Studies",
    "Detail Design Engineering",
    "ISO 9001 Quality Management",
    "ISO 14001 Environmental Management",
    "ISO 45001 Occupational Health and Safety",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Engineering and Construction Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Feasibility & Strategy Studies",
          description: "Assessing the viability and optimal direction of a project before anything is committed.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Detail Design Engineering",
          description: "Comprehensive, precise plans and specifications for the implementation of a project.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Project Management",
          description: "Planning, organisation and execution of tasks and resources to achieve project goals.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Hook-up & Commissioning Support",
          description: "Final installation, connection, testing and activation of equipment and systems.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Tenders & Contract Drafting",
          description: "Competitive bids, and the legally binding agreements that set a project's terms.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Operational Training",
          description: "Instruction on the proper use and maintenance of equipment for efficient, safe operation.",
        },
      },
    ],
  },
};

export const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://www.viciad.org/#website",
  url: "https://www.viciad.org",
  name: "VICIAD Engineering & Construction",
  description: "Quality-assured engineering and civil construction in Nigeria",
  publisher: {
    "@id": "https://www.viciad.org/#organization",
  },
  inLanguage: "en-US",
};

export const HOME_FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Do you take on whole projects, or single stages?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Both. We regularly handle projects from the initial feasibility phase right through to design, implementation and commissioning — or step in at any single stage of the cycle, according to your requirements.",
      },
    },
    {
      "@type": "Question",
      name: "Are you tied to any equipment supplier?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. We are completely independent of equipment suppliers, so the solutions we recommend for your design and project management requirements are unbiased.",
      },
    },
    {
      "@type": "Question",
      name: "How do you keep projects on schedule?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Completion on time is a foremost objective. Working in both manual and computerised techniques, we give you a realistic plan with targets for work accomplishment, accurate reporting of status and progress, exception reports on critical activities, and early detection of deviations so preventative action can be taken in time.",
      },
    },
    {
      "@type": "Question",
      name: "What does the initial consultancy phase involve?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It determines the baseline specification for the project in terms of technology, budget and timescales. Acting as your adviser, we supply an achievable, practical project plan covering every activity and technology needed to meet your requirements.",
      },
    },
    {
      "@type": "Question",
      name: "Who will work on my project?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our consultants are recruited for field experience, not just academics, and each area of our work has its own manager responsible for its operation.",
      },
    },
    {
      "@type": "Question",
      name: "Where are you based?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Plot 7 Agbada 2 Shell Location Road, Off Airport Road, Rivers State. You can reach us at info@viciad.com, or on 08075420004 and 08075422777.",
      },
    },
  ],
};

export function createBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
