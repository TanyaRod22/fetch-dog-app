import { FC } from "react";

interface PaginationProps {
  from: number;
  setFrom: (value: number) => void;
  size: number;
  total: number;
}

const Pagination: FC<PaginationProps> = ({ from, setFrom, size, total }) => {
  const totalPages = Math.ceil(total / size);
  const currentPage = Math.floor(from / size) + 1;

  const goPrev = () => {
    if (from >= size) setFrom(from - size);
  };

  const goNext = () => {
    if (from + size < total) setFrom(from + size);
  };

  return (
    <div className="flex justify-center items-center gap-4 mt-3 mb-3">
      <button
        onClick={goPrev}
        disabled={from === 0}
        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-300"
      >
        Previous
      </button>
      <span className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={goNext}
        disabled={from + size >= total}
        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-300"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
