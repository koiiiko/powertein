const con = require('../../database'); // Assuming the database connection is exported from database.js

const calculateProtein = async (req, res) => {
  const { gender, age, height, weight, activityLevel } = req.body;

  // Basic input validation
  if (!gender || !age || !height || !weight || !activityLevel) {
    return res.status(400).json({ error: 'Input tidak lengkap: jenis kelamin, usia, tinggi badan, berat badan, dan tingkat aktivitas semuanya wajib diisi.' });
  }

  if (typeof age !== 'number' || typeof height !== 'number' || typeof weight !== 'number') {
    return res.status(400).json({ error: 'Usia, tinggi badan, dan berat badan harus berupa angka.' });
  }

  if (age < 18 || age > 80) {
    return res.status(400).json({ error: 'Usia harus antara 18 dan 80 tahun.' });
  }

  if (height <= 0 || weight <= 0 || height > 300 || weight > 1000) { // Added upper bounds
    return res.status(400).json({ error: 'Tinggi badan dan berat badan harus bernilai positif.' });
  }

  if (gender !== 'Laki-laki' && gender !== 'Perempuan') {
    return res.status(400).json({ error: 'Jenis kelamin harus "Laki-laki" atau "Perempuan".' });
  }

  // Mifflin-St Jeor Equation for BMR
  let bmr;
  if (gender === 'Laki-laki') {
    bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
  } else { // Perempuan
    bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
  }

  // Activity Level Multipliers (Harris-Benedict Principle based)
  let activityMultiplier;
  switch (activityLevel) {
    case 'aktivitasMinimal': activityMultiplier = 1.2; break;
    case 'aktivitasRendah': activityMultiplier = 1.375; break;
    case 'aktivitasSedang': activityMultiplier = 1.55; break;
    case 'aktivitasTinggi': activityMultiplier = 1.725; break;
    case 'aktivitasSangatTinggi': activityMultiplier = 1.9; break;
    default: return res.status(400).json({ error: 'Tingkat aktivitas tidak valid' });
  }

  // Total Daily Energy Expenditure (TDEE)
  const tdee = bmr * activityMultiplier;

  // Recommended Protein Intake (example: 20% of total calories)
  // 1 gram of protein has approximately 4 calories
  const recommendedProtein = (tdee * 0.20) / 4;

  const userId = req.user.id; // Assuming user ID is available on req.user.id from authentication middleware

  // Update the user's row in the database
  const updateQuery = `
    UPDATE users
    SET gender = ?, age = ?, height = ?, weight = ?, activityLevel = ?, protein = ?
    WHERE id = ?
  `;

  const proteinValue = Math.round(recommendedProtein * 10) / 10;

  try {
    await con.promise().query(updateQuery, [gender, age, height, weight, activityLevel, proteinValue, userId]);
    console.log(`User ${userId} protein data updated successfully.`);
    res.json({ recommendedProtein: proteinValue });
  } catch (err) {
    console.error('Error updating user protein data:', err);
    res.status(500).json({ error: 'Failed to save protein data.' });
  }
};

module.exports = {
  calculateProtein,
};