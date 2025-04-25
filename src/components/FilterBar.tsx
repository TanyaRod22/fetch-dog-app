import { FC } from "react";
import Select from "react-select";

interface FilterBarProps {
  breeds: string[];
  selectedBreeds: string[];
  setSelectedBreeds: (breeds: string[]) => void;
  sort: "asc" | "desc";
  setSort: (value: "asc" | "desc") => void;
}

const FilterBar: FC<FilterBarProps> = ({
  breeds,
  selectedBreeds,
  setSelectedBreeds,
  sort,
  setSort,
}) => {
  // ✅ Move this inside the component where breeds is available
  const breedOptions = breeds.map((breed: string) => ({ value: breed, label: breed }));

  return (
  <div className="flex flex-col sticky md:flex-row justify-between items-center gap-4 w-full">
    {/* Left: Breed Selector */}
    <div className="flex items-center gap-3 w-full md:w-auto">
      <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">Filter:</label>
      <div className="w-full md:w-72">
        <Select
          isMulti
          options={breedOptions}
          placeholder="Find your match here"
          className="text-sm"
          classNamePrefix="react-select"
          styles={{
            control: (base) => ({
              ...base,
              borderRadius: "0.5rem",
              borderColor: "#a78bfa", // Tailwind purple-400
              boxShadow: "0 0 0 1px #a78bfa",
              '&:hover': { borderColor: "#7c3aed" }, // Tailwind purple-600
            }),
          }}
          onChange={(selected) => setSelectedBreeds(selected.map((s) => s.value))}
          value={breedOptions.filter((opt) => selectedBreeds.includes(opt.value))}
        />
      </div>
    </div>

    {/* Right: Sort Button */}
    <div className="flex items-center gap-3 justify-end w-full md:w-auto">
      <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">Sort by Breed:</label>
      <button
        onClick={() => setSort(sort === "asc" ? "desc" : "asc")}
        className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-700 transition text-sm"
      >
        {sort === "asc" ? "Ascending ⬆️" : "Descending ⬇️"}
      </button>
    </div>
  </div>
  );
};

export default FilterBar;
