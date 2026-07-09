import {
  IoLogoGithub,
  IoLogoLinkedin,
  IoLogoTwitter,
  IoMail,
  IoTrain,
} from "react-icons/io5";

const Footer = () => {
  return (
    <footer className="relative bg-railway-navy text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <IoTrain className="text-2xl text-white/80" />
              <h3 className="text-xl font-bold text-white">Rail Watch</h3>
            </div>
            <p className="text-sm leading-relaxed text-white/60">
              Real-Time Railway Emergency Monitoring Platform for Indian Railways
              officials and North East Frontier Railway operations.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-white/80">
              Quick Links
            </h4>
            <nav className="space-y-1.5">
              {[
                { href: "/", label: "Home" },
                { href: "/dashboard", label: "Dashboard" },
                { href: "/contact-us", label: "Contact Us" },
                { href: "/profile", label: "Profile" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block text-sm text-white/60 transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-white/80">
              Contact
            </h4>
            <div className="space-y-1.5">
              <p className="text-sm text-white/60">Devarpana Tribedi</p>
              <p className="text-sm text-white/60">Akarshan Ghosh</p>
              <a
                href="mailto:contact@akarshanghosh.dev"
                className="flex items-center space-x-2 text-sm text-white/60 transition-colors hover:text-white"
              >
                <IoMail className="text-base" />
                <span>Get in touch</span>
              </a>
            </div>

            <div className="flex items-center space-x-3 pt-1">
              {[
                {
                  href: "https://github.com/Devarpana",
                  Icon: IoLogoGithub,
                  label: "GitHub",
                },
                {
                  href: "https://www.linkedin.com/in/devarpana-tribedi",
                  Icon: IoLogoLinkedin,
                  label: "LinkedIn",
                },
                {
                  href: "https://x.com/AkarshanGhosh28",
                  Icon: IoLogoTwitter,
                  label: "Twitter",
                },
              ].map(({ href, Icon, label }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="rounded-full border border-white/20 p-2 text-white/60 transition-colors hover:border-white/40 hover:text-white"
                >
                  <Icon className="text-lg" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-4 md:flex-row">
          <div className="flex items-center space-x-2 text-xs text-white/50">
            <span>&copy; {new Date().getFullYear()} Rail Watch</span>
            <span>• All Rights Reserved</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-white/50">
            <span className="h-1.5 w-1.5 rounded-full bg-railway-success" />
            <span>System Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
