import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import Layout from './components/Layout';
import BrowsePage from './pages/BrowsePage';
import AddProductPage from './pages/AddProductPage';
import PlansPage from './pages/PlansPage';
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

const plansRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/plans',
  component: PlansPage,
});

const routeTree = rootRoute.addChildren([browseRoute, addProductRoute, plansRoute]);

const router = createRouter({ routeTree });

export default function App() {
  return <RouterProvider router={router} />;
}
