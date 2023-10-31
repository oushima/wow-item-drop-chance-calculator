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

function calculateOdds() {
  if (loopId) {
    clearTimeout(loopId);
  }

  const runsPerWeekInput = document.getElementById("runsPerWeek");
  const dropRateInput = document.getElementById("dropRate");

  const commaUsed = dropRateInput.value.includes(",");
  const runsPerWeek = normalizeInput(runsPerWeekInput.value);
  const dropRate = normalizeInput(dropRateInput.value) / 100;

  let week = 1;
  let odds = 0.0;
  let months = 0;
  let years = 0;
  let totalRuns = 0;
  const maxWeeks = 1000;
  const output = document.getElementById("output");
  output.innerHTML = "";

  const runLoop = () => {
    if (week > maxWeeks || odds >= 1) {
      if (week > maxWeeks) {
        addOutputRow(output, ["Stopped after 1000 weeks."], false);
      }
      return;
    }

    odds = findCumulativeOdds(week, runsPerWeek, dropRate);
    totalRuns += runsPerWeek;

    if (week % 4 === 0) {
      months++;
    }

    if (week % 52 === 0) {
      years++;
    }

    addOutputRow(
      output,
      [week, (odds * 100).toFixed(2) + "%", totalRuns, months, years],
      commaUsed
    );
    week++;
    loopId = setTimeout(runLoop, 0);
  };

  runLoop();
}

function handleChange() {
  if (loopId) {
    clearTimeout(loopId);
  }

  const runsPerWeekInput = document.getElementById("runsPerWeek");
  const dropRateInput = document.getElementById("dropRate");

  validateElement(dropRateInput, /^\d{1,2}([.,]\d{1,2})?$/);

  if (
    runsPerWeekInput.value &&
    dropRateInput.value &&
    isValidDropRate(dropRateInput.value)
  ) {
    calculateOdds();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const dropRateInput = document.getElementById("dropRate");
  const runsPerWeekInput = document.getElementById("runsPerWeek");

  dropRateInput.addEventListener("input", handleChange);
  runsPerWeekInput.addEventListener("input", handleChange);
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    calculateOdds();
  }
});
