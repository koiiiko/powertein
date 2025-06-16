const { con } = require("../../database");
const {
  getFoodListSearch,
  getProteinUser,
  storeConsumeRecord,
  getUserConsumeToday,
  getConsumeRecordByPeriod,
  getConsumeRecordByTimestamp,
  deleteConsumeRecord,
} = require("./models");

// Fetch food list based on search query
const fetchFoodListSearch = async (req, res) => {
  const search = req.query.query;

  try {
    const foodList = await getFoodListSearch(search);
    res.json(foodList);
  } catch (error) {
    console.error("Error searching food list:", error);
    res.status(500).json({ message: "Gagal mengambil data makanan" });
  }
};

// Post user consume record
const saveUserConsume = async (req, res) => {
  const { userId, nama_makanan, porsi, protein } = req.body;

  if (!userId || !nama_makanan || !porsi || !protein) {
    return res
      .status(400)
      .json({ message: "Mohon untuk melengkapi data input!" });
  }

  try {
    await storeConsumeRecord(userId, nama_makanan, porsi, protein);
    res.status(200).json({ message: "Data konsumsi berhasil disimpan!" });
  } catch (error) {
    console.error("Error storing consume record:", error);
    res.status(500).json({ message: "Gagal menyimpan data konsumsi!" });
  }
};

// Display user consume list today
const userConsumeToday = async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: "Harap memasukkan user id!" });
  }

  try {
    const records = await getConsumeRecordByPeriod(userId, "today");
    res.json(records);
  } catch (error) {
    console.error("Error fetching today's consume records:", error);
    res
      .status(500)
      .json({ message: "Gagal mengambil data konsumsi hari ini!" });
  }
};

// Display summarized record per period

// Display record details per timestamp

// Delete user consume record
const deleteUserConsume = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "ID tidak boleh kosong!" });
  }

  try {
    await deleteConsumeRecord(id);
    res.status(200).json({ message: "Data konsumsi berhasil dihapus!" });
  } catch (error) {
    console.error("Error deleting consume record:", error);
    res.status(500).json({ message: "Gagal menghapus data konsumsi!" });
  }
};

module.exports = {
  fetchFoodListSearch,
  saveUserConsume,
  userConsumeToday,
  deleteUserConsume,
};
