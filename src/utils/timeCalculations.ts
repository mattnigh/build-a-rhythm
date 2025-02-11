
export const getFrequencyMultiplier = (frequency: string) => {
  switch (frequency.toLowerCase()) {
    case 'daily':
      return { monthly: 20, quarterly: 60, annual: 240 };
    case 'weekly':
      return { monthly: 4, quarterly: 12, annual: 48 };
    case 'bi-weekly':
      return { monthly: 2, quarterly: 6, annual: 24 };
    case 'monthly':
      return { monthly: 1, quarterly: 3, annual: 12 };
    case 'quarterly':
      return { monthly: 1/3, quarterly: 1, annual: 4 };
    case 'annual':
      return { monthly: 1/12, quarterly: 1/4, annual: 1 };
    case 'ad hoc':
      return { monthly: 1/2, quarterly: 1.5, annual: 6 };
    default:
      return { monthly: 0, quarterly: 0, annual: 0 };
  }
};

export const calculateTimeMetrics = (rhythmData: any[]) => {
  const categoryTimes = {
    monthly: {},
    quarterly: {},
    annual: {}
  };

  rhythmData.forEach(section => {
    const category = section.title;
    
    section.items.forEach(item => {
      const multipliers = getFrequencyMultiplier(item.frequency);
      const duration = item.duration;

      ['monthly', 'quarterly', 'annual'].forEach(period => {
        if (!categoryTimes[period][category]) {
          categoryTimes[period][category] = 0;
        }
        categoryTimes[period][category] += duration * multipliers[period];
      });
    });
  });

  const calculatePeriodData = (periodTimes: Record<string, number>) => {
    const data = Object.entries(periodTimes).map(([name, minutes]) => ({ 
      name, 
      hours: Number((minutes / 60).toFixed(1))
    }));
    const total = Number((Object.values(periodTimes).reduce((a, b) => a + b, 0) / 60).toFixed(1));
    return { data, total };
  };

  return {
    monthly: calculatePeriodData(categoryTimes.monthly),
    quarterly: calculatePeriodData(categoryTimes.quarterly),
    annual: calculatePeriodData(categoryTimes.annual)
  };
};
