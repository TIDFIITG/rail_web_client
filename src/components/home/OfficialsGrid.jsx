const OFFICIALS = [
  { id: "pm", title: "PM" },
  { id: "president", title: "President of India" },
  { id: "rail-minister", title: "Railway Minister" },
  { id: "nfr", title: "NFR Authority" },
  { id: "iit-director", title: "Director of IIT" },
  { id: "project-director", title: "Project Director" },
];

const OfficialsGrid = () => {
  return (
    <div className="grid h-full grid-cols-3 grid-rows-2 gap-2">
      {OFFICIALS.map((official) => (
        <article
          key={official.id}
          className="flex flex-col items-center justify-center rounded-lg border border-gray-300 bg-gray-200 px-2 py-3 text-center"
        >
          <div className="mb-2 h-10 w-10 rounded-full border border-gray-400 bg-gray-300" />
          <p className="text-[11px] font-semibold leading-tight text-gray-800 sm:text-xs">
            {official.title}
          </p>
        </article>
      ))}
    </div>
  );
};

export default OfficialsGrid;
