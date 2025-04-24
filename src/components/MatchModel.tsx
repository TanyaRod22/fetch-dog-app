import { FC } from "react";
import { Dog } from "../types";

interface MatchModelProps {
  dog: Dog;
  onClose: () => void;
}

const MatchModel: FC<MatchModelProps> = ({ dog, onClose }) => {
  if (!dog) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md text-center relative">
        <button onClick={onClose} className="absolute top-2 right-4 text-gray-600 text-xl">×</button>
        <h2 className="text-xl font-bold mb-2">🎉 Meet your match: {dog.name}</h2>
        <img src={dog.img} alt={dog.name} className="w-64 h-64 object-cover mx-auto rounded-md mb-4" />
        <p className="text-gray-600">Breed: {dog.breed}</p>
        <p className="text-gray-600">Age: {dog.age}</p>
        <p className="text-gray-600">Zip Code: {dog.zip_code}</p>
      </div>
    </div>
  );
};

export default MatchModel;
