import React, { useState } from 'react';
import Layout from '@/components/layout';
import axios from 'axios';
const ProteinCalculator = () => {
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [proteinResult, setProteinResult] = useState(null);
  const [error, setError] = useState('');
  const [showResult, setShowResult] = useState(false);

  const handleSubmit = async (e) => {
    console.log('handleSubmit called');
    e.preventDefault();
    setError(''); // Clear previous errors on new submission
    setProteinResult(null); // Clear previous result

    console.log('Before axios.post');
    // Removed the misplaced console.log from here
    try {
      // Convert string inputs to numbers
      const numericAge = parseFloat(age);
      const numericHeight = parseFloat(height);
      const numericWeight = parseFloat(weight);
      console.log('Sending data:', { gender, age: numericAge, height: numericHeight, weight: numericWeight, activityLevel }); // Added log for sent data
      console.log('API endpoint:', 'http://localhost:5000/calculator/calculate'); // Added log for API endpoint
      const response = await axios.post('http://localhost:5000/calculator/calculate', { 
        gender, age: numericAge, height: numericHeight, weight: numericWeight, activityLevel,
      });
      setProteinResult(response.data.recommendedProtein);
      setShowResult(true);
      setError(''); // Clear any previous errors
      console.log('After axios.post');
    } catch (error) {
      console.error('Error calculating protein:', error);
      setError('Failed to calculate protein. Please try again.'); // Set an error message      
    }
  };

  const handleBack = () => {
    setShowResult(false);
    setProteinResult(null);
    setGender('');
    setAge('');
    setHeight('');
    setWeight('');
    setActivityLevel('');
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Protein Calculator</h1>
        {!showResult ? (
          <div className="bg-white p-6 rounded-lg shadow-md w-96 mx-auto">
            {error && <div className="text-red-500 mb-4">{error}</div>} {/* Display error message */}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="gender">
                  Jenis Kelamin
                </label>
                <select
                  id="gender"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                >
                  <option value="">Pilih Jenis Kelamin</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="age">
                  Umur
                </label>
                <input
                  type="number"
                  id="age"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  placeholder="18 - 80"
                  value={age}
                  onChange={(e) => setAge(e.target.value)} // Keeping as string state for input
                  min="18"
                  max="80"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="height">
                  Tinggi
                </label>
                <input
                  type="number"
                  id="height"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  placeholder="Sentimeter"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="weight">
                  Berat
                </label>
                <input
                  type="number"
                  id="weight"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  placeholder="Kilogram"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 mb-2" htmlFor="activityLevel">
                  Level Aktivitas
                </label>
                <select
                  id="activityLevel"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value)}
                  required
                >
                  <option value="aktivitasMinimal">Berapa kali olahraga dalam seminggu</option>
                  <option value="aktivitasRendah">Rendah (1-3 hari/minggu)</option>
                  <option value="aktivitasSedang">Sedang (3-5 hari/minggu)</option>
                  <option value="aktivitasTinggi">Tinggi (6-7 hari/minggu)</option>
                  <option value="aktivitasSangatTinggi">Sangat Tinggi (Olahraga Sangat Intens Setiap Hari)</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
              >
                Simpan
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md w-96 mx-auto text-center">
            <div className="text-6xl font-bold mb-4">{proteinResult}</div>
            <div className="text-xl mb-6">gram</div>
            <div className="text-lg mb-6">Total Protein Yang Perlu Anda Konsumsi Dalam 1 Hari</div>
            <button
              onClick={handleBack}
              className="w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
            >
              Kembali
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProteinCalculator;