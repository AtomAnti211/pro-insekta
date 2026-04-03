import "./Lightbox.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function generatePDF() {
  const img = document.getElementById("printable-image") as HTMLImageElement;
  if (!img) return;

  html2canvas(img, {
    scale: 2,
    useCORS: true,
  }).then((canvas) => {
    const imgData = canvas.toDataURL("image/jpeg", 1.0);

    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? "landscape" : "portrait",
      unit: "px",
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, "JPEG", 0, 0, canvas.width, canvas.height);
    pdf.save("munkalap.pdf");
  });
}


export default function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <img
        id="printable-image"
        src={src}
        crossOrigin="anonymous"
        alt="Zoomed"
        className="lightbox-image"
        onClick={(e) => e.stopPropagation()}
      />

      <button className="lightbox-print-btn" onClick={generatePDF}>
        PDF letöltése
      </button>

    </div>
  );
}
