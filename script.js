const smallCups = document.querySelectorAll('.cup-small');
const liters = document.getElementById('liters');
const percentage = document.getElementById('percentage');
const remained = document.getElementById('remained');
const goalInput = document.getElementById('goal-input');
const goalDisplay = document.getElementById('goal-display');
const resetBtn = document.getElementById('reset-btn');

// Load saved state from localStorage
let savedGoal = localStorage.getItem('dailyGoal');
let savedFullCups = JSON.parse(localStorage.getItem('fullCups'));

let dailyGoal = savedGoal ? parseFloat(savedGoal) : parseFloat(goalInput.value) || 2; // default 2 liters
const cupVolume = 250; // ml per small cup

// Initialize
goalInput.value = dailyGoal;
goalDisplay.innerText = dailyGoal.toFixed(1);

if (savedFullCups && Array.isArray(savedFullCups)) {
  smallCups.forEach((cup, idx) => {
    if (savedFullCups.includes(idx)) {
      cup.classList.add('full');
      cup.setAttribute('aria-pressed', 'true');
    } else {
      cup.classList.remove('full');
      cup.setAttribute('aria-pressed', 'false');
    }
  });
}

updateBigCup();

// Event listeners for small cups
smallCups.forEach((cup, idx) => {
  cup.addEventListener('click', () => highlightCups(idx));
  cup.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      highlightCups(idx);
    }
  });
});

// Event listener for goal input change
goalInput.addEventListener('input', () => {
  const value = parseFloat(goalInput.value);
  if (!isNaN(value) && value > 0) {
    dailyGoal = value;
    goalDisplay.innerText = dailyGoal.toFixed(1);
    localStorage.setItem('dailyGoal', dailyGoal);
    updateBigCup();
  }
});

// Event listener for reset button
resetBtn.addEventListener('click', resetCups);

// Highlight cups up to index
function highlightCups(idx) {
  if (idx === smallCups.length - 1 && smallCups[idx].classList.contains('full')) {
    idx--;
  } else if (
    smallCups[idx].classList.contains('full') &&
    !smallCups[idx].nextElementSibling.classList.contains('full')
  ) {
    idx--;
  }

  smallCups.forEach((cup, idx2) => {
    if (idx2 <= idx) {
      cup.classList.add('full');
      cup.setAttribute('aria-pressed', 'true');
    } else {
      cup.classList.remove('full');
      cup.setAttribute('aria-pressed', 'false');
    }
  });

  saveFullCups();
  updateBigCup();
}

// Save full cups indexes to localStorage
function saveFullCups() {
  const fullCupsIndexes = [];
  smallCups.forEach((cup, idx) => {
    if (cup.classList.contains('full')) {
      fullCupsIndexes.push(idx);
    }
  });
  localStorage.setItem('fullCups', JSON.stringify(fullCupsIndexes));
}

// Update the big cup display
function updateBigCup() {
  const fullCups = document.querySelectorAll('.cup-small.full').length;
  const totalCups = smallCups.length;

  if (fullCups === 0) {
    percentage.style.visibility = 'hidden';
    percentage.style.height = 0;
  } else {
    percentage.style.visibility = 'visible';
    const bigCupHeight = percentage.parentElement.clientHeight;
    percentage.style.height = `${(fullCups / totalCups) * bigCupHeight}px`;
    percentage.innerText = `${((fullCups / totalCups) * 100).toFixed(0)}%`;
  }

  if (fullCups === totalCups) {
    remained.style.visibility = 'hidden';
    remained.style.height = 0;
  } else {
    remained.style.visibility = 'visible';
    const remainedLiters = dailyGoal - (cupVolume * fullCups) / 1000;
    liters.innerText = `${remainedLiters.toFixed(2)}L`;
  }
}

// Reset all cups
function resetCups() {
  smallCups.forEach((cup) => {
    cup.classList.remove('full');
    cup.setAttribute('aria-pressed', 'false');
  });
  localStorage.removeItem('fullCups');
  updateBigCup();
}
