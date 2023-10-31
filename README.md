# WoW Item Drop Chance Calculator

Try it live: [GitHub Pages Link](https://oushima.github.io/wow-item-drop-chance-calculator)

## Description

This calculator is designed to estimate the odds of acquiring a particular item over multiple runs in the World of Warcraft game.

## Odds Calculation Method

In the world of odds calculation, there are mainly two approaches:

### 1. Cumulative Odds

This approach takes into account previous runs to calculate the current odds. In other words, odds from past weeks are cumulatively added to calculate the current week's odds.

### 2. Independent Odds

In this approach, each week is considered independent, and the odds are calculated fresh every week. Taking a break or skipping some weeks won't affect the odds for the upcoming week.

### What Method Does This Project Use?

This project uses the **Cumulative Odds** approach to calculate the odds of getting an item. Specifically, it multiplies the number of runs per week by the total weeks to find the cumulative odds. So if you take a break, the odds will not reset to zero; they will stay the same as they were after the last week you participated.

### Why Does This Project Use Cumulative Odds?

The Cumulative Odds approach is chosen because it more accurately models scenarios where people are continually participating in an activity over a span of time, like farming a rare drop in a video game. Cumulative odds give a more realistic picture of one's chances of getting an item over time, as it assumes the more attempts you make, the higher your chances of success.

#### World of Warcraft Example

Imagine you're farming a rare mount in WoW that has a 1% drop rate. If you were to calculate the odds independently each week, the mount would always have a 1% chance of dropping every time you defeat the boss, regardless of how many times you've tried before. This could be discouraging and counterintuitive, as it feels like your efforts over time don't accumulate.

In contrast, with Cumulative Odds, your chances of getting the mount increase the more you try. So if you defeat the boss once a week for 5 weeks, the odds will not remain stagnant at 1% each week. Instead, they will cumulatively increase, giving you a better overall chance to get that coveted mount.

By using the Cumulative Odds approach, this project aims to provide a more realistic and encouraging picture of your odds over time.


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
