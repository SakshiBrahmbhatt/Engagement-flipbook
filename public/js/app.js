const pdfUrl = "/pdf/engagement.pdf";
const bookElement = document.getElementById("book");

const pageFlip = new St.PageFlip(bookElement, {
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

// Load PDF and convert to images
async function loadPDF() {
  const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
  const pages = [];

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
    pages.push(img);
  }

  pageFlip.loadFromImages(pages);
}

loadPDF();

// Orientation handling
function checkOrientation() {
  const overlay = document.getElementById("rotate-overlay");
  const bookWrapper = document.getElementById("book-wrapper");

  const isMobile = window.innerWidth <= 768;
  const isPortrait = window.innerHeight > window.innerWidth;

  if (isMobile && isPortrait) {
    overlay.style.display = "flex";
    bookWrapper.style.display = "none";
    document.body.style.overflow = "hidden";
  } else {
    overlay.style.display = "none";
    bookWrapper.style.display = "flex";
    document.body.style.overflow = "hidden";
  }
}

window.addEventListener("load", checkOrientation);
window.addEventListener("resize", checkOrientation);
window.addEventListener("orientationchange", checkOrientation);
