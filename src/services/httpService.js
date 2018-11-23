import axios from 'axios';
import { toast } from 'react-toastify';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.response.use(null, error => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (!expectedError) {
    toast.error('An unexpected error occurrred.');
  }

  return Promise.reject(error);
});

// To prevent bi-directional dependencies between http and auth.
function setJwt(jwt) {
  // Set default headers for authorization when sending any request to the server.
  axios.defaults.headers.common['x-auth'] = jwt;
}

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  setJwt,
};
