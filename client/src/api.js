import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

export const checkInHabitRequest = (habitId, todayStr) => 
  API.post(`/habits/${habitId}/checkin`, { todayStr });