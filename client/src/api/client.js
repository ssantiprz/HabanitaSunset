const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
let onUnauthorized = null;
export const setUnauthorizedHandler = (fn) => { onUnauthorized = fn; };
export const fileUrl = (url) => url ? `${API_URL.replace('/api','')}${url}` : '';
async function request(path, options={}){
  const token = localStorage.getItem('token');
  const isForm = options.body instanceof FormData;
  const res = await fetch(`${API_URL}${path}`, { ...options, headers:{ ...(isForm ? {} : { 'Content-Type':'application/json' }), ...(token ? { Authorization:`Bearer ${token}` } : {}), ...options.headers } });
  if (res.status === 401 && onUnauthorized) onUnauthorized();
  const data = await res.json().catch(()=>({}));
  if (!res.ok) throw new Error(data.message || 'Error de comunicación');
  return data;
}
export const api = { get:(p)=>request(p), post:(p,b)=>request(p,{ method:'POST', body:b instanceof FormData ? b : JSON.stringify(b) }), patch:(p,b)=>request(p,{ method:'PATCH', body:JSON.stringify(b) }) };
