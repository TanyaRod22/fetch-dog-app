    import { useEffect, useState } from "react";
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
    const size = 10;
    const [matchedDog, setMatchedDog] = useState<Dog | null>(null);

    useEffect(() => {
        fetchBreeds();
    }, []);

    useEffect(() => {
        fetchDogs();
    }, [selectedBreeds, sort, from]);

    

    const fetchBreeds = async () => {
        
        const res = await fetch("https://frontend-take-home-service.fetch.com/dogs/breeds", {
        method: "GET",
        credentials: "include",
        });
        const data = await res.json();
        console.log("BREEDS:", data); 
        setBreeds(data);
    };


    const [loading, setLoading] = useState(true);
    const fetchDogs = async () => {
        setLoading(true); // Start loading
    
        try {
        const queryParams = new URLSearchParams();
        selectedBreeds.forEach((b) => queryParams.append("breeds", b));
        queryParams.append("size", size.toString());
        queryParams.append("from", from.toString());
        queryParams.append("sort", `breed:${sort}`);
    
        const res = await fetch(
            `https://frontend-take-home-service.fetch.com/dogs/search?${queryParams.toString()}`,
            { credentials: "include" }
        );
        const data = await res.json();
        setTotal(data.total);
    
        const dogsRes = await fetch("https://frontend-take-home-service.fetch.com/dogs", {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data.resultIds),
        });
        const dogsData = await dogsRes.json();
        setDogs(dogsData);
        } catch (err) {
            console.error("Error fetching dogs:", err);
        } finally {
            setLoading(false); // End loading no matter what
        }
    };
    

    const toggleFavorite = (id: string) => {
        setFavorites((prev) =>
        prev.includes(id) ? prev.filter((dogId) => dogId !== id) : [...prev, id]
        );
    };

    const handleMatch = async () => {
      const res = await fetch("https://frontend-take-home-service.fetch.com/dogs/match", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(favorites),
      });
      const { match } = await res.json();
    
      const dogRes = await fetch("https://frontend-take-home-service.fetch.com/dogs", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([match]),
      });
      const [dogData] = await dogRes.json();
      setMatchedDog(dogData);
    };
    
    {matchedDog && <MatchModel dog={matchedDog} onClose={() => setMatchedDog(null)} />}

  return (
    <div className="flex flex-col w-screen min-h-screen bg-gradient-to-br from-sky-100 to-purple-100">
      {/* Heading */}
      <header className="sticky top-0 z-30 w-full">
        <div className="flex items-center justify-between px-4 py-6">
          <h1 className="text-3xl font-bold text-purple-700">🐾 Find Your Dog</h1>
          <Logout />
        </div>
      </header>
  
      {/* Sticky FilterBar */}
      <div className="bg-white top-[28px] z-20 w-full">
        <div className="w-full px-4 py-4">
          <FilterBar
            breeds={breeds}
            selectedBreeds={selectedBreeds}
            setSelectedBreeds={setSelectedBreeds}
            sort={sort}
            setSort={setSort}
          />
        </div>
      </div>
  
      {/* Main Content */}
      <main className="flex-1 px-4 py-6 overflow-y-auto w-full">
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
  
        {favorites.length > 0 && (
          <div className="text-center mt-6">
            <button
              onClick={handleMatch}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
            >
              Generate Match ❤️
            </button>
          </div>
        )}
      </main>
  
      {/* Sticky Footer Pagination */}
      <footer className="bg-white sticky bottom-0 z-30 w-full">
        <div className="w-full px-1 py-1">
          <Pagination from={from} setFrom={setFrom} size={size} total={total} />
        </div>
      </footer>
    </div>
  );
}
