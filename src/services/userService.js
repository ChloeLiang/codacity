import jwtDecode from 'jwt-decode';
import http from './httpService';
import { apiUrl } from '../config.json';

const apiEndpoint = apiUrl + '/users';
const tokenKey = 'token';

// Get rid of bi-directional dependencies between http and auth.
http.setJwt(getJwt());

export function register(user) {
  return http.post(apiEndpoint, {
    email: user.email,
    password: user.password,
  });
}

export function loginWithJwt(jwt) {
  localStorage.setItem(tokenKey, jwt);
}

export async function login(email, password) {
  const { data: jwt } = await http.post(apiEndpoint + '/login', {
    email,
    password,
  });

  loginWithJwt(jwt);
}

export function logout() {
  localStorage.removeItem(tokenKey);
}

export function getCurrentUser() {
  // Make sure to have a valid token in local storage.
  try {
    const jwt = localStorage.getItem(tokenKey);
    return jwtDecode(jwt);
  } catch (ex) {
    return null;
  }
}

export function getJwt() {
  return localStorage.getItem(tokenKey);
}

export default {
  register,
  loginWithJwt,
  login,
  logout,
  getCurrentUser,
  getJwt,
};
