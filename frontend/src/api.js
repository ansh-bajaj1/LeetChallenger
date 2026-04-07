import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const createApi = (token) =>
  axios.create({
    baseURL: API_BASE,
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  });

export { API_BASE };
