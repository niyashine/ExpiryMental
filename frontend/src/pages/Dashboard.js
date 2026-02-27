import { useNavigate } from "react-router-dom";
import "./dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        {/* Header Section */}
        <div className="dashboard-header">
          <div className="header-badge">🧊 Fridge Expiry Tracker</div>
          <h1 className="dashboard-title">Welcome to Your Fridge</h1>
          <p className="dashboard-subtitle">Manage your groceries, reduce waste, stay organized</p>
        </div>

        {/* Action Cards */}
        <div className="dashboard-cards">
          <button
            onClick={() => navigate("/add-food")}
            className="dashboard-card add-food-card"
          >
            <div className="card-icon-wrapper">
              <div className="card-icon">➕</div>
            </div>
            <h2 className="card-title">Add Food Item</h2>
            <p className="card-description">Add a new item to your fridge and track expiry</p>
            <div className="card-arrow">→</div>
          </button>

          <button
            onClick={() => navigate("/shelf")}
            className="dashboard-card view-shelf-card"
          >
            <div className="card-icon-wrapper">
              <div className="card-icon">🧊</div>
            </div>
            <h2 className="card-title">View Shelf</h2>
            <p className="card-description">Check all your items and their expiry status</p>
            <div className="card-arrow">→</div>
          </button>
        </div>

        {/* Stats/Info Section */}
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>Track Everything</h3>
              <p>Monitor food expiry dates in one place</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3>Save Money</h3>
              <p>Reduce food waste and save your budget</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🌱</div>
            <div className="stat-content">
              <h3>Help Environment</h3>
              <p>Less waste means better future</p>
            </div>
          </div>
        </div>

        {/* Help Tips */}
        <div className="dashboard-tips">
          <h2 className="tips-title">How to Use</h2>
          <div className="tips-grid">
            <div className="tip-item">
              <span className="tip-number">1</span>
              <p>Add items you've bought to your fridge</p>
            </div>
            <div className="tip-item">
              <span className="tip-number">2</span>
              <p>Set the expiry date for each item</p>
            </div>
            <div className="tip-item">
              <span className="tip-number">3</span>
              <p>Check your shelf daily to stay updated</p>
            </div>
            <div className="tip-item">
              <span className="tip-number">4</span>
              <p>Use items before they expire</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;