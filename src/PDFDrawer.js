import React, { useEffect, useRef, useState } from 'react';
import './PDFDrawer.css';

function PDFDrawer({ pdf, pageNumber, onDrawingChange }) {
  const pdfCanvasRef = useRef(null);
  const drawingCanvasRef = useRef(null);
  const [drawing, setDrawing] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penSize, setPenSize] = useState(2);
  const [penColor, setPenColor] = useState('black');
  const [isErasing, setIsErasing] = useState(false);

  useEffect(() => {
    const renderPage = async () => {
      const pdfCanvas = pdfCanvasRef.current;
      const pdfContext = pdfCanvas.getContext('2d');
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 1 });

      pdfCanvas.width = viewport.width;
      pdfCanvas.height = viewport.height;

      const renderContext = {
        canvasContext: pdfContext,
        viewport: viewport,
      };

      await page.render(renderContext);

      const drawingCanvas = drawingCanvasRef.current;
      drawingCanvas.width = viewport.width;
      drawingCanvas.height = viewport.height;
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

    const drawingCanvas = drawingCanvasRef.current;
    const context = drawingCanvas.getContext('2d');
    const { offsetX, offsetY } = event.nativeEvent;

    const newPoint = { x: offsetX, y: offsetY };
    setDrawing((prevDrawing) => [...prevDrawing, newPoint]);

    context.globalCompositeOperation = isErasing ? 'destination-out' : 'source-over';
    context.strokeStyle = penColor;
    context.lineWidth = penSize;
    context.lineJoin = 'round';
    context.lineCap = 'round';

    context.beginPath();
    context.moveTo(drawing[drawing.length - 1].x, drawing[drawing.length - 1].y);
    context.lineTo(newPoint.x, newPoint.y);
    context.stroke();
    context.closePath();
  };

  const clearDrawing = () => {
    const drawingCanvas = drawingCanvasRef.current;
    const context = drawingCanvas.getContext('2d');
    context.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
    setDrawing([]);
    onDrawingChange(null);
  };

  // Helper functions to set drawing mode
  const setPenMode = () => setIsErasing(false);
  const setEraserMode = () => setIsErasing(true);

  // Event handlers for pen settings
  const changePenSize = (event) => {
    const size = event.target.value;
    setPenSize(parseInt(size));
  };

  const changePenColor = (color) => {
    setPenColor(color);
  };

  return (
    <div className="pdf-drawer-container">
      <div id="pdf-container" className="pdf-canvas-container">
        <canvas ref={pdfCanvasRef} />
        <canvas
          ref={drawingCanvasRef}
          className="drawing-canvas"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
        />
      </div>
      <div id="drawing-menu" className="drawing-menu">
        <button onClick={setPenMode} className={!isErasing ? 'selected' : ''}>Pen</button>
        <button onClick={setEraserMode} className={isErasing ? 'selected' : ''}>Eraser</button>
        <button onClick={clearDrawing}>Clear Drawing</button>
        <div>
          <label>Pen Size: </label>
          <select id="pen-size" onChange={changePenSize} value={penSize}>
            <option value="2">Small</option>
            <option value="4">Medium</option>
            <option value="6">Large</option>
          </select>
        </div>
        <div>
          <label>Pen Color: </label>
          <button onClick={() => changePenColor('black')} className={penColor === 'black' ? 'selected' : ''} style={{ backgroundColor: 'black', color: 'white' }}>Black</button>
          <button onClick={() => changePenColor('red')} className={penColor === 'red' ? 'selected' : ''} style={{ backgroundColor: 'red' }}>Red</button>
          <button onClick={() => changePenColor('blue')} className={penColor === 'blue' ? 'selected' : ''} style={{ backgroundColor: 'blue', color: 'white' }}>Blue</button>
          <button onClick={() => changePenColor('yellow')} className={penColor === 'yellow' ? 'selected' : ''} style={{ backgroundColor: 'yellow' }}>Yellow</button>
        </div>
      </div>
    </div>
  );
}

export default PDFDrawer;
