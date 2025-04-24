import { FC } from "react";
import { Dog } from "../types";

interface DogCardProps {
  dog: Dog;
  isFavorite: boolean;
  toggleFavorite: () => void;
}

const DogCard: FC<DogCardProps> = ({ dog, isFavorite, toggleFavorite }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md text-center relative">
      <img src={dog.img} alt={dog.name} className="w-full h-48 object-cover rounded-md mb-2" />
      <h3 className="text-lg font-bold">{dog.name}</h3>
      <p className="text-sm text-gray-600">{dog.breed}</p>
      <p className="text-sm text-gray-500">Age: {dog.age} | Zip: {dog.zip_code}</p>

      <button onClick={toggleFavorite} className="absolute top-2 right-2 text-xl">
        {isFavorite ? "❤️" : "🤍"}
      </button>
    </div>
  );
};

export default DogCard;
