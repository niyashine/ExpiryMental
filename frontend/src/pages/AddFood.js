import { useState } from "react";
import "./addfood.css";

function AddFood() {
  const [name, setName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();

    if (!name || !expiry) {
      setMessage("Please fill all fields");
      setMessageType("error");
      return;
    }

    const newFood = { name, expiry };
    const existing = JSON.parse(localStorage.getItem("foods")) || [];
    existing.push(newFood);
    localStorage.setItem("foods", JSON.stringify(existing));

    setMessage("✓ Food added successfully!");
    setMessageType("success");
    setName("");
    setExpiry("");
    setTimeout(() => setMessage(""), 3000);
  };

  const quickItems = ["Milk", "Bread", "Cheese", "Eggs", "Yogurt"];

  const handleQuickAdd = (item) => {
    setName(item);
  };

  return (
    <div className="add-food-wrapper">
      <div className="add-food-container">
        {/* Header */}
        <div className="add-food-header">
          <div className="header-badge">📝 Add Groceries</div>
          <h1 className="add-food-title">Add Food Item</h1>
          <p className="add-food-subtitle">Keep track of your groceries and manage expiry dates</p>
        </div>

        {/* Quick Add Buttons */}
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
        <form onSubmit={handleAdd} className="add-food-form">
          <div className="form-field">
            <label className="form-label">Food Name</label>
            <div className="input-wrapper">
              <span className="input-icon">🥕</span>
              <input
                className="form-input"
                type="text"
                placeholder="e.g. Milk, Bread, Cheese"
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

          <button type="submit" className="submit-button">Add to Fridge</button>
        </form>

        {/* Tips Section */}
        <div className="tips-section">
          <h3 className="tips-heading">Tips for Better Results</h3>
          <div className="tips-list">
            <div className="tip">
              <span className="tip-icon">💡</span>
              <p>Always check the expiry date on the product</p>
            </div>
            <div className="tip">
              <span className="tip-icon">❄️</span>
              <p>Store items properly to extend freshness</p>
            </div>
            <div className="tip">
              <span className="tip-icon">📌</span>
              <p>Check your shelf daily for upcoming expiries</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddFood;