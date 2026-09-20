import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-[var(--border)] bg-[var(--paper)]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-[-0.22em] select-none text-center font-display text-[24vw] font-semibold leading-none tracking-[-0.1em] text-[#F0F0EE] sm:text-[19vw]">
        zicdeck
      </div>
      <div className="relative mx-auto max-w-7xl px-5 py-[120px]">
        <div className="flex flex-col justify-between gap-6 text-xs font-medium text-[var(--muted)] md:flex-row md:items-center">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
            <Link href="/" className="flex items-center gap-2 font-display text-base font-semibold tracking-[-0.05em] text-[var(--ink)]">
              <div className="block size-4 rounded-[5px]">
                <Image src={'/logo.svg'} alt="logo" className="w-full" width={15} height={15} />  
              </div> ZicDeck
            </Link>
            <span>© 2026 ZicDeck. All rights reserved.</span>
          </div>
          <div className="flex flex-wrap gap-x-7 gap-y-3">
            <a href="#" className="transition-colors hover:text-[var(--ink)]">Cookie policy</a>
            <a href="#" className="transition-colors hover:text-[var(--ink)]">Privacy policy</a>
            <a href="#" className="transition-colors hover:text-[var(--ink)]">Terms of service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
