import React, { useRef, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudArrowUp } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function ImageUploadContainer({ textOnContainer = <p className="fw-semibold m-0">Click or drag to upload image</p>, width = '15rem', height = '15rem', onImageChange }) {
  const [preview, setPreview] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [imgSize, setImgSize] = useState({ width: 0, height: 0 });
  const [zoom, setZoom] = useState(1);
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const startPosRef = useRef({ x: 0, y: 0 });
  const imgRef = useRef(null);

  function handleFiles(files) {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
  }

  function onDrop(e) {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length) {
      handleFiles(e.dataTransfer.files);
    }
  }

  function onClickUpload() {
    inputRef.current?.click();
  }

  function onRemove() {
    setPreview(null);
    setPosition({ x: 0, y: 0 });
    if (inputRef.current) inputRef.current.value = null;
    onImageChange?.(null);
  }

  function handleMouseDown(e) {
    if (!preview) return;
    setDragging(true);
    startPosRef.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  }

  function handleMouseMove(e) {
    if (!dragging || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;

    const newX = e.clientX - startPosRef.current.x;
    const newY = e.clientY - startPosRef.current.y;

    // Use zoomed dimensions
    const scaledWidth = imgSize.width * zoom;
    const scaledHeight = imgSize.height * zoom;

    // Compute how far the image can move without leaving the container
    const limitX = Math.max(
      Math.min(newX, (scaledWidth - containerWidth) / 2),
      -(scaledWidth - containerWidth) / 2
    );

    const limitY = Math.max(
      Math.min(newY, (scaledHeight - containerHeight) / 2),
      -(scaledHeight - containerHeight) / 2
    );

    setPosition({ x: limitX, y: limitY });
  }


  function handleMouseUp() {
    if (dragging) {
      setDragging(false);
      generateThumbnail(); // generate new cropped image when done dragging
    }
  }

  function handleWheel(e) {
    e.preventDefault();
    adjustZoom(e.deltaY < 0 ? 0.1 : -0.1);
  }


  function clampPosition(currentZoom = zoom) {
    if (!containerRef.current) return;
    const { width: containerWidth, height: containerHeight } = containerRef.current.getBoundingClientRect();
    const scaledWidth = imgSize.width * currentZoom;
    const scaledHeight = imgSize.height * currentZoom;

    const maxX = Math.max((scaledWidth - containerWidth) / 2, 0);
    const maxY = Math.max((scaledHeight - containerHeight) / 2, 0);

    setPosition((pos) => ({
      x: Math.min(Math.max(pos.x, -maxX), maxX),
      y: Math.min(Math.max(pos.y, -maxY), maxY),
    }));
  }


  function handleImageLoad(e) {
    const { naturalWidth, naturalHeight } = e.target;
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;

    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;
    const scale = Math.max(containerWidth / naturalWidth, containerHeight / naturalHeight);

    setImgSize({
      width: naturalWidth * scale,
      height: naturalHeight * scale,
    });

    // Once loaded, generate initial thumbnail
    setTimeout(() => generateThumbnail(), 200);
  }

  // capture new thumbnail (cropped to container)
  function generateThumbnail() {
    if (!containerRef.current || !imgRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const { width, height } = containerRef.current.getBoundingClientRect();

    canvas.width = width;
    canvas.height = height;

    const img = imgRef.current;
    const scaledWidth = imgSize.width * zoom;
    const scaledHeight = imgSize.height * zoom;

    const drawX = (width / 2) - (scaledWidth / 2) + position.x;
    const drawY = (height / 2) - (scaledHeight / 2) + position.y;

    ctx.drawImage(img, drawX, drawY, scaledWidth, scaledHeight);

    canvas.toBlob((blob) => {
      if (blob) onImageChange?.(blob);
    }, 'image/jpeg', 0.9);
  }

  function adjustZoom(delta) {
    if (!preview || !containerRef.current) return;

    const { width: containerWidth, height: containerHeight } =
      containerRef.current.getBoundingClientRect();

    const newZoom = Math.min(Math.max(zoom + delta, 1), 3); // clamp between 1x–3x
    const scaledWidth = imgSize.width * newZoom;
    const scaledHeight = imgSize.height * newZoom;
    const maxX = Math.max((scaledWidth - containerWidth) / 2, 0);
    const maxY = Math.max((scaledHeight - containerHeight) / 2, 0);

    // 1️⃣ Determine how many edges are touching
    let edgesTouching = 0;
    const { x, y } = position;

    if (Math.abs(x - (-maxX)) < 1 || Math.abs(x - maxX) < 1) edgesTouching += 1; // left or right
    if (Math.abs(y - (-maxY)) < 1 || Math.abs(y - maxY) < 1) edgesTouching += 1; // top or bottom

    // 2️⃣ If zooming in and 3+ edges are touching, block it
    if (delta > 0 && edgesTouching >= 3) return;

    // 3️⃣ Anchor zoom toward the nearest edge(s)
    // This makes zoom feel more natural — e.g., if photo is dragged down, zoom keeps the bottom anchored.
    const anchorX = x / maxX || 0;
    const anchorY = y / maxY || 0;

    const prevScaledWidth = imgSize.width * zoom;
    const prevScaledHeight = imgSize.height * zoom;

    const dx = ((scaledWidth - prevScaledWidth) / 2) * anchorX;
    const dy = ((scaledHeight - prevScaledHeight) / 2) * anchorY;

    // Update zoom and position together
    setZoom(newZoom);
    setPosition((prev) => ({
      x: Math.min(Math.max(prev.x - dx, -maxX), maxX),
      y: Math.min(Math.max(prev.y - dy, -maxY), maxY),
    }));

    setTimeout(() => {
      clampPosition(newZoom);
      generateThumbnail();
    }, 100);
  }


  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheelEvent = (e) => handleWheel(e);

    // Add wheel listener with passive: false so preventDefault works
    container.addEventListener('wheel', handleWheelEvent, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheelEvent);
    };
  }, [handleWheel]);


  return (
    <div className="d-flex justify-content-center align-items-center">
      <div
        ref={containerRef}
        className="position-relative border border-secondary border-1 border-dashed rounded-4 overflow-hidden bg-light d-flex justify-content-center align-items-center text-secondary"
        style={{ width: width, height: height, cursor: preview ? 'grab' : 'pointer' }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        onClick={!preview ? onClickUpload : undefined}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClickUpload(); }}
        aria-label="Upload image"
      >
        {preview ? (
          <>
            <img
              ref={imgRef}
              src={preview}
              alt="Uploaded preview"
              onLoad={handleImageLoad}
              className="position-absolute"
              style={{
                top: '50%',
                left: '50%',
                transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
                width: `${imgSize.width * zoom}px`,
                height: `${imgSize.height * zoom}px`,
                objectFit: 'cover',
                userSelect: 'none',
                pointerEvents: 'none',
              }}
              draggable="false"
            />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onRemove(); }}
              className="btn btn-sm btn-light position-absolute top-0 end-0 m-2 shadow-sm border text-muted"
              aria-label="Remove image"
            >
              ✕
            </button>
            <div className="position-absolute bottom-0 end-0 p-2 d-flex justify-content-center mt-2 gap-2">
              <button onClick={() => adjustZoom(0.1)} className="btn btn-sm btn-light border">+</button>
              <button onClick={() => adjustZoom(-0.1)} className="btn btn-sm btn-light border">−</button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <FontAwesomeIcon icon={faCloudArrowUp} size="2x" className="mb-2" />
            {textOnContainer}
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="d-none"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
    </div>
  );
}
