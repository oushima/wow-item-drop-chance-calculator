# WoW Item Drop Chance Calculator

Try it live: [GitHub Pages Link](https://oushima.github.io/wow-item-drop-chance-calculator)

## Description

This calculator is designed to estimate the odds of acquiring a particular item over multiple runs in the World of Warcraft game.

## Cumulative Odds Formula Explanation

\[
\text{Odds of Getting Item} = 1 - (1 - \text{Drop Rate})^{(\text{Runs per Week} \times \text{Weeks})}
\]

### Step-by-step Explanation

Refer to the existing step-by-step explanations.

## Additional Features

- **Real-time Validation**: The calculator performs real-time validation of input fields for both the drop rate and runs per week.
- **Instant Calculation Toggle**: A toggle to switch on/off instant calculations as you type.
- **Invalid Input Highlight**: Invalid input fields are highlighted for easy identification.
- **Input Normalization**: The calculator can handle both comma and dot as decimal separators for the drop rate.
- **Press Enter to Calculate**: You can hit the Enter key to perform calculations.

## How to Use

1. Enter the number of runs you complete per week in the "Runs per week" field.
2. Enter the drop rate of the item as a percentage in the "Drop rate (%)" field.
3. Toggle the "Instant Calculation" switch if you want real-time updates.
4. Click on the "Calculate" button or press the "Enter" key.

The cumulative odds for each week are displayed until they reach a statistical certainty of 100% or until 1000 weeks have passed.

## Technologies Used

- HTML
- CSS
- JavaScript

## Setup

1. Clone the repository: `git clone https://github.com/yourusername/WoW-Item-Drop-Chance-Calculator.git`
2. Open `index.html` in your web browser.

## License

MIT License. See `LICENSE` for more information.
