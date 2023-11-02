/**
 * Monte Carlo Simulation for Loot Drop Probability
 *
 * This script estimates the likelihood of obtaining at least one successful loot drop
 * in a given number of attempts, based on a specified drop rate.
 *
 * The simulation runs 'numSimulations' individual simulations, each consisting of
 * 'numAttemptsPerSimulation' loot attempts. After all simulations are run, it calculates
 * the percentage of simulations where at least one successful loot was obtained.
 *
 * This provides an empirical estimate of the likelihood of getting at least one
 * successful loot in 'numAttemptsPerSimulation' tries, which can be used to compare
 * with theoretical probabilities.
 */
// Parameters for the simulation
const DROP_RATE = 0.77;
const NUM_ATTEMPTS_PER_SIMULATION = 300;
const NUM_SIMULATIONS = 10 ** 7; // Ten million simulations.

function simulateLootAttempts(dropRate, numAttempts) {
  let successfulLoots = 0;
  for (let i = 0; i < numAttempts; i++) {
    if (Math.random() * 100 < dropRate) {
      successfulLoots++;
    }
  }
  return successfulLoots;
}

// Variable to count successful simulations
let successfulSimulations = 0;

// Run simulations
for (let i = 0; i < NUM_SIMULATIONS; i++) {
  if (simulateLootAttempts(DROP_RATE, NUM_ATTEMPTS_PER_SIMULATION) >= 1) {
    successfulSimulations++;
  }
}

// Calculate and display likelihood
const likelihood = (successfulSimulations / NUM_SIMULATIONS) * 100;
console.log(
  `The estimated likelihood of getting at least one drop in 100 tries is about ${likelihood.toFixed(
    2
  )}%`
);
