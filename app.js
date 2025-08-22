let video = document.getElementById("video");
let canvas = document.getElementById("canvas");
let captureBtn = document.getElementById("captureBtn");
let openCameraBtn = document.getElementById("openCameraBtn");
let cameraFrame = document.getElementById("cameraFrame");

// Open Camera
openCameraBtn.addEventListener("click", async () => {
  cameraFrame.classList.remove("hidden");
  let stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;
});

// Capture
captureBtn.addEventListener("click", () => {
  let ctx = canvas.getContext("2d");
  canvas.classList.remove("hidden");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
});

// Placeholder buttons
document.getElementById("galleryBtn").addEventListener("click", () => {
  alert("📂 Gallery - Coming Soon");
});
document.getElementById("mintedBtn").addEventListener("click", () => {
  alert("🪙 Minted Gallery - Coming Soon");
});
document.getElementById("filtersBtn").addEventListener("click", () => {
  alert("🎨 Filters Shop - Coming Soon");
});

// Wallet/Profile (placeholder)
document.getElementById("connectWalletBtn").addEventListener("click", () => {
  alert("🔗 Wallet connection logic here");
});
