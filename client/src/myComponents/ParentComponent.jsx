import React, { useState, useEffect } from 'react';
import RestaurantLeftSidebar from './RestaurantLeftSidebar';
import TableLayout from './TableLayout';
import './ReservationTableDisplayAdmin.css';

const ParentComponent = () => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [idCounter, setIdCounter] = useState(1);
  const [insideLayout, setInsideLayout] = useState(true);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await fetch('/tables');
        if (!response.ok) {
          throw new Error('Failed to fetch tables');
        }
        const tables = await response.json();
        setTables(Array.isArray(tables) ? tables : []);
      } catch (error) {
        console.error(error);
        setTables([]);
      }
    };

    fetchTables();
  }, []);

  const handleTableClick = (tableSize, layoutType) => {
    // Generate a temporary id for new tables
    const newTable = {
      tempId: idCounter, // Use tempId for new tables
      size: tableSize,
      left: 0, // Default position
      top: 0,
      inside: layoutType === 'inside',
      isNew: true // Mark this table as new
    };

    setTables(prevTables => [...prevTables, newTable]); // Ensure new table is added to existing ones
    setSelectedTable(newTable.tempId);

    setIdCounter(prevId => prevId + 1); // Increment ID counter for new tables
  };

  const handleLayoutChange = (layout) => {
    setInsideLayout(layout === 'inside');
  };

  const handleTableMove = (id, newPosition) => {
    setTables(prevTables =>
      prevTables.map(table =>
        (table.id === id || table.tempId === id)
          ? { ...table, ...newPosition }
          : table
      )
    );
  };
  

  const handleDeleteTable = async (id) => {
    try {
      const table = tables.find(t => t.id === id || t.tempId === id);
      if (table && table.id) {
        const response = await fetch(`/tables/delete/${table.id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          setTables(tables.filter(t => t.id !== id));
        } else {
          const responseData = await response.json();
          console.error(responseData.message);
        }
      } else {
        setTables(tables.filter(t => t.tempId !== id));
      }
    } catch (error) {
      console.error('Failed to delete the table:', error);
    }
  };

  const handleSaveTables = async (e) => {
    e.preventDefault();

    try {
      for (const table of tables) {
        if (table.id && !table.isNew) {
          // Update existing table
          const response = await fetch(`/tables/update/${table.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              left: table.left,
              top: table.top
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to update table');
          }
        } else if (table.tempId) {
          // Create new table
          const response = await fetch('/tables/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify([table]),
          });

          if (!response.ok) {
            throw new Error('Failed to create table');
          } else {
            const { tableIds } = await response.json();
            // Update the table with the new ID and remove tempId
            setTables(prevTables =>
              prevTables.map(t => (t.tempId === table.tempId ? { ...t, id: tableIds[0], tempId: null, isNew: false } : t))
            );
          }
        }
      }

      console.log('Tables saved successfully');
    } catch (error) {
      console.error('Failed to save tables:', error);
    }
  };

  return (
    <div className='admin-panel-layout'>
      <form onSubmit={handleSaveTables} className="save-panel-admin">
        <RestaurantLeftSidebar onTableClick={handleTableClick} onLayoutChange={handleLayoutChange} />
        <TableLayout
          selectedTable={selectedTable}
          tables={tables.filter(table => table.inside === insideLayout)}
          onTableMove={handleTableMove}
          onDeleteTable={handleDeleteTable}
        />
        <button className='save-layout-button' type='submit'>Save Tables</button>
      </form>
    </div>
  );
};

export default ParentComponent;
