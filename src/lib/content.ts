/*
 * Company facts used in more than one place. Everything here is VICIAD's own
 * copy from the existing site; nothing is invented.
 */

export const COMPANY = {
  name: "Viciad Engineering & Construction",
  summary:
    "Quality-assured engineering services capable of satisfying the most stringent requirements of our clients, wherever required, using the best available technical skills.",
};

export const CONTACT = {
  email: "info@viciad.com",
  phones: ["08075420004", "08075422777"],
  address: "Plot 7 Agbada 2 Shell Location Road, Off Airport Road, Rivers State",
};

/** The office address as a Google Maps search, for "Visit us" links. */
export const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${CONTACT.address}, Nigeria`,
)}`;

export const SERVICES = [
  {
    title: "Feasibility & Strategy Studies",
    body: "Assessing the viability and optimal direction of a project before anything is committed.",
  },
  {
    title: "Detail Design Engineering",
    body: "Comprehensive, precise plans and specifications for the implementation of a project.",
  },
  {
    title: "Project Management",
    body: "Planning, organisation and execution of tasks and resources to achieve project goals.",
  },
  {
    title: "Hook-up & Commissioning Support",
    body: "Final installation, connection, testing and activation of equipment and systems.",
  },
  {
    title: "Tenders & Contract Drafting",
    body: "Competitive bids, and the legally binding agreements that set a project's terms.",
  },
  {
    title: "Operational Training",
    body: "Instruction on the proper use and maintenance of equipment for efficient, safe operation.",
  },
];

export const STATS = [
  { value: 25, suffix: "+", label: "Professional teams" },
  { value: 10, suffix: "+", label: "Years of experience" },
  { value: 147, suffix: "+", label: "Completed projects" },
];
