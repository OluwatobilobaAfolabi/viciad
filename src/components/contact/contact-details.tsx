import { ArrowSwap } from "@/components/ui/arrow-swap";
import { CONTACT, MAPS_URL } from "@/lib/content";

const icon = "size-5";

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={icon} aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={icon} aria-hidden>
      <path d="M12 21s-7-6.1-7-11.5a7 7 0 1 1 14 0C19 14.9 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={icon} aria-hidden>
      <path d="M5 4h3.5l1.6 4.1-2.2 1.4a11 11 0 0 0 6.6 6.6l1.4-2.2L20 15.5V19a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1Z" />
    </svg>
  );
}

const card =
  "group flex flex-col gap-5 rounded-md border border-ash bg-white p-7 outline-none transition-colors duration-500 hover:border-brand hover:bg-brand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-onyx";
const badge =
  "flex size-11 items-center justify-center rounded-full bg-brand/10 text-brand transition-colors duration-500 group-hover:bg-white/15 group-hover:text-white";
const title = "type-h3 text-onyx transition-colors duration-500 group-hover:text-white";
const detail = "font-sans text-[15px] leading-[1.6] text-stone transition-colors duration-500 group-hover:text-white/85";

/** The three ways to reach the office, each a direct link; they fill violet on hover like the service cards. */
export function ContactDetails() {
  return (
    <ul className="grid gap-4">
      <li>
        <a href={`mailto:${CONTACT.email}`} className={card}>
          <span className="flex items-start justify-between">
            <span className={badge}>
              <MailIcon />
            </span>
            <ArrowSwap className="text-onyx transition-colors duration-500 group-hover:text-white" />
          </span>
          <span>
            <span className={title}>Send us a mail</span>
            <span className={`${detail} mt-2 block`}>{CONTACT.email}</span>
          </span>
        </a>
      </li>
      <li>
        <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className={card}>
          <span className="flex items-start justify-between">
            <span className={badge}>
              <PinIcon />
            </span>
            <ArrowSwap className="text-onyx transition-colors duration-500 group-hover:text-white" />
          </span>
          <span>
            <span className={title}>Visit us</span>
            <span className={`${detail} mt-2 block max-w-xs`}>{CONTACT.address}</span>
            <span className="sr-only"> (opens Google Maps in a new tab)</span>
          </span>
        </a>
      </li>
      <li>
        <div className={card}>
          <span className={badge}>
            <PhoneIcon />
          </span>
          <span>
            <span className={title}>Call us</span>
            <span className="mt-2 flex flex-col">
              {CONTACT.phones.map((phone) => (
                <a
                  key={phone}
                  href={`tel:${phone}`}
                  className={`${detail} w-fit underline-offset-4 hover:underline`}
                >
                  {phone}
                </a>
              ))}
            </span>
          </span>
        </div>
      </li>
    </ul>
  );
}
