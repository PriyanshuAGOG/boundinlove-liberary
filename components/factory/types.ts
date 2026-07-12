import type templates from "@/data/production-templates.json";

export type ProductionTemplate = (typeof templates)[number];
export type StudioInvitation = {
  slug: string;
  eventType: string;
  locale: string;
  timezone: string;
  hosts: { name: string; role?: string }[];
  headline: string;
  message: string;
  events: { id: string; title: string; start: string; venue: { name: string; address: string; mapUrl?: string | null }; dressCode?: string }[];
  gallery: { src: string; alt: string; caption?: string }[];
  rsvp: { enabled: boolean; deadline?: string };
  branding: { showFactoryCredit: boolean; factoryUrl?: string | null };
};

export const demoInvitation: StudioInvitation = {
  slug: "aarav-meera",
  eventType: "Wedding",
  locale: "en-IN",
  timezone: "Asia/Kolkata",
  hosts: [{ name: "Aarav", role: "Partner" }, { name: "Meera", role: "Partner" }],
  headline: "Together with our families",
  message: "With full hearts, we invite you to share in the beginning of our forever.",
  events: [
    { id: "welcome", title: "Welcome dinner", start: "2026-12-01T19:00:00+05:30", venue: { name: "The Garden Courtyard", address: "Jaipur, Rajasthan" }, dressCode: "Indian festive" },
    { id: "wedding", title: "Wedding ceremony", start: "2026-12-02T17:30:00+05:30", venue: { name: "The Palace Lawn", address: "Jaipur, Rajasthan", mapUrl: "https://maps.google.com" }, dressCode: "Traditional formal" }
  ],
  gallery: [],
  rsvp: { enabled: true, deadline: "15 November 2026" },
  branding: { showFactoryCredit: true, factoryUrl: null }
};
