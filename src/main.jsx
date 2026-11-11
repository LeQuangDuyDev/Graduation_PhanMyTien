import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import Silk from './components/Silk'
import './index.css'
createRoot(document.getElementById('root')).render(<><Silk /><App /></>)
