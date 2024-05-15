import React, { useEffect, useRef, useState } from 'react';

function PDFDrawer({ pdf, pageNumber, onDrawingChange }) {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const renderPage = async () => {
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 1 });

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      page.render(renderContext);
    };

    renderPage();
  }, [pdf, pageNumber]);

  const startDrawing = () => {
    setIsDrawing(true);
  };

  const endDrawing = () => {
    setIsDrawing(false);
    onDrawingChange(drawing);
  };

  const draw = (event) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (!drawing) {
      setDrawing({ x, y, lines: [] });
    } else {
      const newLines = [...drawing.lines, { x, y }];
      setDrawing({ ...drawing, lines: newLines });
      context.beginPath();
      context.moveTo(drawing.x, drawing.y);
      context.lineTo(x, y);
      context.stroke();
    }
  };

  const clearDrawing = () => {
    setDrawing(null);
    onDrawingChange(null);

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
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