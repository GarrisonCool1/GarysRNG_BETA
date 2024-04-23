const rollButton = document.getElementById("rollButton");
const nextButton = document.getElementById("nextButton");
const collection = document.getElementById("collection");
const indexdisplay = document.getElementById("index");
const items = document.getElementById("items");

const rarities = [
  { name: "Common", probability: 0.5, color: "gray" },
  { name: "Uncommon", probability: 0.25, color: "green" },
  { name: "Rare", probability: 0.125, color: "blue" },
  { name: "Epic", probability: 0.0625, color: "red" },
  { name: "Legendary", probability: 0.03125, color: "gold" },
  { name: "Mythical", probability: 0.015625, color: "orange" },
  { name: "Divine", probability: 0.0078125, color: "lightblue" },
  { name: "Celestial", probability: 0.00390625, color: "white" },
  { name: "Jackpot", probability: 0.001953125, color: "lawngreen" },
  { name: "True Luck", probability: 0.0009765625, color: "darkcyan" },
  { name: "Shining", probability: 0.0009765625, color: "pink" }
];

let indexdata; // Declare indexdata variable

// Function to initialize indexdata from localStorage or default values
function initializeIndexData() {
  const storedIndexData = localStorage.getItem('indexdata');
  if (storedIndexData) {
    indexdata = JSON.parse(storedIndexData);
  } else {
    // If no data in localStorage, initialize indexdata with default values
    indexdata = rarities.map(rarity => ({ type: rarity.name, amount: 0 }));
  }
}

// Call the function to initialize indexdata when the page loads
initializeIndexData();

// Function to save indexdata to localStorage
function saveIndexData() {
  localStorage.setItem('indexdata', JSON.stringify(indexdata));
}

// Call the function to save indexdata whenever it's updated
function updateIndexData() {
  saveIndexData();
  drawIndexData(); // Update the displayed index data
}

// Update indexdata whenever it's changed
// For example, in rollRarities function:
// const indexToUpdate = rarities.findIndex(rarity => rarity.name === finalRarity.name);
// if (indexToUpdate !== -1) {
//   indexdata[indexToUpdate].amount++;
//   updateIndexData(); // Call updateIndexData to save and display updated indexdata
// }

// Function to clear indexdata from localStorage
function clearIndexData() {
  localStorage.removeItem('indexdata');
}

function drawIndexData() {
  const indexDataList = document.getElementById("indexDataList");
  indexDataList.innerHTML = indexdata.map(item => `<li>${item.type}: ${item.amount}</li>`).join("");
}

drawIndexData();

function generateRandomRarity() {
  let cumulativeProbability = 0;
  const randomNumber = Math.random();
  let selectedRarity;
  for (const rarity of rarities) {
    cumulativeProbability += rarity.probability;
    if (randomNumber <= cumulativeProbability) {
      selectedRarity = rarity;
      break;
    }
  }
  return selectedRarity || rarities[rarities.length - 1];
}

function displayRarity(rarity) {
  // Remove existing rarity div if present
  const existingRarityDiv = document.querySelector(".rarity-div");
  if (existingRarityDiv) {
    existingRarityDiv.remove();
  }

  const rarityDiv = document.createElement("div");
  rarityDiv.textContent = rarity.name;
  rarityDiv.className = `rarity-div ${rarity.name.toLowerCase().replace(/\s+/g, '')}`;
  rarityDiv.style = `
    background: ${rarity.color};
    position: fixed;
    top: 300%;
    left: 50%;
    transform: translate(-50%, -50%);
  `;
  document.body.appendChild(rarityDiv);
  return rarityDiv;
}


const overlay = document.createElement("div");
overlay.className = "overlay";
document.body.appendChild(overlay);
overlay.classList.add("fade-out");

function fadeOutOverlay() { overlay.classList.add("fade-out"); }
function fadeInOverlay() { overlay.classList.remove("fade-out"); }

async function rollRarities() {
  let animateTime = 10;
  const multiplier = 30;
  const totalProbability = rarities.reduce((acc, rarity) => acc + rarity.probability, 0);
  let finalRarity;
  let multiplierCount = 0;

  while (multiplierCount < 10) {
    let accel = 4;
    const randomNumber = Math.random() * totalProbability;
    let cumulativeProbability = 0;
    let selectedRarity;

    for (const rarity of rarities) {
      cumulativeProbability += rarity.probability;
      if (randomNumber <= cumulativeProbability) {
        selectedRarity = rarity;
        break;
      }
    }

    const rarityDiv = displayRarity(selectedRarity);

    function moveRarity() {
      rarityDiv.style.top = `${parseFloat(rarityDiv.style.top) + accel}px`;
      accel /= 1.5;
      requestAnimationFrame(moveRarity);
    };

    animateTime += multiplier;
    multiplierCount++;

    moveRarity();

    await new Promise(resolve => setTimeout(resolve, animateTime));

    finalRarity = selectedRarity;
  }

  const indexToUpdate = rarities.findIndex(rarity => rarity.name === finalRarity.name);
  if (indexToUpdate !== -1) {
    indexdata[indexToUpdate].amount++;
    updateIndexData(); // Call updateIndexData to save and display updated indexdata
  }

  return finalRarity;
}

document.addEventListener('keydown', event => {
  if (event.code === 'Space') {
    if (!rollButton.disabled) clicked();
    if (!nextButton.disabled) nextclicked();
  }
});

rollButton.addEventListener('click', () => {
  if (!rollButton.disabled) clicked();
});

nextButton.addEventListener('click', () => {
  if (!nextButton.disabled) nextclicked();
});

collection.addEventListener('click', opencollection);

function opencollection() {
  const indexDataContainer = document.getElementById("indexDataContainer");
  indexDataContainer.style.display = "block";
  fadeInOverlay();
  rollButton.disabled = true;
  collection.disabled = true;
  items.disabled = true;
}

function closeCollection() {
  const indexDataContainer = document.getElementById("indexDataContainer");
  rollButton.disabled = false;
  collection.disabled = false;
  items.disabled = false;
  indexDataContainer.style.display = "none";
  fadeOutOverlay();
}

document.getElementById("closeCollectionButton").addEventListener("click", closeCollection);

async function clicked() {
  fadeInOverlay();
  rollButton.disabled = true;
  collection.disabled = true;
  items.disabled = true;
  const finalRarity = await rollRarities();
  nextButton.disabled = false;
  nextButton.style.visibility = "visible";
  const rarityDiv = document.querySelector(".rarity-div");
  rarityDiv.style.visibility = "visible";
}

function nextclicked() {
  rollButton.disabled = false;
  collection.disabled = false;
  items.disabled = false;
  fadeOutOverlay();
  nextButton.disabled = true;
  nextButton.style.visibility = "hidden";
  const rarityDiv = document.querySelector(".rarity-div");
  rarityDiv.style.visibility = "hidden";
}
