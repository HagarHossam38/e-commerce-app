import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: 'product-details/:id', renderMode: RenderMode.Server },
  { path: 'category-filter/:id', renderMode: RenderMode.Server },
  { path: 'brands-filter/:id', renderMode: RenderMode.Server },
  {
    path: 'allorders',
    renderMode: RenderMode.Server   // SSR
  },
  {
    path: 'cart',
    renderMode: RenderMode.Server
  },
  {
    path: 'checkout',
    renderMode: RenderMode.Server
  },
  {
    path: 'wishlist',
    renderMode: RenderMode.Server
  },

  {
    path: '**',
    renderMode: RenderMode.Prerender
  },];
