import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { LazyMotion, domAnimation, MotionConfig } from 'framer-motion'
import { AriaLiveProvider } from './components/AriaLive'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">
        <AriaLiveProvider>
          <App />
        </AriaLiveProvider>
      </MotionConfig>
    </LazyMotion>
  </StrictMode>,
)
