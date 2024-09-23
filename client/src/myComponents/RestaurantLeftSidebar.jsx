import React, { useState } from "react";
import "./ReservationTableDisplayAdmin.css";

const LeftSidebar = ({ onTableClick, onLayoutChange }) => {
  const [layoutType, setLayoutType] = useState("inside");

  const handleLayoutChange = (layout) => {
    setLayoutType(layout);
    onLayoutChange(layout);
  };

  return (
    <>
      <div className="left-side-container">
        <div className="left-sidebar">
          <h2>Placement</h2>
          <div
            className="layout-option"
            onClick={() => handleLayoutChange("inside")}
          >
            <button className="table-option">Inside Layout</button>
          </div>
          <div
            className="layout-option"
            onClick={() => handleLayoutChange("outside")}
          >
            <button className="table-option">Outside Layout</button>
          </div>
          <h3>Table Sizes</h3>
          <div
            className="table-option"
            onClick={() => onTableClick && onTableClick(2, layoutType)}
          >
            Table for 2
          </div>
          <div
            className="table-option"
            onClick={() => onTableClick && onTableClick(4, layoutType)}
          >
            Table for 4
          </div>
          <div
            className="table-option"
            onClick={() => onTableClick && onTableClick(6, layoutType)}
          >
            Table for 6
          </div>
          <div
            className="table-option"
            onClick={() => onTableClick && onTableClick(8, layoutType)}
          >
            Table for 8
          </div>
        </div>
      </div>
    </>
  );
};

export default LeftSidebar;
