const { con } = require('../../database');

const calculateProtein = async (req, res) => {
  const { user_id, gender, age, height, weight, activityLevel } = req.body;

  // --- Input Validation (No changes needed here) ---
  if (!user_id || !gender || !age || !height || !weight || !activityLevel) {
    return res.status(400).json({ error: 'Input tidak lengkap: user_id, jenis kelamin, usia, tinggi badan, berat badan, dan tingkat aktivitas semuanya wajib diisi.' });
  }
  if (typeof age !== 'number' || typeof height !== 'number' || typeof weight !== 'number') {
    return res.status(400).json({ error: 'Usia, tinggi badan, dan berat badan harus berupa angka.' });
  }
  if (age < 18 || age > 80) {
    return res.status(400).json({ error: 'Usia harus antara 18 dan 80 tahun.' });
  }
  if (height <= 0 || weight <= 0 || height > 300 || weight > 1000) {
    return res.status(400).json({ error: 'Tinggi badan dan berat badan harus bernilai positif.' });
  }
  if (gender !== 'Laki-laki' && gender !== 'Perempuan') {
    return res.status(400).json({ error: 'Jenis kelamin harus "Laki-laki" atau "Perempuan".' });
  }

  // --- Protein Calculation (Revised Logic based on Body Weight & Activity Level) ---
  // This is a more direct and scientifically accepted method.
  
  let proteinMultiplier;

  // We set the protein multiplier (in grams per kg of body weight) based on activity level.
  switch (activityLevel) {
    case 'aktivitasMinimal':
    case 'aktivitasRendah':
      // For sedentary or lightly active individuals, 1.2-1.4g/kg is recommended for health.
      proteinMultiplier = 1.2;
      break;
    case 'aktivitasSedang':
      // For moderately active individuals.
      proteinMultiplier = 1.5;
      break;
    case 'aktivitasTinggi':
    case 'aktivitasSangatTinggi':
      // For highly active individuals, needs are higher for recovery and muscle repair.
      proteinMultiplier = 2.0;
      break;
    default:
      return res.status(400).json({ error: 'Tingkat aktivitas tidak valid' });
  }

  // Calculate the final recommended protein based on weight
  const recommendedProtein = weight * proteinMultiplier;

  // Round protein value to the nearest integer for the database.
  const proteinValue = Math.round(recommendedProtein);

  // --- Database Update ---
  const updateQuery = `
    UPDATE users
    SET gender = ?, age = ?, height = ?, weight = ?, activityLevel = ?, protein = ?
    WHERE id = ?
  `;

  try {
    // Use the promise-wrapped query for async/await
    await con.promise().query(updateQuery, [gender, age, height, weight, activityLevel, proteinValue, user_id]);
    
    console.log(`User ${user_id} protein data updated successfully. Recommended protein: ${proteinValue}g`);
    
    // Send the calculated value in the response
    res.json({ recommendedProtein: proteinValue });

  } catch (err) {
    console.error('Error updating user protein data:', err);
    res.status(500).json({ error: 'Failed to calculate protein. Please try again.' });
  }
};

const getProtein = async (req, res) => {
  console.log(`Received request for user ID: ${req.params.userId}`);
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required.' });
  }

  const selectQuery = `
    SELECT protein FROM users WHERE id = ?
  `;

  try {
    const [rows] = await con.promise().query(selectQuery, [userId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }
    console.log(`Protein value fetched: ${rows[0].protein}`);
    res.json({ protein: rows[0].protein });
  } catch (err) {
    console.error('Error fetching user protein data:', err);
    res.status(500).json({ error: 'Failed to fetch protein data.' });
  }
};

module.exports = {
  calculateProtein,
  getProtein,
};