import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const getProducts = async () => {
    try {
        const response = await axios.get(`${API_URL}/products`);
        return response.data;
    } catch (error) {
        console.error("Gagal mengambil menu:", error);
        return [];
    }
};