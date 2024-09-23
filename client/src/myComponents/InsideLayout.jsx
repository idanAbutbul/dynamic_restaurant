import React, { useState } from 'react';
import '../App.css';

const InsideLayout = ({ tables, onTableMove, onDeleteTable }) => {
  const [draggedTable, setDraggedTable] = useState(null);

  const handleDragStart = (e, id) => {
    setDraggedTable(id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (draggedTable !== null) {
      const rect = e.currentTarget.getBoundingClientRect();
      const newX = e.clientX - rect.left;
      const newY = e.clientY - rect.top;
      onTableMove(draggedTable, { left: newX, top: newY });
      setDraggedTable(null);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      const response = await fetch(`/tables/delete/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        onDeleteTable(id);
      } else {
        alert('Failed to delete the table.');
      }
    } catch (error) {
      console.error('Error deleting table:', error);
      alert('Failed to delete the table.');
    }
  };

  return (
    <div className="dropzone" style={{ position: 'relative', width: '100%', height: '500px', border: '1px solid #ccc', marginTop: '20px' }} onDragOver={handleDragOver} onDrop={handleDrop}>
      {tables.map(table => (
        <div
          key={table.id}
          className={`table table-${table.size}`}
          style={{ left: table.left, top: table.top, position: 'absolute' }}
          draggable
          onDragStart={(e) => handleDragStart(e, table.id)}
        >
          Table {table.size}
          <button type="button" onClick={(e) => handleDelete(e, table.id)} style={{ margin: '5px' }}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default InsideLayout;
