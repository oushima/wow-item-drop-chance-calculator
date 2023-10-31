const runsPerWeekInput = document.getElementById("runsPerWeek");
const dropRateInput = document.getElementById("dropRate");
const outputHeader = document.getElementById("output-header");
const outputContainer = document.getElementById("output-container");
const liveCalcToggle = document.getElementById("liveCalcToggle");

let loopId = null;

function isValidDropRate(dropRateInput) {
  const pattern = /^(?!0*[.,]0*$)([0]?[.,])?\d{1,2}([.,]\d{1,2})?$/;
  return pattern.test(dropRateInput);
}

function addInvalidClass(element) {
  element.classList.add("invalid");
}

function removeInvalidClass(element) {
  element.classList.remove("invalid");
}

function validateElement(element, regex) {
  const value = element.value;
  const isValid = regex.test(value);

  if (isValid) {
    removeInvalidClass(element);
  } else {
    addInvalidClass(element);
  }
}

function normalizeInput(value) {
  return parseFloat(value.replace(",", "."));
}

function findCumulativeOdds(weeks, runsPerWeek, dropRate) {
  const totalRuns = runsPerWeek * weeks;
  const notDropRate = 1 - dropRate;
  const oddsOfNotGettingItem = Math.pow(notDropRate, totalRuns);
  return 1 - oddsOfNotGettingItem;
}

function addOutputRow(output, values, commaUsed) {
  const row = document.createElement("div");
  row.className = "output-row";

  values.forEach((value) => {
    const col = document.createElement("div");
    col.className = "column";
    col.innerText = commaUsed ? value.toString().replace(".", ",") : value;
    row.appendChild(col);
  });

  output.appendChild(row);
}

function shouldRunCalculation() {
  const normalizedRunsPerWeek = normalizeInput(runsPerWeekInput.value);
  const normalizedDropRate = normalizeInput(dropRateInput.value);

  return (
    normalizedRunsPerWeek > 0 && // Disallow 0 for runsPerWeek
    normalizedDropRate > 0 && // Disallow 0 for dropRate
    !isNaN(normalizedRunsPerWeek) &&
    isValidDropRate(dropRateInput.value) &&
    isValidInteger(runsPerWeekInput.value)
  );
}

function handleUIVisibility(shouldShow, forceShow = false) {
  if (shouldShow || forceShow) {
    outputHeader.classList.remove("hidden");
    outputContainer.classList.remove("hidden");
  } else {
    outputHeader.classList.add("hidden");
    outputContainer.classList.add("hidden");
  }
}

function handleChange() {
  // Remove leading zeros for dropRate and runsPerWeek if present
  if (/^0+[1-9]+([.,]\d{1,2})?$/.test(dropRateInput.value)) {
    dropRateInput.value = dropRateInput.value.replace(/^0+/, "");
  }

  if (/^0+[1-9]+$/.test(runsPerWeekInput.value)) {
    runsPerWeekInput.value = parseInt(runsPerWeekInput.value, 10).toString();
  }

  // Validate input and make it red if invalid
  const dropRateValue = dropRateInput.value;
  const validDropRate = isValidDropRate(dropRateValue);
  const validRunsPerWeek =
    isValidInteger(runsPerWeekInput.value) &&
    normalizeInput(runsPerWeekInput.value) > 0;

  // Turn red for '0', '0,0', '0.0'; keep black for '0,' and '0.'
  if (validDropRate) {
    removeInvalidClass(dropRateInput);
  } else if (
    dropRateValue === "0" ||
    dropRateValue === "0,0" ||
    dropRateValue === "0.0"
  ) {
    addInvalidClass(dropRateInput);
  }

  // Validate runsPerWeek and turn red if invalid
  if (validRunsPerWeek) {
    removeInvalidClass(runsPerWeekInput);
  } else {
    addInvalidClass(runsPerWeekInput);
  }

  const shouldShow = shouldRunCalculation();

  if (liveCalcToggle.checked) {
    handleUIVisibility(shouldShow);
  }

  // Only run calculation if liveCalcToggle is checked and shouldRunCalculation returns true
  if (liveCalcToggle.checked && shouldShow) {
    calculateOdds();
  }
}

function runCalculationsAndUpdateUI(
  week,
  runsPerWeek,
  dropRate,
  commaUsed,
  output
) {
  const odds = findCumulativeOdds(week, runsPerWeek, dropRate);
  const totalRuns = runsPerWeek * week;
  let months = Math.floor(week / 4);
  let years = Math.floor(week / 52);

  if (odds >= 0.999) {
    // Check if the odds have reached or exceeded 99.9%
    addOutputRow(
      output,
      [week, `99${commaUsed ? "," : "."}99%`, totalRuns, months, years],
      commaUsed
    );
    return true; // Return true to indicate that 99.9% has been reached
  }

  addOutputRow(
    output,
    [week, (odds * 100).toFixed(2) + "%", totalRuns, months, years],
    commaUsed
  );

  return false; // Return false to indicate that 99.9% has not been reached
}

function calculateOdds() {
  if (loopId) {
    clearTimeout(loopId);
  }

  const commaUsed = dropRateInput.value.includes(",");
  const runsPerWeek = normalizeInput(runsPerWeekInput.value);
  const dropRate = normalizeInput(dropRateInput.value) / 100;

  let week = 1;
  const maxWeeks = 1000;
  const output = document.getElementById("output");
  output.innerHTML = "";

  function runLoop() {
    if (week > maxWeeks) {
      addOutputRow(output, ["Stopped after 1000 weeks."], false);
      return;
    }

    // If runCalculationsAndUpdateUI returns true, stop the loop
    if (
      runCalculationsAndUpdateUI(week, runsPerWeek, dropRate, commaUsed, output)
    ) {
      addOutputRow(
        output,
        ["Stopped: Reached statistical certainty of 100% (upper limit)."],
        false
      );
      return;
    }

    week++;
    loopId = setTimeout(runLoop, 0);
  }

  runLoop();
}

document.addEventListener("DOMContentLoaded", function () {
  updateLiveCalcToggleFromStorage(); // Update checkbox state on page load
  dropRateInput.addEventListener("input", handleChange);
  runsPerWeekInput.addEventListener("input", handleChange);

  const calculateButton = document.getElementById("calculate-btn");
  calculateButton.addEventListener("click", function () {
    if (shouldRunCalculation()) {
      handleUIVisibility(true, true);
      calculateOdds();
    }
  });
  liveCalcToggle.addEventListener("change", function () {
    saveLiveCalcToggleToStorage(); // Save checkbox state when changed
  });
});

document.addEventListener("keydown", function (event) {
  if (
    event.key === "Enter" &&
    !liveCalcToggle.checked &&
    shouldRunCalculation()
  ) {
    handleUIVisibility(true, true);
    calculateOdds();
  }
});

function isValidInteger(value) {
  const pattern = /^\d+$/;
  return pattern.test(value);
}

// Update this function to disable the checkbox by default
function updateLiveCalcToggleFromStorage() {
  const storedValue = localStorage.getItem("liveCalcToggle");
  if (storedValue === null) {
    liveCalcToggle.checked = false; // Set default state to disabled
    localStorage.setItem("liveCalcToggle", "false"); // Save the default state
  } else {
    liveCalcToggle.checked = storedValue === "true"; // Use the stored value
  }
}

function saveLiveCalcToggleToStorage() {
  localStorage.setItem("liveCalcToggle", liveCalcToggle.checked.toString());
}
