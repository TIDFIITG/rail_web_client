// src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'

import './index.css'
import "leaflet/dist/leaflet.css";
import App from './App.jsx'
import store from './store/index.js'

// --- PWA: register service worker (required for installability) ---
function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;

  // Prefer the standard sw.js at the site root (public/sw.js)
  const swUrl = '/sw.js';

  // Register after the page loads to avoid blocking first paint
  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register(swUrl);

      // Optional: auto-reload when a new SW takes control (smooth updates)
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        refreshing = true;
        // reload to get the fresh assets
        window.location.reload();
      });

      // Optional: if a new SW is waiting, ask it to activate immediately
      if (reg.waiting) {
        reg.waiting.postMessage({ type: 'SKIP_WAITING' });
      }

      // If using vite-plugin-pwa in dev with devOptions.enabled = true,
      // the plugin serves a dev SW under a different URL. No change needed.
      // This fallback is here only if someone removed sw.js:
      // (Commented out intentionally to keep things simple)
      // catch { await navigator.serviceWorker.register('/dev-sw.js?dev-sw'); }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('SW registration failed:', err);
    }
  });
}
// Commenting service worker registration in dev to avoid stale cached bundles.
// registerServiceWorker();
// --- end PWA setup ---

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Provider store={store}>
        <App />
      </Provider>
    </Router>
  </StrictMode>
)
