import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom"
import { Provider } from "react-redux"
import { store } from "./redux/store"

import Lenis from "lenis"

import './index.css'
import App from './App.jsx'
import "leaflet/dist/leaflet.css";

// // Initialize Lenis
// const lenis = new Lenis();

// // Use requestAnimationFrame to continuously update the scroll
// function raf(time) {
//   lenis.raf(time* 0.7);
//   requestAnimationFrame(raf);
// }

// requestAnimationFrame(raf);

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Provider store={store}>
        <App />
    </Provider >
  </BrowserRouter>,
)
