import { useEffect, useState } from "react";
import "./shelf.css";

function Shelf() {
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("foods")) || [];
    setFoods(stored);
  }, []);

  return (
    <div className="shelf-page">
      <div className="shelf-container">
        <h2 className="shelf-title">Your Shelf</h2>

        {foods.length === 0 ? (
          <p className="shelf-empty">No food items added yet.</p>
        ) : (
          <div className="foods-grid">
            {foods.map((food, index) => (
              <div key={index} className="food-card">
                
                <h3 className="food-name">{food.name}</h3>
                <p className="food-expiry">Expires: {food.expiry}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Shelf;