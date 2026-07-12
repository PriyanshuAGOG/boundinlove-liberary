export type InvitationHost = {
  name: string;
  role?: string;
  portrait?: string | null;
};

export type InvitationVenue = {
  name: string;
  address: string;
  mapUrl?: string | null;
};

export type InvitationEvent = {
  id: string;
  title: string;
  start: string;
  end?: string | null;
  venue: InvitationVenue;
  description?: string | null;
  dressCode?: string | null;
};

export type GalleryItem = {
  src: string;
  alt: string;
  caption?: string;
};

