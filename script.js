const rollButton = document.getElementById("rollButton");
const nextButton = document.getElementById("nextButton");
const collection = document.getElementById("collection");
const indexdisplay = document.getElementById("index");
const clearbutton = document.getElementById("clearbutton");
const items = document.getElementById("items");

var currentRarity

const cutscene = document.createElement("div");
cutscene.id = "cutscene";
cutscene.className = "cutscene";
cutscene.style.zIndex = "200"
cutscene.style.position = "fixed";
cutscene.style.top = "0";
cutscene.style.left = "0";
cutscene.style.width = "100%";
cutscene.style.height = "0%";
cutscene.style.opacity = "0";
cutscene.style.disabled = true;
cutscene.style.transition = "color 2s"


let indexdata; // Declare indexdata variable

let rolldata; // Declare rolldata variable

function initializeIndexData() {
  const storedIndexData = JSON.parse(localStorage.getItem('indexdata'));
  const storedRollData = JSON.parse(localStorage.getItem('rolldata'));
  if (storedIndexData) {
    indexdata = storedIndexData;
    rolldata = storedRollData
  } else {
    indexdata = rarities.map(rarity => ({ name: rarity.name, amount: 0 }));
    rolldata = 0
  }
}

function updateLocalStorage() {
  localStorage.setItem('indexdata', JSON.stringify(indexdata));
  localStorage.setItem('rolldata', JSON.stringify(rolldata));
}

function clearLocalStorage() {
  localStorage.clear();
}

initializeIndexData();

console.log(indexdata)

function updateIndexData() {
  drawIndexData(); // Update the displayed index data
  updateLocalStorage();
}

function drawIndexData() {
  const indexDataList = document.getElementById("indexDataList");
  indexDataList.innerHTML = "";
  rarities.forEach(rarity => {
    const indexItem = indexdata.find(item => item.name === rarity.name);
    const button = document.createElement("button");
    // if you have the rarity, display it.
    if (indexItem ? indexItem.amount : 0 != 0) {
      button.textContent = `${rarity.name}: ${indexItem ? indexItem.amount : 0}`;
      button.addEventListener("click", function() {
        // Buttonclick
      });
    } else {
      button.textContent = "???";
    }
    indexDataList.appendChild(button);
    button.style.width = "100%";
    button.style.fontSize = "20px";
    button.style.textAlign = "left";
  });
}

drawIndexData();

let luck = 1;

function adjustProbability(probability, rarityIndex) {
  return probability / (luck * (rarityIndex + 1));
}

function generateRandomRarity() {
  let totalAdjustedProbability = 0;

  // Adjust probabilities for all rarities
  rarities.forEach((rarity, index) => {
    totalAdjustedProbability += 1 / adjustProbability(rarity.probability, index);
  });

  const randomNumber = Math.random() * totalAdjustedProbability;
  let cumulativeAdjustedProbability = 0;
  let selectedRarity;

  // Choose rarity based on adjusted probabilities
  for (const [index, rarity] of rarities.entries()) {
    cumulativeAdjustedProbability += 1 / adjustProbability(rarity.probability, index);

    if (randomNumber <= cumulativeAdjustedProbability) {
      selectedRarity = rarity;
      break;
    }
  }

  return selectedRarity || rarities[rarities.length - 1];
}

function displayRarity(rarity) {

  const existingRarityDiv = document.querySelector(".rarity-div");
  if (existingRarityDiv) {
    existingRarityDiv.remove();
  }

  const rarityDiv = document.createElement("div");
  rarityDiv.className = `rarity-div ${rarity.name.toLowerCase().replace(/\s+/g, '')}`;
  rarityDiv.style = `
    font-family: ${rarity.font};
    color: ${rarity.color};
    position: fixed;
    top: 300%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  `;

  const rarityClass = document.createElement("div");
  rarityClass.textContent = `  ${rarity.class}`;
  rarityClass.style.fontSize = "20px";
  rarityClass.style.color = "white";
  rarityDiv.appendChild(rarityClass);

  const rarityName = document.createElement("div");
  rarityName.textContent = rarity.name;
  rarityName.style.fontSize = "50px";
  rarityDiv.appendChild(rarityName);

  const rarityProbability = document.createElement("div");
  rarityProbability.textContent = `1 in ${rarity.probability}`;
  rarityProbability.style.fontSize = "20px";
  rarityProbability.style.color = "white";
  rarityDiv.appendChild(rarityProbability);

  document.body.appendChild(rarityDiv);

  return rarityDiv;
}

const overlay = document.createElement("div");
overlay.className = "overlay";
document.body.appendChild(overlay);
overlay.classList.add("fade-out");

function fadeOutOverlay() { overlay.classList.add("fade-out"); }
function fadeInOverlay() { overlay.classList.remove("fade-out"); }

document.body.appendChild(cutscene);
function fadeOutCutscene() {
  cutscene.style.height = "0%";
  cutscene.style.opacity = "0";
}

function fadeInCutscene() {
  cutscene.style.height = "100%";
  cutscene.style.backgroundColor = "black";
  cutscene.style.transition = "opacity 0.4s";
  cutscene.style.opacity = "100";

  setTimeout(() => {
    cutscene.style.transition = "background-color 3s";
    cutscene.style.backgroundColor = currentRarity.color;
  }, 1000);
}

async function rollRarities() {
  let animateTime = 10;
  const multiplier = 30;
  let finalRarity;
  let multiplierCount = 0;

  let selectedRarity

  var rarityDiv

  while (multiplierCount < 10) {
    let accel = 1.4;
    selectedRarity = generateRandomRarity();

    rarityDiv = displayRarity(selectedRarity);

    function moveRarity() {
      rarityDiv.style.top = `${parseFloat(rarityDiv.style.top) + accel}px`;
      accel /= 1.1;
      requestAnimationFrame(moveRarity);
    };

    animateTime += multiplier;
    multiplierCount++;

    moveRarity();

    await new Promise(resolve => setTimeout(resolve, animateTime));

    finalClass = selectedRarity.class;
    finalRarity = selectedRarity;
  }

  currentRarity = finalRarity;
  
  if (finalRarity.class === "Exotic" || finalRarity.class === "Mythical") {
    fadeInCutscene();
    setTimeout(function() {
      fadeOutCutscene();
      shake(rarityDiv, 1000);
    }, 3000);

  }


  //createParticles(finalRarity.name);
  rolldata += 1;
  const indexToUpdate = rarities.findIndex(rarity => rarity.name === finalRarity.name);
  if (indexToUpdate !== -1) {
    indexdata[indexToUpdate].amount++;
    updateIndexData();
  }

  //log what you got
  console.log(`Rolled: ${finalRarity.name}, Class: ${finalRarity.class}. That was your ${rolldata} roll.`);

  return finalRarity;
}

let spaceKeyPressed = false;

document.addEventListener('keydown', event => {
  if (event.code === 'Space' && !spaceKeyPressed) {
    spaceKeyPressed = true;
    if (!rollButton.disabled) clicked();
    if (!nextButton.disabled) nextclicked();
  }
});

document.addEventListener('keyup', event => {
  if (event.code === 'Space') {
    spaceKeyPressed = false;
  }
});

rollButton.addEventListener('click', () => {
  if (!rollButton.disabled) clicked();
});

nextButton.addEventListener('click', () => {
  if (!nextButton.disabled) nextclicked();
});

collection.addEventListener('click', opencollection);

clearbutton.addEventListener('click', () => {
  if (window.confirm("Are you sure you want to clear your collection?")) {
    clearLocalStorage();
    initializeIndexData();
    drawIndexData();
  }
});

function opencollection() {
  const indexDataContainer = document.getElementById("indexDataContainer");
  indexDataContainer.style.display = "block";
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
  //stopParticles();
  nextButton.disabled = true;
  nextButton.style.visibility = "hidden";
  const rarityDiv = document.querySelector(".rarity-div");
  rarityDiv.style.visibility = "hidden";
}

function shake(rarityDiv, duration) {
  const shakeSteps = 100;
  const shakeSize = 50;
  const shakeDecay = 1.05;
  const originalTransform = rarityDiv.style.transform || '';

  const interval = duration / shakeSteps;
  let currentStep = 0;
  let intensity = shakeSize;

  const shakeInterval = setInterval(() => {
    rarityDiv.style.transform = `${originalTransform} translate(${(Math.random() * intensity) - (intensity / 2)}px, ${Math.random() * intensity - intensity / 2}px)`;

    currentStep++;

    console.log(intensity)
    intensity /= shakeDecay;

    if (currentStep >= shakeSteps) {
      clearInterval(shakeInterval);
    }
  }, interval);
}
