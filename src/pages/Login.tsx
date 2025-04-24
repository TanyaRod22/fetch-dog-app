import { useState } from "react";

export default function Login() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true)
    try {
      const res = await fetch("https://frontend-take-home-service.fetch.com/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ name, email }),
      });

      if (!res.ok) {
        throw new Error("Login failed");
      }

      console.log("login succesful")
      // Success → redirect to /search
      window.location.href = "/search";
    } catch (err) {
      setError("Login failed. Try again.");
    } finally {
      setLoading(false); // ⬅️ reset after login attempt
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 flex items-center justify-center">
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-md w-full">
        <h2 className="text-3xl font-bold text-center text-purple-700 mb-4">🐶 Welcome to Fetch</h2>
        <p className="text-sm text-gray-500 text-center mb-6">Find your future furry friend</p>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
