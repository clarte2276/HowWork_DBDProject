// src/utils/utils.js

/**
 * Rounds a number to the nearest 0.5.
 * 
 * @param {number} num - The number to round.
 * @returns {number} The number rounded to the nearest 0.5.
 */
export const roundToHalf = (num) => {
    return Math.round(num * 2) / 2;
  };
  
  /**
   * Calculates the current urgency (calc_urgency) based on initial urgency,
   * start date, and due date. The urgency increases linearly from the initial
   * value to 10 as the due date approaches.
   * 
   * @param {number} initialUrgency - The initial urgency value (1-10).
   * @param {string} startDate - The start date in 'YYYY-MM-DD' format.
   * @param {string} dueDate - The due date in 'YYYY-MM-DD' format.
   * @returns {number} The calculated urgency, rounded to the nearest 0.5.
   */
export const calculateCalcUrgency = (initialUrgency, startDate, dueDate) => {
    const today = new Date();
    const start = new Date(startDate);
    const due = new Date(dueDate);
  
    console.log(`Calculating urgency for Task: initialUrgency=${initialUrgency}, startDate=${startDate}, dueDate=${dueDate}, today=${today.toISOString().split('T')[0]}`);
  
    // If today is before the start date, return initial urgency
    if (today < start) {
      console.log(`Today is before start date. calc_urgency=${initialUrgency}`);
      return initialUrgency;
    }
  
    // If today is after the due date, return 10
    if (today > due) {
      console.log(`Today is after due date. calc_urgency=10`);
      return 10;
    }
  
    // Calculate total number of days between start and due dates
    const totalTime = due - start;
    const totalDays = Math.ceil(totalTime / (1000 * 60 * 60 * 24));
  
    // Calculate elapsed days since start date
    const elapsedTime = today - start;
    const elapsedDays = Math.ceil(elapsedTime / (1000 * 60 * 60 * 24));
  
    // Prevent division by zero
    if (totalDays === 0) {
      console.log(`Zero-day duration. calc_urgency=10`);
      return 10;
    }
  
    // Calculate daily increase
    const dailyIncrease = (10 - initialUrgency) / totalDays;
  
    // Calculate current urgency
    let currentUrgency = initialUrgency + (dailyIncrease * elapsedDays);
  
    // Round to the nearest 0.5 and cap at 10
    currentUrgency = Math.min(roundToHalf(currentUrgency), 10);
  
    console.log(`Calculated calc_urgency=${currentUrgency}`);
  
    return currentUrgency;
  };
  