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
    if (window.ethereum) {
      provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      signer = await provider.getSigner();
      userAddress = await signer.getAddress();
      walletStatus.innerText = `Connected: ${userAddress}`;
    } else {
      alert("Please install MetaMask!");
    }
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

connectBtn.addEventListener("click", async () => {
  if (window.ethereum) {
    provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = await provider.getSigner();
    userAddress = await signer.getAddress();
    walletStatus.innerText = `Connected: ${userAddress}`;

    // fetch balance after connect
    const balance = await checkLensBalance();
    document.getElementById("lensBalance").innerText =
      `Your $LENS Balance: ${balance}`;
  } else {
    alert("Please install MetaMask!");
  }
});


// ============ PART 1: Random photo ============
const btn = document.getElementById("magicBtn");
const gallery = document.getElementById("gallery");

btn.addEventListener("click", () => {
  const img = document.createElement("img");
  img.src = "https://picsum.photos/300";
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
