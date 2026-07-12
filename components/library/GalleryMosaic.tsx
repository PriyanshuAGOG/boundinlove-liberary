import type { GalleryItem } from "./types";

type GalleryMosaicProps = {
  items: GalleryItem[];
  title?: string;
};

export function GalleryMosaic({ items, title = "A few favourite frames" }: GalleryMosaicProps) {
  if (!items.length) return null;
  return (
    <section className="invite-section" aria-labelledby="gallery-title">
      <p className="invite-eyebrow">Our gallery</p>
      <h2 id="gallery-title" className="invite-display invite-section__title">{title}</h2>
      <div className="invite-gallery">
        {items.map((item, index) => (
          <figure key={`${item.src}-${index}`} className="invite-gallery__item">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.src} alt={item.alt} loading={index > 1 ? "lazy" : "eager"} />
            {item.caption && <figcaption>{item.caption}</figcaption>}
          </figure>
        ))}
      </div>
    </section>
  );
}

