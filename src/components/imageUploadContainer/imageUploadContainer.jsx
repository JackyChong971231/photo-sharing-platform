import React, { useRef, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudArrowUp } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function ImageUploadContainer({ size = '15rem', onThumbnailChange }) {
  const [preview, setPreview] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [imgSize, setImgSize] = useState({ width: 0, height: 0 });
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
    onThumbnailChange?.(null);
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

    const halfImgW = imgSize.width / 2;
    const halfImgH = imgSize.height / 2;
    const limitX = Math.max(
      Math.min(newX, halfImgW - containerWidth / 2),
      -halfImgW + containerWidth / 2
    );
    const limitY = Math.max(
      Math.min(newY, halfImgH - containerHeight / 2),
      -halfImgH + containerHeight / 2
    );

    setPosition({ x: limitX, y: limitY });
  }

  function handleMouseUp() {
    if (dragging) {
      setDragging(false);
      generateThumbnail(); // generate new cropped image when done dragging
    }
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
    const containerRect = containerRef.current.getBoundingClientRect();

    const width = containerRect.width;
    const height = containerRect.height;
    canvas.width = width;
    canvas.height = height;

    const img = imgRef.current;

    const drawX = (width / 2) - (imgSize.width / 2) + position.x;
    const drawY = (height / 2) - (imgSize.height / 2) + position.y;

    ctx.drawImage(img, drawX, drawY, imgSize.width, imgSize.height);

    canvas.toBlob((blob) => {
      if (blob) onThumbnailChange?.(blob);
    }, 'image/jpeg', 0.9);
  }

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  });

  return (
    <div className="d-flex justify-content-center align-items-center">
      <div
        ref={containerRef}
        className="position-relative border border-secondary border-1 border-dashed rounded-4 overflow-hidden bg-light d-flex justify-content-center align-items-center text-secondary"
        style={{ width: size, height: size, cursor: preview ? 'grab' : 'pointer' }}
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
                width: `${imgSize.width}px`,
                height: `${imgSize.height}px`,
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
          </>
        ) : (
          <div className="text-center">
            <FontAwesomeIcon icon={faCloudArrowUp} size="2x" className="mb-2" />
            <div className="fw-semibold">Click or drag to upload thumbnail</div>
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
