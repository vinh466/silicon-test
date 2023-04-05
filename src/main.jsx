import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './assets/styles/index.css'
import { CssBaseline, ThemeProvider } from '@mui/material'
import globalTheme from './utils/globalTheme'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={globalTheme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)
