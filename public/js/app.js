// Ensure libraries exist
if (typeof pdfjsLib === "undefined") {
  console.error("pdf.js not loaded");
}
if (typeof St === "undefined") {
  console.error("page-flip not loaded");
}

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.2.67/pdf.worker.min.js";

const pdfUrl = "/pdf/engagement.pdf";
const bookWrapper = document.getElementById("book-wrapper");
const overlay = document.getElementById("rotate-overlay");
const book = document.getElementById("book");

// Create flipbook
const pageFlip = new St.PageFlip(book, {
  width: 550,
  height: 700,
  size: "stretch",
  minWidth: 320,
  maxWidth: 1000,
  minHeight: 400,
  maxHeight: 1500,
  maxShadowOpacity: 0.5,
  showCover: true,
  mobileScrollSupport: false
});

// Load PDF → Images
async function loadPDF() {
  const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
  const images = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 2 });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({ canvasContext: ctx, viewport }).promise;

    const img = document.createElement("img");
    img.src = canvas.toDataURL("image/jpeg", 1.0);
    images.push(img);
  }

  pageFlip.loadFromImages(images);
}

loadPDF();

// Orientation logic
function checkOrientation() {
  const isMobile = window.innerWidth <= 768;
  const isPortrait = window.innerHeight > window.innerWidth;

  if (isMobile && isPortrait) {
    overlay.style.display = "flex";
    bookWrapper.style.display = "none";
  } else {
    overlay.style.display = "none";
    bookWrapper.style.display = "flex";
  }
}

window.addEventListener("load", checkOrientation);
window.addEventListener("resize", checkOrientation);
window.addEventListener("orientationchange", checkOrientation);
