const { con } = require("../../database");
const {
  getFoodListSearch,
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
    res.status(201).json({ message: "Data konsumsi berhasil disimpan!" });
  } catch (error) {
    console.error("Error storing consume record:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

// Display user consume list today
const displayUserConsumeToday = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res
      .status(400)
      .json({ message: "Tidak dapat menemukan id pengguna!" });
  }

  try {
    const data = await getUserConsumeToday(userId);
    res.status(200).json({
      message: "Berhasil mengambil data konsumsi hari ini!",
      data: data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message:
        "Terjadi kesalahan pada server, gagal mengambil data konsumsi hari ini.",
    });
  }
};

// Display summarized record per period
const displayUserConsumeHistory = async (req, res) => {
  const { userId } = req.query;
  const { period } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "ID pengguna tidak ditemukan" });
  }

  if (!period) {
    return res.status(400).json({ message: "Harap memasukkan periode data." });
  }

  try {
    const historyData = await getConsumeRecordByPeriod(
      userId,
      parseInt(period)
    );

    res.status(200).json({
      message: `Berhasil mengambil data untuk ${period} hari terakhir.`,
      period: period,
      data: historyData,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Gagal mengambil data, terjadi kesalahan pada server" });
  }
};

// Display record details per timestamp
const displayUserConsumeDetails = async (req, res) => {
  const { timestamp, userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "ID pengguna tidak ditemukan" });
  }

  if (!timestamp) {
    return res
      .status(400)
      .json({ message: "Harap memasukkan tanggal pada data." });
  }

  try {
    const detailsData = await getConsumeRecordByTimestamp(userId, timestamp);
    res.status(200).json({
      message: "Berhasil mengambil data!",
      data: detailsData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Gagal mengambil data, terjadi kesalahan pada server!",
    });
  }
};

// Delete user consume record
const deleteUserConsume = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "ID tidak boleh kosong!" });
  }

  try {
    await deleteConsumeRecord(id);
    res.status(204).json({ message: "Data konsumsi berhasil dihapus!" });
  } catch (error) {
    console.error("Error deleting consume record:", error);
    res.status(500).json({ message: "Gagal menghapus data konsumsi!" });
  }
};

module.exports = {
  fetchFoodListSearch,
  saveUserConsume,
  displayUserConsumeToday,
  displayUserConsumeHistory,
  displayUserConsumeDetails,
  deleteUserConsume,
};
