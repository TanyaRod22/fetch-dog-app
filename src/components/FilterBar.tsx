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
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 w-full">
      {/* Left: Breed dropdown */}
      <div className="flex items-center gap-2 w-full md:w-auto">
        <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Filter by Breed:</label>
        <div className="w-full md:w-64">
          <Select
            isMulti
            options={breedOptions}
            placeholder="find your match here"
            className="text-sm"
            classNamePrefix="react-select"
            onChange={(selectedOptions: any) =>
              setSelectedBreeds(selectedOptions.map((opt: { value: string }) => opt.value))
            }
            value={breedOptions.filter((opt) => selectedBreeds.includes(opt.value))}
          />
        </div>
      </div>

      {/* Right: Sort Button */}
      <div className="flex items-center gap-2 w-full md:w-auto justify-end">
        <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Sort by Breed:</label>
        <button
          onClick={() => setSort(sort === "asc" ? "desc" : "asc")}
          className="bg-purple-600 text-white px-4 h-10 rounded-md text-sm hover:bg-purple-700 transition"
        >
          {sort === "asc" ? "Ascending ⬆️" : "Descending ⬇️"}
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
