import { assets } from "../../assets/assets";

const ORGANIZATIONS = [
  {
    id: "ir",
    name: "Indian Railways",
    abbr: "IR",
    logo: assets.ir_logo,
  },
  {
    id: "nfr",
    name: "North East Frontier Railway",
    abbr: "NFR",
    logo: assets.nfr_logo,
  },
  {
    id: "iitg",
    name: "IIT Guwahati",
    abbr: "IITG",
    logo: assets.iitg_logo,
  },
  {
    id: "tih",
    name: "Technology Innovation Hub",
    abbr: "TIH",
    logo: assets.tih_logo,
  },
];

const OrganizationHeader = () => {
  return (
    <section className="border-b border-railway-border bg-railway-bg py-3">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-4 lg:grid-cols-4 lg:px-6">
        {ORGANIZATIONS.map((org) => (
          <article
            key={org.id}
            className="flex items-center gap-3 rounded-lg border border-railway-border bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
          >
            {org.logo ? (
              <img
                src={org.logo}
                alt={`${org.name} logo`}
                className="h-11 w-11 shrink-0 rounded-full border border-railway-border object-cover"
              />
            ) : (
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-railway-border bg-railway-bg text-xs font-bold text-railway-blue">
                {org.abbr}
              </div>
            )}
            <p className="text-xs font-semibold leading-tight text-railway-text sm:text-sm">
              {org.name}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default OrganizationHeader;
