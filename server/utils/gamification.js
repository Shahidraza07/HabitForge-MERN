// Formulas and math operations isolated from routes
const XP_CONSTANT = 0.4; // Level = sqrt(XP) * Constant

/**
 * Calculates current level based on total XP using required assignment formula
 * XP = (Level / Constant)^2 => Level = sqrt(XP) * Constant
 */
exports.calculateLevelFromXp = (totalXp) => {
  if (!totalXp || totalXp <= 0) return 1;
  const computedLevel = Math.floor(Math.sqrt(totalXp) * XP_CONSTANT);
  return computedLevel < 1 ? 1 : computedLevel;
};

/**
 * Validates streak progression logic based on server standard timezone strings
 */
exports.updateStreakLogic = (lastCompletedDateStr, todayStr, currentStreak = 0) => {
  if (!lastCompletedDateStr) {
    return { newStreak: 1, shouldIncrement: true };
  }

  const lastDate = new Date(lastCompletedDateStr);
  const todayDate = new Date(todayStr);
  
  // Calculate difference in days
  const diffTime = Math.abs(todayDate - lastDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    return { newStreak: currentStreak + 1, shouldIncrement: true };
  } else if (diffDays === 0) {
    return { newStreak: currentStreak, shouldIncrement: false }; // Already updated today
  } else {
    return { newStreak: 1, shouldIncrement: true }; // Missed days gap -> Reset to baseline
  }
};

/**
 * Achievement listeners evaluated during run-time executions
 */
exports.evaluateEarnedBadges = (userMetrics, existingBadges = []) => {
  const potentialBadges = [];
  
  if (userMetrics.maxStreak >= 7 && !existingBadges.includes("Consistency King")) {
    potentialBadges.push("Consistency King");
  }
  if (userMetrics.totalCompletions >= 1 && !existingBadges.includes("First Steps")) {
    potentialBadges.push("First Steps");
  }
  if (userMetrics.level >= 5 && !existingBadges.includes("Elite Overlord")) {
    potentialBadges.push("Elite Overlord");
  }

  return potentialBadges;
};