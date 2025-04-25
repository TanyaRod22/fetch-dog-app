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
  const breedOptions = breeds.map((breed: string) => ({
    value: breed,
    label: breed,
  }));

  return (
    <div className="flex flex-col md:flex-row flex-wrap justify-between items-center gap-4 w-full">
      {/* Breed Select */}
      <div className="flex items-center gap-2 w-full md:w-[300px]">
        <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">Breed:</label>
        <Select
          isMulti
          options={breedOptions}
          placeholder="Select breed(s)"
          className="text-sm w-full"
          classNamePrefix="react-select"
          styles={{
            control: (base) => ({
              ...base,
              borderRadius: "0.5rem",
              borderColor: "#a78bfa",
              boxShadow: "0 0 0 1px #a78bfa",
              '&:hover': { borderColor: "#7c3aed" },
            }),
          }}
          onChange={(selected) => setSelectedBreeds(selected.map((s) => s.value))}
          value={breedOptions.filter((opt) => selectedBreeds.includes(opt.value))}
        />
      </div>

      {/* Sort Button */}
      <div className="flex items-center gap-2 justify-end">
        <label className="text-sm font-semibold text-gray-700">Sort:</label>
        <button
          onClick={() => setSort(sort === "asc" ? "desc" : "asc")}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition text-sm"
        >
          {sort === "asc" ? "Ascending ⬆️" : "Descending ⬇️"}
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
