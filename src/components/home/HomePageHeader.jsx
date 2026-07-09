import { useEffect, useState } from "react";
import { Search, Moon, Sun, Globe, Accessibility } from "lucide-react";

const HomePageHeader = () => {
  const [now, setNow] = useState(new Date());
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const dateLabel = now.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });

  const timeLabel = now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Asia/Kolkata",
  });

  const dayLabel = now.toLocaleDateString("en-IN", {
    weekday: "long",
    timeZone: "Asia/Kolkata",
  });

  return (
    <div className="h-10 border-b border-railway-border bg-white">
      <div className="mx-auto flex h-full max-w-7xl items-center gap-3 px-4 lg:px-6">
        <div className="hidden min-w-0 shrink-0 items-center gap-3 text-[11px] text-railway-text/70 md:flex">
          <span>{dateLabel}</span>
          <span className="font-semibold text-railway-navy">{timeLabel} IST</span>
          <span className="hidden lg:inline">{dayLabel}</span>
        </div>

        <div className="relative mx-auto w-full max-w-md flex-1">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-railway-text/40" />
          <input
            type="search"
            placeholder="Search trains, coaches, incidents..."
            className="h-7 w-full rounded border border-railway-border bg-white pl-8 pr-2 text-[11px] text-railway-text placeholder:text-railway-text/40 focus:border-railway-blue focus:outline-none"
          />
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            className="inline-flex h-7 items-center gap-1 rounded border border-railway-border px-2 text-[11px] font-medium text-railway-text hover:bg-railway-bg"
          >
            <Globe className="h-3 w-3" />
            <span className="hidden sm:inline">EN</span>
          </button>
          <button
            type="button"
            onClick={() => setIsDark((prev) => !prev)}
            className="inline-flex h-7 items-center gap-1 rounded border border-railway-border px-2 text-[11px] font-medium text-railway-text hover:bg-railway-bg"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="h-3 w-3" /> : <Moon className="h-3 w-3" />}
          </button>
          <button
            type="button"
            className="inline-flex h-7 items-center rounded border border-railway-border px-2 text-[11px] font-medium text-railway-text hover:bg-railway-bg"
            aria-label="Accessibility options"
          >
            <Accessibility className="h-3 w-3" />
          </button>
          <span className="inline-flex h-7 items-center gap-1 rounded border border-green-200 bg-green-50 px-2 text-[11px] font-semibold text-railway-success">
            <span className="h-1.5 w-1.5 rounded-full bg-railway-success" />
            <span className="hidden sm:inline">Operational</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default HomePageHeader;
