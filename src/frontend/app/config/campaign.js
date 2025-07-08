// Campaign configuration - centralized dates
export const CAMPAIGN_CONFIG = {
  startDate: new Date("2025-07-01T07:00:00Z"),
  endDate: new Date("2025-09-20T23:59:59Z"),
  
  // Helper methods
  getStartDateString: () => "2025-07-01",
  getEndDateString: () => "2025-09-20",
  
  isBeforeStart: (date) => {
    const checkDate = new Date(date);
    return checkDate < new Date("2025-07-01T00:00:00Z");
  },
  
  isAfterEnd: (date) => {
    const checkDate = new Date(date);
    return checkDate > new Date("2025-09-20T23:59:59Z");
  },
  
  isValidActivityDate: (date) => {
    return !CAMPAIGN_CONFIG.isBeforeStart(date) && !CAMPAIGN_CONFIG.isAfterEnd(date);
  }
};