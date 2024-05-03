const rollButton = document.getElementById("rollButton");
const nextButton = document.getElementById("nextButton");
const collection = document.getElementById("collection");
const indexdisplay = document.getElementById("index");
const items = document.getElementById("items");

let indexdata; // Declare indexdata variable

// Function to initialize indexdata from localStorage or default values
function initializeIndexData() {
    const storedIndexData = JSON.parse(localStorage.getItem('indexdata'));
    if (storedIndexData) {
        indexdata = storedIndexData;
    } else {
        indexdata = rarities.map(rarity => ({ name: rarity.name, amount: 0 }));
    }
}

function updateLocalStorage() {
    localStorage.setItem('indexdata', JSON.stringify(indexdata));
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

// Function to clear indexdata from localStorage
function clearIndexData() {
  localStorage.removeItem('indexdata');
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
          let selected = (rarity.name)
          console.log(selected);
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

function generateRandomRarity() {
  let totalProbability = 0;
  rarities.forEach(rarity => {
    totalProbability += 1 / rarity.probability;
  });
  const randomNumber = Math.random() * totalProbability;
  let cumulativeProbability = 0;
  let selectedRarity;
  for (const rarity of rarities) {
    cumulativeProbability += 1 / rarity.probability;
    if (randomNumber <= cumulativeProbability) {
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
    top: 300%; /* Adjusted to keep it centered */
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

async function rollRarities() {
  let animateTime = 10;
  const multiplier = 30;
  let finalRarity;
  let multiplierCount = 0;

  while (multiplierCount < 10) {
    let accel = 1.4;
    const selectedRarity = generateRandomRarity();

    const rarityDiv = displayRarity(selectedRarity);

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

  //createParticles(finalRarity.name);

  const indexToUpdate = rarities.findIndex(rarity => rarity.name === finalRarity.name);
  if (indexToUpdate !== -1) {
    indexdata[indexToUpdate].amount++;
    updateIndexData();
  }

  //log what you got
  console.log(`Rolled: ${finalRarity.name}, Class: ${finalRarity.class}`);
  
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




