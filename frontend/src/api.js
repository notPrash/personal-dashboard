import axios from 'axios';
const API = process.env.REACT_APP_API_URL || 'http://localhost:4000';
const client = axios.create({ baseURL: API });

export const signup = (data) => client.post('/auth/signup', data).then(r => r.data);
export const login = (data) => client.post('/auth/login', data).then(r => r.data);
export const me = (token) =>
  client.get('/auth/me', {
    headers: { Authorization: 'Bearer ' + token }
  }).then(r => r.data);
