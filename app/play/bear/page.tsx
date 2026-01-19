import ColoringCanvas from "../coloring/ColoringCanvas";

export default function BearColoringPage() {
  return (
    <main style={{ padding: 16 }}>
      <h1 style={{ textAlign: "center" }}>Color the Bear 🐻</h1>

      <ColoringCanvas svgPath="/assets/coloring/bear-outline.svg" />
    </main>
  );
}