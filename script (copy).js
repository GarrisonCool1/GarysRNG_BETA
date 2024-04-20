// Select buttons and display elements
const rollButton = document.getElementById("rollButton");

const nextButton = document.getElementById("nextButton");
nextButton.style.visibility = "hidden";
nextButton.style.zIndex = "101";

const collection = document.getElementById("collection");

const indexdisplay = document.getElementById("index");

const items = document.getElementById("items");

// rarity info
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

var indexdata = [
  { type: "Common", amount: 0},
  { type: "Uncommon", amount: 0},
  { type: "Rare", amount: 0},
  { type: "Epic", amount: 0},
  { type: "Legendary", amount: 0},
  { type: "Mythical", amount: 0},
  { type: "Divine", amount: 0},
  { type: "Celestial", amount: 0},
  { type: "Jackpot", amount: 0},
  { type: "True Luck", amount: 0},
  { type: "Shining", amount: 0},
]

// Function to draw indexdata array to the screen
function drawIndexData() {
  const indexDataList = document.getElementById("indexDataList");
  indexDataList.innerHTML = ""; // Clear previous content

  indexdata.forEach(item => {
    const listItem = document.createElement("li");
    listItem.textContent = `${item.type}: ${item.amount}`;
    indexDataList.appendChild(listItem);
  });
}

// Call drawIndexData initially to populate the list
drawIndexData();


// Generate a random rarity based on probabilities
function generateRandomRarity() {
  const randomNumber = Math.random();
  let cumulativeProbability = 0;
  for (const rarity of rarities) {
    cumulativeProbability += rarity.probability;
    if (randomNumber <= cumulativeProbability) return rarity;
  }

  return rarities[rarities.length - 1]; // Fallback
}

// Display rarity
function displayRarity(rarity) {
  const existingRarityDiv = document.querySelector(".rarity-div");
  if (existingRarityDiv) existingRarityDiv.remove();

  const rarityDiv = document.createElement("div");
  rarityDiv.textContent = rarity.name;
  rarityDiv.className = "rarity-div " + rarity.name.toLowerCase().replace(/\s+/g, '');
  rarityDiv.style.background = rarity.color;

  // Position the rarity div in the center of the screen
  rarityDiv.style.position = "fixed";
  rarityDiv.style.top = "300%";
  rarityDiv.style.left = "50%";
  rarityDiv.style.transform = "translate(-50%, -50%)";

  document.body.appendChild(rarityDiv);

  return rarityDiv;
}

// Stuffs for overlay
const overlay = document.createElement("div");
overlay.className = "overlay";
document.body.appendChild(overlay);

// hide overlay at start
overlay.classList.add("fade-out");

function fadeOutOverlay() {
  overlay.classList.add("fade-out");
}
function fadeInOverlay() {
  overlay.classList.remove("fade-out");
}

// Roll rarities animation
async function rollRarities() {
  const totalProbability = rarities.reduce((acc, rarity) => acc + rarity.probability, 0);
  let animate_time = 10; // Initial time between rarity changes
  let multiplier = 30;
  let multiplierCount = 0;
  let finalRarity;

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

    animate_time += multiplier;
    multiplierCount++;

    moveRarity();

    await new Promise(resolve => setTimeout(resolve, animate_time));

    finalRarity = selectedRarity; // Store the final rarity obtained
  }

  // Update indexdata with the final rarity obtained
  const indexToUpdate = rarities.findIndex(rarity => rarity.name === finalRarity.name);
  if (indexToUpdate !== -1) {
    indexdata[indexToUpdate].amount++;
  }

  return finalRarity; // Return the final rarity obtained
}





//detect keypress stuff

// rollkeydown
document.addEventListener('keydown', event => {
  if (event.code === 'Space') {
    if (!rollButton.disabled)
    clicked()
  }
})
//nextkeydown
document.addEventListener('keydown', event => {
  if (event.code === 'Space') {
    if (!nextButton.disabled)
    nextclicked()
  }
})
//rollclick
rollButton.addEventListener('click', function() {
  if (!rollButton.disabled) { clicked() }
})
//nextclick
nextButton.addEventListener('click', function() {
  if (!nextButton.disabled) { nextclicked() }
})
//collectionclick
collection.addEventListener('click', function() {
  opencollection()
})

function opencollection() {
  const indexDataContainer = document.getElementById("indexDataContainer");
  indexDataContainer.style.display = "block";
  fadeInOverlay();
  rollButton.disabled = true;
  collection.disabled = true;
  items.disabled = true;
}

// Function to hide the collection box and the overlay
function closeCollection() {
  const indexDataContainer = document.getElementById("indexDataContainer");
  rollButton.disabled = false;
  collection.disabled = false;
  items.disabled = false;

  indexDataContainer.style.display = "none";
  fadeOutOverlay();
}

// Event listener for the close button
document.getElementById("closeCollectionButton").addEventListener("click", closeCollection);




// what the keypress stuff does
async function clicked() {
  fadeInOverlay()
  rollButton.disabled = true;
  collection.disabled = true;
  items.disabled = true;
  const finalRarity = await rollRarities();
  nextButton.disabled = false; 
  nextButton.style.visibility = "visible";
  const rarityDiv = document.querySelector(".rarity-div");
  rarityDiv.style.visibility = "visible";

  // Update index data display
  drawIndexData();
}


function nextclicked() {
  rollButton.disabled = false;
  collection.disabled = false;
  items.disabled = false;
  fadeOutOverlay()
  nextButton.disabled = true;
  nextButton.style.visibility = "hidden";
  const rarityDiv = document.querySelector(".rarity-div");
  rarityDiv.style.visibility = "hidden";
} 