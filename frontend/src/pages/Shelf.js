import { useEffect, useState } from "react";
import "./shelf.css";

function Shelf() {
  const [foods, setFoods] = useState([]);
  const [mode, setMode] = useState("local"); // 'local' or 'backend'
  const [loading, setLoading] = useState(false);

  // Fetch foods based on current mode
  useEffect(() => {
    if (mode === "local") {
      const stored = JSON.parse(localStorage.getItem("foods") || "[]");
      setFoods(stored);
    } else {
      setLoading(true);
      fetch("http://localhost:5000/foods/shelf")
        .then((res) => res.json())
        .then((data) => {
          // Flatten all categories into one array
          const combined = [
            ...data.expired,
            ...data.expiring_soon,
            ...data.fresh_stock,
          ];
          setFoods(combined);
        })
        .catch((err) => {
          console.error("Failed to fetch from backend, falling back to local", err);
          const stored = JSON.parse(localStorage.getItem("foods") || "[]");
          setFoods(stored);
          setMode("local");
        })
        .finally(() => setLoading(false));
    }
  }, [mode]);

  const today = new Date();

  const isExpired = (expiry) => {
    const expiryDate = new Date(expiry);
    return expiryDate < today;
  };

  return (
    <div className="shelf-page">
      <div className="shelf-container">
        <h2 className="shelf-title">Your Shelf</h2>

        {/* Toggle */}
        <div className="toggle-wrapper">
          <button
            className={`toggle-btn ${mode === "local" ? "active" : ""}`}
            onClick={() => setMode("local")}
          >
            LocalStorage
          </button>
          <button
            className={`toggle-btn ${mode === "backend" ? "active" : ""}`}
            onClick={() => setMode("backend")}
          >
            Backend
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : foods.length === 0 ? (
          <p className="shelf-empty">No food items added yet.</p>
        ) : (
          <div className="foods-grid">
            {foods.map((food, index) => (
              <div
                key={index}
                className={`food-card ${
                  isExpired(food.expiry_date || food.expiry) ? "expired" : ""
                }`}
              >
                <h3 className="food-name">{food.name}</h3>
                <p className="food-expiry">
                  Expires: {food.expiry_date || food.expiry}
                </p>
                {isExpired(food.expiry_date || food.expiry) && (
                  <span className="expired-label">Expired ❌</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Shelf;