import './polyfills.js'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRoutes from './AppRoutes.jsx'

createRoot(document.getElementById('root')).render(
    <AppRoutes />
)
