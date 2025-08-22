// ============ Wallet Connect + ENS ============
const LENS_TOKEN_ADDRESS = "0xbd78521E5666A28F528F8D78Eba0e6C9680DDb07";
const ERC20_ABI = ["function balanceOf(address owner) view returns (uint256)"];

const connectBtn = document.getElementById("connectBtn");
const walletStatus = document.getElementById("walletStatus");
let provider, signer, userAddress;

async function connectWallet() {
  if (!window.ethereum) {
    alert("Please install MetaMask!");
    return;
  }
  provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = await provider.getSigner();
  userAddress = await signer.getAddress();

  // Try ENS
  let ensName = await provider.lookupAddress(userAddress);
  if (ensName) {
    walletStatus.innerText = `Connected: ${ensName}`;
  } else {
    walletStatus.innerText = `Connected: ${userAddress}`;
  }

  connectBtn.style.display = "none";

  // Fetch balance
  const balance = await checkLensBalance();
  document.getElementById("lensBalance").innerText =
    `Your $LENS Balance: ${balance}`;
}

async function checkLensBalance() {
  if (!signer) return 0;
  const contract = new ethers.Contract(LENS_TOKEN_ADDRESS, ERC20_ABI, provider);
  const balance = await contract.balanceOf(userAddress);
  return Number(ethers.formatUnits(balance, 18));
}

if (connectBtn) {
  connectBtn.addEventListener("click", connectWallet);
}

// ============ Upload & Preview ============
const fileInput = document.getElementById("fileInput");
const preview = document.getElementById("preview");

if (fileInput) {
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
}

// ============ Camera ============
const camera = document.getElementById("camera");
const captureBtn = document.getElementById("captureBtn");

if (camera && captureBtn) {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
      camera.srcObject = stream;
    })
    .catch((err) => console.error("Camera error:", err));

  captureBtn.addEventListener("click", () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = camera.videoWidth;
    canvas.height = camera.videoHeight;
    ctx.drawImage(camera, 0, 0);

    const img = document.createElement("img");
    img.src = canvas.toDataURL("image/png");
    preview.innerHTML = "";
    preview.appendChild(img);
  });
}

// ============ Filters ============
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

// ============ Save ============
const saveBtn = document.getElementById("saveBtn");
if (saveBtn) {
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
}

// ============ Share ============
const shareBtn = document.getElementById("shareBtn");
if (shareBtn) {
  shareBtn.addEventListener("click", () => {
    const img = preview.querySelector("img");
    if (!img) {
      alert("Upload or capture a photo first!");
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
}
