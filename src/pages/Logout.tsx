// src/components/LogoutButton.tsx
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch("https://frontend-take-home-service.fetch.com/auth/logout", {
        method: "POST",
        credentials: "include", // ✅ ensures the cookie is sent and invalidated
      });

      navigate("/login"); // Redirect after logout
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition"
    >
      Logout
    </button>
  );
}
