import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import Layout from './components/Layout';
import BrowsePage from './pages/BrowsePage';
import AddProductPage from './pages/AddProductPage';
import ProfileSetupModal from './components/ProfileSetupModal';

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <ProfileSetupModal />
      <Outlet />
    </Layout>
  ),
});

const browseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: BrowsePage,
});

const addProductRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/add-product',
  component: AddProductPage,
});

const routeTree = rootRoute.addChildren([browseRoute, addProductRoute]);

const router = createRouter({ routeTree });

export default function App() {
  return <RouterProvider router={router} />;
}
