import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import Layout from "./components/Layout";
import ProfileSetupModal from "./components/ProfileSetupModal";
import AddProductPage from "./pages/AddProductPage";
import BrowsePage from "./pages/BrowsePage";
import PlansPage from "./pages/PlansPage";

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
  path: "/",
  component: BrowsePage,
});

const addProductRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/add-product",
  component: AddProductPage,
});

const plansRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/plans",
  component: PlansPage,
});

const routeTree = rootRoute.addChildren([
  browseRoute,
  addProductRoute,
  plansRoute,
]);

const router = createRouter({ routeTree });

export default function App() {
  return <RouterProvider router={router} />;
}
