const calculateProtein = (gender, age, height, weight, activityLevel) => {
  // Basic input validation
  if (!gender || !age || !height || !weight || !activityLevel) {
    throw new Error('Missing required fields: gender, age, height, weight, and activity level are all required.');
  }

  if (typeof age !== 'number' || typeof height !== 'number' || typeof weight !== 'number') {
    throw new Error('Age, height, and weight must be numbers.');
  }

  if (age < 18 || age > 80) {
    throw new Error('Age must be between 18 and 80');
  }

  if (height <= 0 || weight <= 0 || height > 300 || weight > 1000) { // Added upper bounds
    throw new Error('Height and weight must be positive values');
  }

  if (gender !== 'male' && gender !== 'female') {
    throw new Error('Gender must be either "male" or "female".');
  }

  // Simple protein calculation based on weight and activity level
  // Activity levels (example multipliers):
  // - Sedentary (little to no exercise): 1.2
  // - Lightly active (exercise 1-3 days/week): 1.375
  // - Moderately active (exercise 3-5 days/week): 1.55
  // - Very active (exercise 6-7 days/week): 1.725
  // - Extra active (very intense exercise or a physically demanding job): 1.9

  let activityMultiplier;
  switch (activityLevel) {
    case 'sedentary': activityMultiplier = 0.8; break; // Corresponds to 0.8 g/kg
    case 'minimally active': activityMultiplier = 1.0; break; // Corresponds to 1.0 g/kg
    case 'moderately active': activityMultiplier = 1.2; break; // Corresponds to 1.2 g/kg
    case 'very active': activityMultiplier = 1.5; break; // Corresponds to 1.5 g/kg
    case 'extremely active': activityMultiplier = 2.0; break; // Corresponds to 2.0 g/kg
    default: throw new Error('Invalid activity level');
  }

  let recommendedProtein = weight * activityMultiplier;

  // Adjust for gender (women might need slightly less)
  if (gender === 'female') {
    recommendedProtein *= 0.9; // Reduce protein intake for women by 10% as an example
  }

  // Round to a reasonable number of decimal places
  recommendedProtein = Math.round(recommendedProtein * 10) / 10;

  return recommendedProtein;
};

module.exports = {
  calculateProtein,
};