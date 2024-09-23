import React, { useState } from 'react';
import './ReservationTableDisplayAdmin.css';
import PropTypes from "prop-types";
const TableLayout = ({ tables, onTableMove, onDeleteTable }) => {
  const [draggedTable, setDraggedTable] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleDragStart = (e, table) => {
    setDraggedTable(table);

    // Calculate and store the mouse offset relative to the table's top-left corner
    const rect = e.target.getBoundingClientRect();
    setOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });

    e.dataTransfer.effectAllowed = 'move';
    e.target.classList.add('dragging');
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Allow drop
  };

  const handleDrop = (e) => {
    e.preventDefault();

    if (draggedTable !== null) {
      const dropzoneRect = e.currentTarget.getBoundingClientRect();
      const newX = e.clientX - dropzoneRect.left - offset.x;
      const newY = e.clientY - dropzoneRect.top - offset.y;

      // Only update the dragged table's position locally, do not save to the backend
      onTableMove(draggedTable.id || draggedTable.tempId, { left: newX, top: newY });
      setDraggedTable(null);
    }

    // Remove dragging class from all tables
    document.querySelectorAll('.table.dragging').forEach((el) => {
      el.classList.remove('dragging');
    });
  };

  const handleDragEnd = () => {
    setDraggedTable(null);

    // Remove dragging class from all tables
    document.querySelectorAll('.table.dragging').forEach((el) => {
      el.classList.remove('dragging');
    });
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    onDeleteTable(id); // Delete locally, do not save to backend yet
  };

  return (
    <>
    <div className='dropzone-container'>
    <div
      className="dropzone-item"
      
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {tables.map((table) => (
        <div
          key={table.id || table.tempId}
          className={`table-item table-${table.size}`}
          style={{
            left: `${table.left}px`,
            top: `${table.top}px`,
            position: 'absolute',
            cursor: 'move',
          }}
          draggable
          onDragStart={(e) => handleDragStart(e, table)}
          onDragEnd={handleDragEnd}
        >
          Table {table.size}
          <button
          
          className='delet-table-button'
            type="button"
            onClick={(e) => handleDelete(e, table.id || table.tempId)}
            style={{ margin: '1px' }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
    </div>
    </>
  );
};

export default TableLayout;
