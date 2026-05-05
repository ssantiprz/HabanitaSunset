import { createContext, useContext, useState } from 'react';
const ToastContext = createContext(null);
export function ToastProvider({ children }){ const [toast,setToast]=useState(null); const notify=(message,type='ok')=>{ setToast({ message,type }); setTimeout(()=>setToast(null),3200); }; return <ToastContext.Provider value={notify}>{children}{toast && <div className={`fixed bottom-4 right-4 z-50 rounded-xl px-4 py-3 text-sm font-semibold shadow-lg ${toast.type==='error'?'bg-red-600':'bg-slate-900'} text-white`}>{toast.message}</div>}</ToastContext.Provider>; }
export const useToast=()=>useContext(ToastContext);
