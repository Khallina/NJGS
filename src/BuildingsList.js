import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function BuildingsList() {
  const [searchTerm, setSearchTerm] = useState('');

  const buildings = [
    { id: 14, name: 'Building 14', pdfFile: 'building 014-0_frank.pdf' },
    { id: 180, name: 'Building 180', pdfFile: 'building 180-0_baker.pdf' }
    // Add more buildings as needed
  ];

  const filteredBuildings = buildings.filter(building =>
    building.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>Buildings</h1>
      <input
        type="text"
        placeholder="Search buildings"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      <ul>
        {filteredBuildings.map(building => (
          <li key={building.id}>
            <Link to={`/buildings/${building.id}?pdf=${building.pdfFile}`}>
              {building.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BuildingsList;