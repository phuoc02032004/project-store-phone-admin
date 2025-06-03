import React from 'react'
import './App.css'
import AppRouter from './router/AppRouter'
import { Toaster } from "@/components/ui/sonner"

const App: React.FC = () => {

  return (
    <div className='bg-[linear-gradient(to_right,#522157,#53A6D8)]'>
      <AppRouter/>
      <Toaster richColors position="top-right" />
    </div>
  )
}

export default App
