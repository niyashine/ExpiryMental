import { useState } from "react";
import "./addfood.css";

function AddFood() {
  const [name, setName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const quickItems = ["Milk", "Bread", "Cheese", "Eggs", "Yogurt"];

  // LocalStorage fallback
  const addLocally = () => {
    if (!name || !expiry) {
      setMessage("Please fill all fields");
      setMessageType("error");
      return;
    }

    const newFood = { name, expiry };
    const existing = JSON.parse(localStorage.getItem("foods") || "[]");
    existing.push(newFood);
    localStorage.setItem("foods", JSON.stringify(existing));

    setMessage("✓ Food added locally!");
    setMessageType("success");
    setName("");
    setExpiry("");
    setTimeout(() => setMessage(""), 3000);
  };

  // Backend add
  const addToBackend = async () => {
    if (!name || !expiry) {
      setMessage("Please fill all fields");
      setMessageType("error");
      return;
    }

    const payload = {
      name,
      quantity: 1,
      expiry_date: expiry
    };

    try {
      const res = await fetch("http://localhost:5000/foods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server returned status ${res.status}: ${text}`);
      }

      setMessage("✓ Food added to backend!");
      setMessageType("success");
      setName("");
      setExpiry("");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Backend error:", err);
      setMessage("⚠ Failed to add to backend. Use local fallback.");
      setMessageType("error");
    }
  };

  const handleQuickAdd = (item) => setName(item);

  return (
    <div className="add-food-wrapper">
      <div className="add-food-container">
        <div className="add-food-header">
          <div className="header-badge">📝 Add Groceries</div>
          <h1 className="add-food-title">Add Food Item</h1>
          <p className="add-food-subtitle">
            Keep track of your groceries and manage expiry dates
          </p>
        </div>

        {/* Quick Add */}
        <div className="quick-add-section">
          <p className="quick-add-title">Quick Add</p>
          <div className="quick-add-buttons">
            {quickItems.map((item) => (
              <button
                key={item}
                type="button"
                className="quick-add-btn"
                onClick={() => handleQuickAdd(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="add-food-form">
          <div className="form-field">
            <label className="form-label">Food Name</label>
            <div className="input-wrapper">
              <span className="input-icon">🥕</span>
              <input
                className="form-input"
                type="text"
                placeholder="e.g. Milk, Bread"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="form-field">
            <label className="form-label">Expiry Date</label>
            <div className="input-wrapper">
              <span className="input-icon">📅</span>
              <input
                className="form-input date-input"
                type="date"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
              />
            </div>
          </div>

          {message && <div className={`message ${messageType}`}>{message}</div>}

          {/* Buttons */}
          <div className="button-group">
            <button onClick={addToBackend} type="button" className="submit-button">
              Add via Backend
            </button>
            <button onClick={addLocally} type="button" className="fallback-button">
              Add Locally (Fallback)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddFood;