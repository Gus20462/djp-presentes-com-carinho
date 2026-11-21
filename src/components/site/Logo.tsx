import { Link } from "@tanstack/react-router";
import logo from "@/assets/djp-logo.png.asset.json";

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label="DJP Presentes Personalizados — início">
      <img src={logo.url} alt="" width={44} height={44} className="h-11 w-11 rounded-full shadow-soft" />
      <span className="flex flex-col leading-none">
        <span className={inverted ? "font-display text-lg font-extrabold text-ink-foreground" : "font-display text-lg font-extrabold"}>
          DJP
        </span>
        <span className={inverted ? "text-[0.68rem] font-medium tracking-wide text-ink-foreground/70" : "text-[0.68rem] font-medium tracking-wide text-muted-foreground"}>
          Presentes Personalizados
        </span>
      </span>
    </Link>
  );
}
