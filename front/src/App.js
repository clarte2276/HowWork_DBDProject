import React from "react";
import "./App.css";

function App() {
  return (
    <div className="main-container">
      {/* Header Section with Buttons */}
      <div className="header">
        <button className="header-button">Button 1</button>
        <button className="header-button">Button 2</button>
        <button className="header-button">Button 3</button>
      </div>

      {/* Quadrant Layout */}
      <div className="quadrant-container">
        <div className="quadrant top-left">Top Left</div>
        <div className="quadrant top-right">Top Right</div>
        <div className="quadrant bottom-left">Bottom Left</div>
        <div className="quadrant bottom-right">Bottom Right</div>
      </div>
    </div>
  );
}

export default App;
