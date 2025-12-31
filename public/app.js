import * as pdfjsLib from "./lib/pdf.mjs";

/* LOCAL PDF */
const PDF_URL = "/pdf/engagement.pdf";

/* PDF WORKER */
pdfjsLib.GlobalWorkerOptions.workerSrc = "./lib/pdf.worker.mjs";

/* BOOK SIZE */
const BOOK_WIDTH = Math.min(window.innerWidth * 0.9, 900);
const BOOK_HEIGHT = Math.min(window.innerHeight * 0.8, 600);

const flipbook = document.getElementById("flipbook");

/* LOAD PDF */
pdfjsLib.getDocument(PDF_URL).promise.then(async pdf => {
  const totalPages = pdf.numPages;

  /* ---------- PAGE 1 (SINGLE COVER) ---------- */
  await renderPdfPage(pdf, 1);

  /* Insert BLANK PAGE after cover */
  addBlankPage();

  /* ---------- MIDDLE PAGES (PAIRS) ---------- */
  for (let i = 2; i <= totalPages - 1; i++) {
    await renderPdfPage(pdf, i);
  }

  /* If total pages is EVEN, add blank before last */
  if (totalPages % 2 === 0) {
    addBlankPage();
  }

  /* ---------- LAST PAGE (SINGLE BACK) ---------- */
  await renderPdfPage(pdf, totalPages);

  initFlipbook();
});

/* RENDER PDF PAGE */
async function renderPdfPage(pdf, pageNumber) {
  const page = await pdf.getPage(pageNumber);

  const pageDiv = document.createElement("div");
  pageDiv.className = "page";

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const viewport = page.getViewport({ scale: 1 });

  const scale = Math.min(
    BOOK_WIDTH / viewport.width,
    BOOK_HEIGHT / viewport.height
  );

  const scaledViewport = page.getViewport({ scale });

  canvas.width = scaledViewport.width;
  canvas.height = scaledViewport.height;

  pageDiv.appendChild(canvas);
  flipbook.appendChild(pageDiv);

  await page.render({
    canvasContext: ctx,
    viewport: scaledViewport
  }).promise;
}

/* BLANK PAGE (FOR ALIGNMENT) */
function addBlankPage() {
  const blank = document.createElement("div");
  blank.className = "page";
  blank.style.background = "transparent";
  flipbook.appendChild(blank);
}

/* INIT TURN.JS */
function initFlipbook() {
  $("#flipbook").turn({
    width: BOOK_WIDTH,
    height: BOOK_HEIGHT,
    autoCenter: true,
    display: "double",
    elevation: 60,
    gradients: true,
    duration: 1000,
    acceleration: true
  });
}
