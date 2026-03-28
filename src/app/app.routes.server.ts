import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }, { path: '/product-details/:id', renderMode: RenderMode.Server },
  { path: '/category-filter/:id', renderMode: RenderMode.Server },
  { path: '/brands-filter/:id', renderMode: RenderMode.Server },
];
