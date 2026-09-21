import Link from "next/link";

export function NpmIcon() {
  return (
    <Link
      href="https://www.npmjs.com/package/creative-skills-kit"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="creative-skills-kit on npm"
      className={`fixed top-[3vw] right-[3vw] z-50 opacity-100 transition-all duration-200 ease-in-out
        text-foreground/70 hover:text-[#cc3534] focus:text-[#cc3534]
        max-md:top-4 max-md:right-4`}
     
    >
      <span
        className="block size-[2.5vw] max-md:size-10"
        aria-hidden="true"
        style={{ transition: "filter 0.5s cubic-bezier(0.4,0,0.2,1)" }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          className="block"
          style={{ transition: "transform 0.5s cubic-bezier(0.4,0,0.2,1)" }}
        >
          <title>npm</title>
          <path d="M20,4H4V20h8V8h4V20h4V4" fill="currentColor" />
          <rect width="24" height="24" fill="none" />
        </svg>
      </span>
    </Link>
  );
}
