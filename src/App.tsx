import React from 'react'
import './App.css'
import AppRouter from './router/AppRouter'
import { Toaster } from "@/components/ui/sonner"
import { useFirebaseMessaging } from './hooks/useFirebaseMessaging';
import { NotificationProvider } from "./context/NotificationContext";
import { BrowserRouter } from 'react-router-dom';

const App: React.FC = () => {
  useFirebaseMessaging();
  return (
    <BrowserRouter>
      <NotificationProvider>
        <div className='bg-[linear-gradient(to_right,#522157,#53A6D8)]'>
          <AppRouter/>
          <Toaster richColors position="top-right" />
        </div>
      </NotificationProvider>
    </BrowserRouter>
  )
}

export default App
