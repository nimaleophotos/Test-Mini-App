// ============ PART 0: Wallet Connect ============
const LENS_TOKEN_ADDRESS = "0xbd78521E5666A28F528F8D78Eba0e6C9680DDb07";
const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)"
];

const connectBtn = document.getElementById("connectBtn");
const walletStatus = document.getElementById("walletStatus");

let provider, signer, userAddress;

connectBtn.addEventListener("click", async () => {
  try {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }

    provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = await provider.getSigner();
    userAddress = await signer.getAddress();
    walletStatus.innerText = `Connected: ${userAddress}`;

    const balance = await checkLensBalance();
    document.getElementById("lensBalance").innerText =
      `Your $LENS Balance: ${balance}`;
  } catch (err) {
    console.error("Wallet connect error:", err);
  }
});

async function checkLensBalance() {
  if (!signer) return 0;
  const contract = new ethers.Contract(LENS_TOKEN_ADDRESS, ERC20_ABI, provider);
  const balance = await contract.balanceOf(userAddress);
  return Number(ethers.formatUnits(balance, 18));
}

// ============ PART 1: Random photo ============
const btn = document.getElementById("magicBtn");
const gallery = document.getElementById("gallery");

btn.addEventListener("click", () => {
  const img = document.createElement("img");
  img.src = "https://picsum.photos/300?random=" + Date.now();
  gallery.appendChild(img);
});

// ============ PART 2: Upload photo ============
const fileInput = document.getElementById("fileInput");
const preview = document.getElementById("preview");

fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      preview.innerHTML = "";
      const img = document.createElement("img");
      img.src = e.target.result;
      preview.appendChild(img);
    };
    reader.readAsDataURL(file);
  }
});

// ============ PART 3: Apply filters ============
async function applyFilter(filter) {
  const img = preview.querySelector("img");
  if (!img) return;

  if (filter === "contrast(200%)") {
    const balance = await checkLensBalance();
    if (balance < 1) {
      alert("You need at least 1 $LENS to use this filter!");
      return;
    }
  }

  img.style.filter = filter;
}

// ============ PART 4: Save photo ============
const saveBtn = document.getElementById("saveBtn");
saveBtn.addEventListener("click", () => {
  const img = preview.querySelector("img");
  if (!img) return;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  ctx.filter = img.style.filter || "none";
  ctx.drawImage(img, 0, 0);

  const link = document.createElement("a");
  link.download = "edited-photo.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});

// ============ PART 5: Share to Farcaster ============
const shareBtn = document.getElementById("shareBtn");
shareBtn.addEventListener("click", () => {
  const img = preview.querySelector("img");
  if (!img) {
    alert("Upload and edit a photo first!");
    return;
  }

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  ctx.filter = img.style.filter || "none";
  ctx.drawImage(img, 0, 0);

  const dataUrl = canvas.toDataURL("image/png");
  const text = encodeURIComponent("Check out my photo with $LENS filter 🎨");

  window.open(`https://warpcast.com/~/compose?text=${text}`, "_blank");
});

// ============ PART 6: Camera ============
const videoEl = document.getElementById("camera");
const startBtn = document.getElementById("startCameraBtn");
const flipBtn  = document.getElementById("flipCameraBtn");
const captureBtn = document.getElementById("captureBtn");
const filterSelect = document.getElementById("cameraFilter");
const captureCanvas = document.getElementById("captureCanvas");

let currentStream = null;
let useFacingMode = "environment"; // default to back camera on mobile

async function canUseFilter(value) {
  if (value !== "contrast(200%)") return true;
  const bal = await checkLensBalance();
  if (bal >= 1) return true;
  alert("Need at least 1 $LENS to use High Contrast.");
  return false;
}

function applyVideoFilter(value) {
  videoEl.style.filter = value || "none";
}

async function startCamera() {
  try {
    if (currentStream) currentStream.getTracks().forEach(t => t.stop());

    const constraints = {
      audio: false,
      video: { facingMode: useFacingMode }
    };

    currentStream = await navigator.mediaDevices.getUserMedia(constraints);
    videoEl.srcObject = currentStream;

    startBtn.disabled = true;
    flipBtn.disabled = false;
    captureBtn.disabled = false;
  } catch (err) {
    console.error("Camera error:", err);
    alert("Could not access camera. Check permissions and HTTPS.");
  }
}

function flipCamera() {
  useFacingMode = (useFacingMode === "user") ? "environment" : "user";
  startCamera();
}

async function onFilterChange() {
  const value = filterSelect.value;
  if (await canUseFilter(value)) {
    applyVideoFilter(value);
  } else {
    filterSelect.value = "none";
    applyVideoFilter("none");
  }
}

function capturePhoto() {
  if (!videoEl.videoWidth) return;
  captureCanvas.width = videoEl.videoWidth;
  captureCanvas.height = videoEl.videoHeight;

  const ctx = captureCanvas.getContext("2d");
  ctx.filter = getComputedStyle(videoEl).filter || "none";
  ctx.drawImage(videoEl, 0, 0, captureCanvas.width, captureCanvas.height);

  const dataUrl = captureCanvas.toDataURL("image/png");
  const img = document.createElement("img");
  img.src = dataUrl;

  preview.innerHTML = "";
  preview.appendChild(img.cloneNode());
  gallery.prepend(img);
}

if (startBtn) startBtn.addEventListener("click", startCamera);
if (flipBtn) flipBtn.addEventListener("click", flipCamera);
if (captureBtn) captureBtn.addEventListener("click", capturePhoto);
if (filterSelect) filterSelect.addEventListener("change", onFilterChange);
