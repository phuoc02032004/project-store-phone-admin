import React from 'react'
import './App.css'
import AppRouter from './router/AppRouter'
import { Toaster } from "@/components/ui/sonner"
import { useFirebaseMessaging } from './hooks/useFirebaseMessaging';
import { NotificationProvider } from "./context/NotificationContext";
import { BrowserRouter } from 'react-router-dom';

const App: React.FC = () => {

  if ( !localStorage.getItem('tokenAdmin')) {
    console.log("No token found, using Firebase Messaging");
  } else {
    useFirebaseMessaging();
  }
  
  return (
    <BrowserRouter>
      <NotificationProvider>
        <div className='bg-[linear-gradient(to_right,#A5CAD2,#FF7B89)]'>
          <AppRouter/>
          <Toaster richColors position="top-right" />
        </div>
      </NotificationProvider>
    </BrowserRouter>
  )
}

export default App
