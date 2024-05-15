import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function BuildingsList() {
  const [searchTerm, setSearchTerm] = useState('');

  const buildings = [
    { id: 14, name: 'Building 14: Frank E. Pilling', pdfFile: 'building 014-0_frank.pdf' },
    { id: 180, name: 'Building 180: Baker Science', pdfFile: 'building 180-0_baker.pdf' },
    { id: 38, name: 'Building 38: Math and Science', pdfFile: 'building 38-0_math.pdf' },
    { id: 192, name: 'Building 192: Engineering IV', pdfFile: 'building 192-0_engineering iv.pdf'},
    { id: 197, name: 'Building 197: Bonderson', pdfFile: 'building 197-0_bonderson.pdf' },
    { id: 186, name: 'Building 186: Construction Innovation Center', pdfFile: 'building 186-0_construction innovations center.pdf' },
    { id: 10, name: 'Building 10: Alan A. Erhart Agriculture', pdfFile: 'building 010-0_alan a.erhart agriculture.pdf' },
    { id: 2, name: 'Building 2: Cotchett Education', pdfFile: 'building 002-0_cotchett education.pdf' },
    { id: 6, name: 'Building 6: Christopher Cohan Performing Arts Center (PAC)', pdfFile: 'building 006-0_christopher cohan center.pdf' },
    { id: 53, name: 'Building 53: Science North', pdfFile: 'building 053-0_science north.pdf' },
    { id: 26, name: 'Building 26: Graphic Arts', pdfFile: 'building 026-0_graphic arts.pdf' },
    { id: 33, name: 'Building 33: Clyde P. Fisher Science', pdfFile: 'building 033-0_clyde p. fisher science.pdf' },
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