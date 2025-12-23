const bookElement = document.getElementById("book");

const pageFlip = new St.PageFlip(bookElement, {
  width: 400,
  height: 550,
  size: "stretch",
  showCover: true,
  maxShadowOpacity: 0.45,
  mobileScrollSupport: true
});

// Load pages
pageFlip.loadFromHTML(document.querySelectorAll(".page"));

/* Disable drag & swipe – ONLY click works */
pageFlip.getSettings().useMouseEvents = false;
pageFlip.getSettings().useTouchEvents = false;

/* Flip only on bottom corner click */
document.querySelectorAll(".corner").forEach(corner => {
  corner.addEventListener("click", () => {
    pageFlip.flipNext();
  });
});

/* Handle video playback */
pageFlip.on("flip", () => {
  document.querySelectorAll("video").forEach(v => {
    v.pause();
    v.currentTime = 0;
  });

  const index = pageFlip.getCurrentPageIndex();
  const page = pageFlip.getPage(index);

  if (page) {
    const video = page.querySelector("video");
    if (video) {
      video.play().catch(() => {});
    }
  }
});
