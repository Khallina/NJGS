import React, { useEffect, useRef, useState } from 'react';

function PDFDrawer({ pdf, pageNumber, onDrawingChange }) {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const renderPage = async () => {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 1 });

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext);
    };

    renderPage();
  }, [pdf, pageNumber]);

  const startDrawing = (event) => {
    const { offsetX, offsetY } = event.nativeEvent;
    setIsDrawing(true);
    setDrawing([{ x: offsetX, y: offsetY }]);
  };

  const endDrawing = () => {
    setIsDrawing(false);
    onDrawingChange(drawing);
  };

  const draw = (event) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const { offsetX, offsetY } = event.nativeEvent;

    const newPoint = { x: offsetX, y: offsetY };
    setDrawing((prevDrawing) => [...prevDrawing, newPoint]);

    context.lineJoin = 'round';
    context.lineCap = 'round';
    context.strokeStyle = 'black';
    context.lineWidth = 2;

    context.beginPath();
    context.moveTo(drawing[drawing.length - 1].x, drawing[drawing.length - 1].y);
    context.lineTo(newPoint.x, newPoint.y);
    context.stroke();
    context.closePath();
  };

  const clearDrawing = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Clear the drawing
    context.clearRect(0, 0, canvas.width, canvas.height);
    setDrawing([]);
    onDrawingChange(null);

    // Redraw the PDF
    const renderPage = async () => {
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 1 });

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext);
    };

    renderPage();
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onMouseLeave={endDrawing}
      />
      <button onClick={clearDrawing}>Clear Drawing</button>
    </div>
  );
}

export default PDFDrawer;
