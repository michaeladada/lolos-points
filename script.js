// --- Configuration ---
const maxStars = 40;
const POINTS_URL = "https://gist.githubusercontent.com/michaeladada/2d3e1d7b8897f4cf6ef2d7f00e071d74/raw/points.txt?" + new Date().getTime();
let totalPoints = 0;

// Rewards list
const rewardsData = [
  { name: "🎁 Small request", cost: 2 },
  { name: "🎁 Large request", cost: 10 },
  { name: "☕ Coffee date", cost: 2 },
  { name: "👕 1 Item of clothing", cost: 5 },
  { name: "📷 Show me!", cost: 5 },
  { name: "🚀 Rub it", cost: 15 },
  { name: "💦 Cum for me", cost: 41 }
];

// --- Stars rendering ---
const starsContainer = document.getElementById("stars");
function renderStars() {
  starsContainer.innerHTML = "";
  const filledStars = Math.min(totalPoints, maxStars);
  for (let i = 0; i < maxStars; i++) {
    const star = document.createElement("img");
    star.className = "star";
    star.src = "star.png";
    star.alt = "star";
    // if (i >= filledStars) {
    //   star.classList.add("empty");
    // }
    // starsContainer.appendChild(star);
    if (i < totalPoints) {
      starsContainer.appendChild(star);
    }
  }

  document.getElementById("points").textContent = `${totalPoints} / ${maxStars} Points`;
}


// --- Reward selection ---
const rewardsContainer = document.getElementById("rewards-container");
const totalSelectedEl = document.getElementById("total-selected");

const selectionCounts = {};
rewardsData.forEach(r => selectionCounts[r.name] = 0);

function getTotalSelectedPoints() {
  return rewardsData.reduce((sum, r) => sum + selectionCounts[r.name] * r.cost, 0);
}

function updateTotalSelected() {
  totalSelectedEl.textContent = getTotalSelectedPoints();
}

// Create reward rows
rewardsData.forEach(reward => {
  const row = document.createElement("div");
  row.className = "reward-row";

  const minusBtn = document.createElement("button");
  minusBtn.textContent = "−";

  const plusBtn = document.createElement("button");
  plusBtn.textContent = "+";

  const countSpan = document.createElement("span");
  countSpan.className = "count";
  countSpan.textContent = 0;

  const nameCostDiv = document.createElement("div");
  nameCostDiv.className = "reward-name-cost";
  const nameDiv = document.createElement("div");
  nameDiv.className = "reward-name";
  nameDiv.textContent = reward.name;
  const costDiv = document.createElement("div");
  costDiv.className = "reward-cost";
  costDiv.textContent = `${reward.cost} pts`;
  nameCostDiv.appendChild(nameDiv);
  nameCostDiv.appendChild(costDiv);

  row.appendChild(minusBtn);
  row.appendChild(nameCostDiv);
  row.appendChild(countSpan);
  row.appendChild(plusBtn);
  rewardsContainer.appendChild(row);

  // --- Event listeners ---
  minusBtn.addEventListener("click", e => {
    e.stopPropagation();
    if (selectionCounts[reward.name] > 0) {
      selectionCounts[reward.name]--;
      countSpan.textContent = selectionCounts[reward.name];
      updateTotalSelected();
    }
  });

  plusBtn.addEventListener("click", e => {
    e.stopPropagation();
    const newTotal = getTotalSelectedPoints() + reward.cost;
    if (newTotal <= totalPoints) { // enforce max points
      selectionCounts[reward.name]++;
      countSpan.textContent = selectionCounts[reward.name];
      updateTotalSelected();
    } else {
      // flash row red
      row.classList.remove("flash-red"); // reset if already flashing
      void row.offsetWidth;              // force reflow (important)
      row.classList.add("flash-red");
    }
  });
});

const helpTrigger = document.getElementById("points-help");
const overlay = document.getElementById("info-popup-overlay");

// close on any click (inside or outside popup)
overlay.addEventListener("click", () => {
  overlay.classList.add("hidden");
});

helpTrigger.addEventListener("click", () => {
  overlay.classList.remove("hidden");
});

async function loadPoints() {
  try {
    const res = await fetch(POINTS_URL, { cache: "no-store" });
    const text = await res.text();

    const points = parseInt(text.trim(), 10);

    if (Number.isNaN(points)) {
      throw new Error("Invalid points value");
    }

    totalPoints = points;

    renderStars();
    renderStars();
  } catch (err) {
    console.error("Failed to load points:", err);
    totalPoints = 0;
    renderStars();
  }
}

document.addEventListener("DOMContentLoaded", loadPoints);
