
/**
 * Utility functions for calculating time-related metrics
 */

/**
 * Calculates the frequency multiplier for different time periods
 * This is used to convert a rhythm's frequency into monthly, quarterly, and annual occurrences
 * 
 * @param frequency - The frequency string (e.g., "daily", "weekly", etc.)
 * @returns Object containing multipliers for monthly, quarterly, and annual calculations
 */
export const getFrequencyMultiplier = (frequency: string) => {
  switch (frequency.toLowerCase()) {
    case 'daily':
      // Assuming 20 working days per month
      return { monthly: 20, quarterly: 60, annual: 240 };
    case 'weekly':
      // 4 weeks per month
      return { monthly: 4, quarterly: 12, annual: 48 };
    case 'bi-weekly':
      // 2 times per month
      return { monthly: 2, quarterly: 6, annual: 24 };
    case 'monthly':
      // Once per month
      return { monthly: 1, quarterly: 3, annual: 12 };
    case 'quarterly':
      // Once every three months
      return { monthly: 1/3, quarterly: 1, annual: 4 };
    case 'annual':
      // Once per year
      return { monthly: 1/12, quarterly: 1/4, annual: 1 };
    case 'ad hoc':
      // Estimated average frequency
      return { monthly: 1/2, quarterly: 1.5, annual: 6 };
    default:
      return { monthly: 0, quarterly: 0, annual: 0 };
  }
};

/**
 * Calculates time metrics (monthly, quarterly, annual) for all rhythm data
 * 
 * @param rhythmData - Array of rhythm sections containing items with duration and frequency
 * @returns Object containing calculated time metrics for each period
 */
export const calculateTimeMetrics = (rhythmData: any[]) => {
  // Initialize object to store time totals by category
  const categoryTimes = {
    monthly: {},
    quarterly: {},
    annual: {}
  };

  // Calculate time totals for each category and period
  rhythmData.forEach(section => {
    const category = section.title;
    
    section.items.forEach(item => {
      const multipliers = getFrequencyMultiplier(item.frequency);
      const duration = item.duration;

      // Calculate time for each period (monthly, quarterly, annual)
      ['monthly', 'quarterly', 'annual'].forEach(period => {
        if (!categoryTimes[period][category]) {
          categoryTimes[period][category] = 0;
        }
        categoryTimes[period][category] += duration * multipliers[period];
      });
    });
  });

  /**
   * Helper function to format period data and calculate totals
   * Converts minutes to hours and formats for chart display
   */
  const calculatePeriodData = (periodTimes: Record<string, number>) => {
    const data = Object.entries(periodTimes).map(([name, minutes]) => ({ 
      name, 
      hours: Number((minutes / 60).toFixed(1))
    }));
    const total = Number((Object.values(periodTimes).reduce((a, b) => a + b, 0) / 60).toFixed(1));
    return { data, total };
  };

  // Return calculated metrics for all periods
  return {
    monthly: calculatePeriodData(categoryTimes.monthly),
    quarterly: calculatePeriodData(categoryTimes.quarterly),
    annual: calculatePeriodData(categoryTimes.annual)
  };
};
