import React from 'react'
import './App.css'
import AppRouter from './router/AppRouter'
import { Toaster } from "@/components/ui/sonner"

const App: React.FC = () => {

  return (
    <>
      <AppRouter />
      <Toaster richColors position="top-right" />
    </>
  )
}

export default App
