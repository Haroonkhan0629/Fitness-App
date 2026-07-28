const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://nutrition-backend-qire.onrender.com';
export const API_URL = `${BACKEND_BASE_URL}/api/main_app/`;
export const AUTH_BASE_URL = `${BACKEND_BASE_URL}/api/auth/`;
export const TOKEN_REFRESH_URL = `${BACKEND_BASE_URL}/api/auth/token/refresh/`;
