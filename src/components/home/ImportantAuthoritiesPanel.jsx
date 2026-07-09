import PM from "../../assets/authorities/PM.jpg";
import President from "../../assets/authorities/president.jpg";
import RailwayMinister from "../../assets/authorities/rail_minister.jpeg";
import GM from "../../assets/authorities/GM.jpg";
import Director from "../../assets/authorities/director.jpg";
import PD from "../../assets/authorities/PD.jpg";

const AUTHORITIES = [
  {
    id: "president",
    name: "Droupadi Murmu",
    designation: "President of India",
    image: President,
  },
  {
    id: "pm",
    name: "Narendra Modi",
    designation: "Prime Minister of India",
    image: PM,
  },
  {
    id: "rail-minister",
    name: "Ashwini Vaishnaw",
    designation: "Ministry of Railways",
    image: RailwayMinister,
  },
  {
    id: "nfr-gm",
    name: "Chetan Kumar Shrivastava",
    designation: "North Frontier Railway General Manager",
    image: GM,
  },
  {
    id: "iit-director",
    name: "Prof. Devendra Jalihal",
    designation: "Director, IIT Guwahati",
    image: Director,
  },
  {
    id: "project-director",
    name: "Dr. S. K. Dwivedy",
    designation: "Project Director",
    image: PD,
  },
];

const ImportantAuthoritiesPanel = ({ className = "" }) => {
  return (
    <section
      className={`flex h-full flex-col rounded-xl border border-railway-border bg-white p-4 shadow-sm ${className}`}
    >
      <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-railway-navy">
        Important Authorities
      </h2>

      <div className="grid grid-cols-3 gap-4">
        {AUTHORITIES.map((person) => (
          <article
            key={person.id}
            className="flex flex-col items-center rounded-xl border border-gray-200 bg-white p-4 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-blue-300"
          >
            <div className="mb-3 h-20 w-20 overflow-hidden rounded-full ring-2 ring-gray-200 shadow-sm">
              <img
                src={person.image}
                alt={person.name}
                className="h-full w-full object-cover"
              />
            </div>

            <h3 className="text-sm font-semibold leading-tight text-gray-900">
              {person.name}
            </h3>

            <p className="mt-1 text-xs leading-tight text-gray-500">
              {person.designation}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ImportantAuthoritiesPanel;