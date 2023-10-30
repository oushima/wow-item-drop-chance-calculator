# WoW Item Drop Chance Calculator

Try it live: [GitHub Pages Link](https://oushima.github.io/WoW-Item-Drop-Chance-Calculator)

This calculator is designed to estimate the odds of acquiring a particular item over multiple runs in the World of Warcraft game. Below is the explanation of the formula used to calculate these odds.

## Cumulative Odds Formula Explanation

To understand the calculator's functionality, it's important to break down the formula used to calculate cumulative odds:

\[
\text{Odds of Getting Item} = 1 - (1 - \text{Drop Rate})^{(\text{Runs per Week} \times \text{Weeks})}
\]

### Step-by-step Explanation

1. **Drop Rate**: This is the chance of the item dropping in a single run. It is a value between 0 and 1, where for example, a 5% drop rate is represented as 0.05.

2. **Runs per Week**: This is the number of times you attempt to get the item in a single week.

3. **Weeks**: This represents the number of weeks you've been attempting to get the item.

#### Step 1: Calculating Not Drop Rate

The chance of **not** getting the item in a single run is calculated as:

\[
\text{Not Drop Rate} = 1 - \text{Drop Rate}
\]

This gives the odds of not receiving the item on any given individual run.

#### Step 2: Odds of Not Getting the Item Over Multiple Runs

The odds of **not** getting the item over multiple runs are:

\[
\text{Odds of Not Getting Item} = (\text{Not Drop Rate})^{(\text{Runs per Week} \times \text{Weeks})}
\]

#### Step 3: Cumulative Odds of Getting the Item

Finally, the cumulative odds of getting the item at least once over the specified period are:

\[
\text{Odds of Getting Item} = 1 - \text{Odds of Not Getting Item}
\]

This value is then converted to a percentage for easier interpretation.

## Total Runs

The total number of runs you've attempted is simply the number of runs you do each week multiplied by the total number of weeks:

\[
\text{Total Runs} = \text{Runs per Week} \times \text{Weeks}
\]

## Features

- Calculate the odds of getting an item over multiple weeks.
- User-friendly and modern design.
- Mobile-responsive layout.

## How to Use

1. Enter the number of runs you complete per week in the "Runs per week" field.
2. Enter the drop rate of the item as a percentage in the "Drop rate (%)" field.
3. Click on the "Calculate" button.

You will see the cumulative odds for each week until they reach 100% or until 1000 weeks have passed.

## Technologies Used

- HTML
- CSS
- JavaScript

## Setup

1. Clone the repository: `git clone https://github.com/yourusername/WoW-Item-Drop-Chance-Calculator.git`
2. Open `index.html` in your web browser.

## License

MIT License. See `LICENSE` for more information.
