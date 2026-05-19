import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { PrototypeStateProvider } from '@/prototype/state'

import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrototypeStateProvider>
      <App />
    </PrototypeStateProvider>
  </StrictMode>,
)
