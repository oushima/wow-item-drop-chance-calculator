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

function simulateLootAttempts(dropRate, numAttempts) {
  let successfulLoots = 0;
  for (let i = 0; i < numAttempts; i++) {
    if (Math.random() * 100 < dropRate) {
      successfulLoots++;
    }
  }
  return successfulLoots;
}

// Parameters for the simulation
const dropRate = 0.29;
const numAttemptsPerSimulation = 100;
const numSimulations = 10 ** 7; // Ten million simulations

// Variable to count successful simulations
let successfulSimulations = 0;

// Run simulations
for (let i = 0; i < numSimulations; i++) {
  if (simulateLootAttempts(dropRate, numAttemptsPerSimulation) >= 1) {
    successfulSimulations++;
  }
}

// Calculate and display likelihood
const likelihood = (successfulSimulations / numSimulations) * 100;
console.log(
  `The estimated likelihood of getting at least one drop in 100 tries is about ${likelihood.toFixed(
    2
  )}%`
);
