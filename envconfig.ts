const baseURL =
  process.env.EXPO_BACKEND_API_BASE_URL ||
  'https://pawsibilities-api.onrender.com/api';

if (!baseURL) {
  console.warn('Warning: API_URL environment variable is not defined.');
} else {
  console.log('API_URL:', baseURL);
}

export default {
  baseURL,
};
