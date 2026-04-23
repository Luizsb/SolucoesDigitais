import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import appleTouchIcon from './assets/apple-touch-icon.png';
import brandIconSvg from './assets/brand-icon.svg';
import faviconPng from './assets/favicon-32.png';
import App from './App.tsx';
import './index.css';

function upsertHeadLink(id: string, rel: string, href: string, attrs: Record<string, string>) {
  let el = document.getElementById(id) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.id = id;
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
  for (const [k, v] of Object.entries(attrs)) {
    el.setAttribute(k, v);
  }
}

upsertHeadLink('portfolio-favicon-png', 'icon', faviconPng, {
  type: 'image/png',
  sizes: '32x32',
});
upsertHeadLink('portfolio-favicon-svg', 'icon', brandIconSvg, {
  type: 'image/svg+xml',
});
upsertHeadLink('portfolio-apple-touch', 'apple-touch-icon', appleTouchIcon, {
  sizes: '180x180',
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
