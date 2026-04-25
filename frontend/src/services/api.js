import axios from 'axios';

// Gunakan path relatif agar otomatis mengarah ke domain Vercel kamu
const API_URL = '/api'; 

export const getProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
  } catch (error) {
    console.error("Gagal mengambil menu:", error);
    return [];
  }
};