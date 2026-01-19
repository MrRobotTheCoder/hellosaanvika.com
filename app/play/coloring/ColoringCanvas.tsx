"use client";

import { useEffect, useState, useRef } from "react";
import { COLORS } from "./colors";

type ColoringCanvasProps = {
  svgPath: string;
};

export default function ColoringCanvas({ svgPath }: ColoringCanvasProps) {
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [svgContent, setSvgContent] = useState<string>("");

  // ✅ REF to always hold the latest color
  const colorRef = useRef<string>(COLORS[0]);

  // Keep ref updated when color changes
  useEffect(() => {
    colorRef.current = selectedColor;
  }, [selectedColor]);

  // ----------------------------
  // Load SVG inline (and normalize it)
  // ----------------------------
  useEffect(() => {
    fetch(svgPath)
      .then((res) => res.text())
      .then((svg) => {
        const fixedSvg = svg.replace(
          "<svg",
          `<svg preserveAspectRatio="xMidYMid meet" style="display:block;margin:auto;"`
        );
        setSvgContent(fixedSvg);
      });
  }, [svgPath]);

  // ----------------------------
  // Attach click handlers ONCE
  // ----------------------------
  useEffect(() => {
    if (!svgContent) return;

    const container = document.getElementById("coloring-canvas");
    if (!container) return;

    const svg = container.querySelector("svg");
    if (!svg) return;

    const paths = svg.querySelectorAll("path");

    paths.forEach((path) => {
      path.addEventListener("click", () => {
        (path as SVGPathElement).style.fill = colorRef.current;
      });
    });
  }, [svgContent]);

  // ----------------------------
  // Download image
  // ----------------------------
  const downloadImage = () => {
    const svgElement = document.querySelector(
      "#coloring-canvas svg"
    ) as SVGSVGElement;

    if (!svgElement) return;

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);

    const svgBlob = new Blob([svgString], {
      type: "image/svg+xml;charset=utf-8",
    });

    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 800;
      canvas.height = 800;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      URL.revokeObjectURL(url);

      const pngUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "my-coloring.png";
      link.href = pngUrl;
      link.click();
    };

    img.src = url;
  };

  // ----------------------------
  // UI
  // ----------------------------
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "16px",
        boxSizing: "border-box",
      }}
    >
      {/* SVG */}
      <div
        id="coloring-canvas"
        dangerouslySetInnerHTML={{ __html: svgContent }}
        style={{
          width: "100%",
          maxWidth: "360px",
          margin: "0 auto",
        }}
      />

      {/* Palette */}
      <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
        {COLORS.map((color) => (
          <button
            key={color}
            onClick={() => setSelectedColor(color)}
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              backgroundColor: color,
              border:
                selectedColor === color
                  ? "3px solid #555"
                  : "2px solid #ccc",
            }}
          />
        ))}
      </div>

      {/* Download */}
      <button
        onClick={downloadImage}
        style={{
          marginTop: 20,
          padding: "12px 20px",
          borderRadius: 12,
          backgroundColor: "#f5c4d8",
          border: "none",
          fontSize: 16,
          cursor: "pointer",
        }}
      >
        ⬇️ Download My Art
      </button>
    </div>
  );
}
