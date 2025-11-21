import React, { useEffect, useState, useRef } from 'react';
import PhotographerNavbar from "../components/photographerNavbar/photographerNavbar";

const PhotographerLayout = ({ children }) => {
  const [sidebarWidth, setSidebarWidth] = useState(300); // default width
  const isResizing = useRef(false);

  const handleMouseDown = () => {
    isResizing.current = true;
    document.body.style.cursor = "col-resize";
  };

  const handleMouseMove = (e) => {
    if (!isResizing.current) return;
    const newWidth = e.clientX;
    if (newWidth > 230 && newWidth < 500) {
      setSidebarWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    isResizing.current = false;
    document.body.style.cursor = "default";
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div className="photographer-layout"
      style={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Sidebar */}
      <div
        className="sidebar"
        style={{
          width: sidebarWidth + "px",
          minWidth: "230px",
          maxWidth: "500px",
        }}
      >
        <PhotographerNavbar />
      </div>

      {/* Divider */}
      <div
          className="divider position-absolute"
          style={{
          cursor: "col-resize",
          paddingInline: '0.5rem',
          left: sidebarWidth + "px",
          transform: 'translate(-50%, 0%)',
          height: '100%',
          zIndex: '100000'
          }}
          onMouseDown={handleMouseDown}
      >
        <div 
          className="divider"
          style={{
          width: 1,
          background: "#ccc",
          height: '100%'
          }}/>
      </div>
      
      {/* Main Content */}
      <div className="main-content" 
        style={{
          flex: 1,
          background: "#f8f8f8ff",
          overflowX: "hidden",  // scroll if content overflows
        }}
      >{children}</div>
    </div>
  );
};

export default PhotographerLayout;