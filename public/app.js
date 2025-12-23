const bookEl = document.getElementById("book");
const music = document.getElementById("bgMusic");

const pageFlip = new St.PageFlip(bookEl, {
  width: 400,
  height: 550,
  size: "stretch",
  maxShadowOpacity: 0.5,
  showCover: true,
  mobileScrollSupport: false
});

pageFlip.loadFromHTML(document.querySelectorAll(".page"));

// Play music on first interaction
let musicStarted = false;

pageFlip.on("flip", () => {
  // Start background music
  if (!musicStarted) {
    music.play().catch(() => {});
    musicStarted = true;
  }

  // Stop all videos
  document.querySelectorAll("video").forEach(v => {
    v.pause();
    v.currentTime = 0;
  });

  // Play video on active page
  const pageIndex = pageFlip.getCurrentPageIndex();
  const currentPage = pageFlip.getPage(pageIndex);

  if (currentPage) {
    const video = currentPage.querySelector("video");
    if (video) video.play();
  }
});
