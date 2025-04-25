// 🔍 Updated Search.tsx
import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import DogCard from "../components/DogCard";
import FilterBar from "../components/FilterBar";
import Pagination from "../components/Pagination";
import Logout from "./Logout";
import MatchModel from "../components/MatchModel";
import { Dog } from "../types";

export default function Search() {
  const [breeds, setBreeds] = useState<string[]>([]);
  const [dogs, setDogs] = useState<any[]>([]);
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [sort, setSort] = useState<"asc" | "desc">("asc");
  const [from, setFrom] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null);
  const [showMatchAnimation, setShowMatchAnimation] = useState(false);
  const [currentRouletteDog, setCurrentRouletteDog] = useState<Dog | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCodes, setZipCodes] = useState<string[]>([]);
  const size = 24;

  useEffect(() => {
    fetchBreeds();
  }, []);

  useEffect(() => {
    fetchZipCodes();
  }, [city, state]);

  useEffect(() => {
    fetchDogs();
  }, [selectedBreeds, sort, from, zipCodes]);

  const fetchBreeds = async () => {
    const res = await fetch("https://frontend-take-home-service.fetch.com/dogs/breeds", {
      method: "GET",
      credentials: "include",
    });
    const data = await res.json();
    setBreeds(data);
  };

  const fetchZipCodes = async () => {
    if (!city && !state) {
      setZipCodes([]);
      return;
    }

    const res = await fetch("https://frontend-take-home-service.fetch.com/locations/search", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        city: city || undefined,
        states: state ? [state] : undefined,
        size: 100,
      }),
    });
    const data = await res.json();
    setZipCodes(data.results.map((loc: any) => loc.zip_code));
  };

  const fetchDogs = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      selectedBreeds.forEach((b) => queryParams.append("breeds", b));
      zipCodes.forEach((zip) => queryParams.append("zipCodes", zip));
      queryParams.append("size", size.toString());
      queryParams.append("from", from.toString());
      queryParams.append("sort", `breed:${sort}`);

      const res = await fetch(
        `https://frontend-take-home-service.fetch.com/dogs/search?${queryParams.toString()}`,
        { credentials: "include", method: "GET" }
      );
      const data = await res.json();
      setTotal(data.total);

      const dogsRes = await fetch("https://frontend-take-home-service.fetch.com/dogs", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data.resultIds),
      });
      const dogsData = await dogsRes.json();
      setDogs(dogsData);
    } catch (err) {
      console.error("Error fetching dogs:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((dogId) => dogId !== id) : [...prev, id]
    );
  };

  const handleMatch = async () => {
    setShowMatchAnimation(true);
    const res = await fetch("https://frontend-take-home-service.fetch.com/dogs", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(favorites),
    });
    const dogsData = await res.json();

    let index = 0;
    const interval = setInterval(() => {
      setCurrentRouletteDog(dogsData[index]);
      index = (index + 1) % dogsData.length;
    }, 150);

    setTimeout(async () => {
      clearInterval(interval);
      const matchRes = await fetch("https://frontend-take-home-service.fetch.com/dogs/match", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(favorites),
      });
      const { match } = await matchRes.json();
      const finalRes = await fetch("https://frontend-take-home-service.fetch.com/dogs", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([match]),
      });
      const [dogData] = await finalRes.json();
      setMatchedDog(dogData);
      setShowMatchAnimation(false);
    }, 3000);
  };

  return (
    <div className="flex flex-col min-h-screen w-screen bg-gradient-to-br from-sky-100 to-purple-100">
      <header className="sticky top-0 z-30 w-full bg-gradient-to-br from-sky-100 to-purple-100 shadow-md">
        <div className="flex items-center justify-between px-6 py-4">
          <h1 className="text-3xl font-bold text-purple-700">🐾 Find Your Dog</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="text-purple-700 hover:text-purple-900 p-2 rounded-full bg-white shadow"
              aria-label="Toggle filters"
            >
              <FiSearch size={20} />
            </button>
            {favorites.length > 0 && (
              <button
                onClick={handleMatch}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
              >
                Generate Match ❤️
              </button>
            )}
            <Logout />
          </div>
        </div>
      </header>

      {showFilters && (
        <div className="transition-all duration-300 ease-in-out px-6 py-4">
          <div className="bg-white shadow-md rounded-xl p-4 border border-purple-200">
            <FilterBar
              breeds={breeds}
              selectedBreeds={selectedBreeds}
              setSelectedBreeds={setSelectedBreeds}
              sort={sort}
              setSort={setSort}
              city={city}
              setCity={setCity}
              state={state}
              setState={setState}
            />
          </div>
        </div>
      )}

      <main className="flex-1 px-2 py-4 w-full">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading dogs...</div>
        ) : dogs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dogs.map((dog) => (
              <DogCard
                key={dog.id}
                dog={dog}
                isFavorite={favorites.includes(dog.id)}
                toggleFavorite={() => toggleFavorite(dog.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center size-full bg-gradient-to-br from-purple-100 to-sky-100 rounded-lg shadow text-lg text-gray-600">
            No dogs found 🐶
          </div>
        )}
      </main>

      <footer className="bg-white sticky bottom-0 z-30 w-full">
        <div className="w-full px-1 py-1">
          <Pagination from={from} setFrom={setFrom} size={size} total={total} />
        </div>
      </footer>

      {showMatchAnimation && currentRouletteDog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center animate-pulse">
            <img
              src={currentRouletteDog.img}
              alt={currentRouletteDog.name}
              className="w-64 h-64 object-cover rounded-lg mb-4"
            />
            <h2 className="text-2xl font-bold text-purple-700">Matching with...</h2>
            <p className="mt-2 text-lg">{currentRouletteDog.name}</p>
          </div>
        </div>
      )}

      {matchedDog && <MatchModel dog={matchedDog} onClose={() => setMatchedDog(null)} />}
    </div>
  );
}
