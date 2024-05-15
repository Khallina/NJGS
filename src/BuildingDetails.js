import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import PDFDrawer from './PDFDrawer';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function BuildingDetails({ userId }) {
  const { buildingId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const pdfFile = searchParams.get('pdf');

  const [buildingDetails, setBuildingDetails] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [drawings, setDrawings] = useState({});
  const [pdfDocument, setPdfDocument] = useState(null);

  useEffect(() => {
    // Fetch building details based on the buildingId
    const building = {
      id: buildingId,
      name: `Building ${buildingId}`,
      pdfUrl: `/pdfs/${pdfFile}`,
    };
    setBuildingDetails(building);

    // Load the PDF document
    pdfjs.getDocument(building.pdfUrl).promise.then((pdf) => {
      setPdfDocument(pdf);
      setNumPages(pdf.numPages);
    });
  }, [buildingId, pdfFile]);

  useEffect(() => {
    // Fetch drawings for the current user and building from the server
    fetchDrawings();
  }, [userId, buildingId]);

  const fetchDrawings = async () => {
    try {
      const response = await fetch(`/api/drawings?userId=${userId}&buildingId=${buildingId}`);
      const data = await response.json();
      setDrawings(data);
    } catch (error) {
      console.error('Error fetching drawings:', error);
    }
  };

  const saveDrawing = async (pageNumber, drawing) => {
    try {
      await fetch('/api/drawings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          buildingId,
          pageNumber,
          drawing,
        }),
      });
    } catch (error) {
      console.error('Error saving drawing:', error);
    }
  };

  const handleDrawingChange = (pageNumber, drawing) => {
    setDrawings((prevDrawings) => ({
      ...prevDrawings,
      [pageNumber]: drawing,
    }));
    saveDrawing(pageNumber, drawing);
  };

  const goToPreviousPage = () => {
    setPageNumber((prevPageNumber) => Math.max(prevPageNumber - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber((prevPageNumber) => Math.min(prevPageNumber + 1, numPages));
  };

  return (
    <div>
      <h1>Building Details</h1>
      {buildingDetails && (
        <>
          <h2>{buildingDetails.name}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
              <button
                disabled={pageNumber <= 1}
                onClick={goToPreviousPage}
                style={{ marginRight: '0.5rem' }}
              >
                Previous Page
              </button>
              <button disabled={pageNumber >= numPages} onClick={goToNextPage}>
                Next Page
              </button>
            </div>
            <p style={{ marginBottom: '1rem' }}>
              Page {pageNumber} of {numPages}
            </p>
            <div>
              {pdfDocument && (
                <PDFDrawer
                  pdf={pdfDocument}
                  pageNumber={pageNumber}
                  onDrawingChange={(drawing) => handleDrawingChange(pageNumber, drawing)}
                />
              )}
            </div>
          </div>
        </>
      )}
      <button onClick={() => navigate('/buildings')} style={{ marginTop: '1rem' }}>
        Back to Building List
      </button>
    </div>
  );
}

export default BuildingDetails;