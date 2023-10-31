const runsPerWeekInput = document.getElementById("runsPerWeek");
const dropRateInput = document.getElementById("dropRate");
const outputHeader = document.getElementById("output-header");
const outputContainer = document.getElementById("output-container");
const liveCalcToggle = document.getElementById("liveCalcToggle");

let loopId = null;

function isValidDropRate(dropRateInput) {
  const pattern = /^\d{1,2}([.,]\d{1,2})?$/;
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
  return (
    runsPerWeekInput.value &&
    dropRateInput.value &&
    !isNaN(normalizeInput(runsPerWeekInput.value)) &&
    isValidDropRate(dropRateInput.value) &&
    isValidInteger(runsPerWeekInput.value) // Check if the runsPerWeekInput is a valid integer
  );
}

function handleUIVisibility(shouldShow) {
  if (shouldShow) {
    outputHeader.classList.remove("hidden");
    outputContainer.classList.remove("hidden");
  } else {
    outputHeader.classList.add("hidden");
    outputContainer.classList.add("hidden");
  }
}

function handleChange() {
  validateElement(dropRateInput, /^\d{1,2}([.,]\d{1,2})?$/);
  validateElement(runsPerWeekInput, /^\d+$/); // Validate if runsPerWeekInput is an integer

  const shouldShow = shouldRunCalculation();
  handleUIVisibility(shouldShow);

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
  dropRateInput.addEventListener("input", handleChange);
  runsPerWeekInput.addEventListener("input", handleChange);

  const calculateButton = document.getElementById("calculate-btn");
  calculateButton.addEventListener("click", calculateOdds);
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    calculateOdds();
  }
});

function isValidInteger(value) {
  const pattern = /^\d+$/;
  return pattern.test(value);
}
