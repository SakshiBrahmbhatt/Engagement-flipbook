import * as pdfjsLib from "./lib/pdf.mjs";

/* Load from Node proxy */
const PDF_URL = "/pdf";

/* Worker */
pdfjsLib.GlobalWorkerOptions.workerSrc = "./lib/pdf.worker.mjs";

/* Config */
const BOOK_WIDTH = 820;
const BOOK_HEIGHT = 560;
const SCALE = 1.5;

const flipbook = document.getElementById("flipbook");

pdfjsLib.getDocument(PDF_URL).promise.then(pdf => {
  const totalPages = pdf.numPages;
  const renderTasks = [];

  for (let i = 1; i <= totalPages; i++) {
    renderTasks.push(
      pdf.getPage(i).then(page => {
        const pageDiv = document.createElement("div");
        pageDiv.className = "page";

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const viewport = page.getViewport({ scale: SCALE });
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        pageDiv.appendChild(canvas);
        flipbook.appendChild(pageDiv);

        return page.render({
          canvasContext: ctx,
          viewport
        }).promise;
      })
    );
  }

  Promise.all(renderTasks).then(initFlipbook);
});

function initFlipbook() {
  $("#flipbook").turn({
    width: BOOK_WIDTH,
    height: BOOK_HEIGHT,
    autoCenter: true,
    elevation: 60,
    gradients: true,
    duration: 1200,
    display: "double",
    acceleration: true
  });
}
