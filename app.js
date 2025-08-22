import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.esm.min.js";

let provider;
let signer;
let profileCircle = document.getElementById("profileCircle");
let connectWalletBtn = document.getElementById("connectWalletBtn");

// Connect wallet
connectWalletBtn.addEventListener("click", async () => {
  if (window.ethereum) {
    try {
      provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      signer = provider.getSigner();
      const address = await signer.getAddress();

      // Try ENS
      let ensName = await provider.lookupAddress(address);
      let displayName = ensName ? ensName : `${address.slice(0, 6)}...${address.slice(-4)}`;

      // Update UI
      connectWalletBtn.style.display = "none"; // hide button
      profileCircle.title = displayName; // hover tooltip

      // If ENS has an avatar
      if (ensName) {
        let avatar = await provider.getAvatar(ensName);
        if (avatar) {
          profileCircle.style.backgroundImage = `url(${avatar})`;
        } else {
          profileCircle.style.background = "#6a5acd"; // fallback color
        }
      } else {
        profileCircle.style.background = "#6a5acd";
      }

      // Show ENS/address below profile circle
      let info = document.createElement("p");
      info.textContent = displayName;
      info.style.fontSize = "14px";
      info.style.color = "#aaa";
      document.querySelector(".right").appendChild(info);

    } catch (err) {
      console.error("Wallet connection error:", err);
      alert("❌ Could not connect wallet. Check MetaMask.");
    }
  } else {
    alert("Please install MetaMask to connect your wallet.");
  }
});
