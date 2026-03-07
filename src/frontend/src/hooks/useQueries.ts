import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Category, Product, UserProfile } from "../backend";
import type { SubscriptionTier } from "../backend";
import { useActor } from "./useActor";

export function useGetAllCategories() {
  const { actor, isFetching } = useActor();

  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getDefaultCategories();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCategoryProducts(categoryName: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ["products", "category", categoryName],
    queryFn: async () => {
      if (!actor || !categoryName) return [];
      return actor.getCategoryProducts(categoryName);
    },
    enabled: !!actor && !isFetching && !!categoryName,
  });
}

export function useGetAllProducts() {
  const { actor, isFetching } = useActor();
  const { data: categories } = useGetAllCategories();

  return useQuery<Product[]>({
    queryKey: ["products", "all"],
    queryFn: async () => {
      if (!actor || !categories) return [];

      const allProducts: Product[] = [];
      // Filter out "All" category and fetch products from actual categories
      const actualCategories = categories.filter((cat) => cat.name !== "All");

      for (const category of actualCategories) {
        const products = await actor.getCategoryProducts(category.name);
        allProducts.push(...products);
      }

      return allProducts;
    },
    enabled: !!actor && !isFetching && !!categories,
  });
}

export function useAddProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      title: string;
      description: string;
      price: bigint;
      category: string;
      photoUrl?: string;
      isAuction?: boolean;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addProduct(
        params.title,
        params.description,
        params.price,
        params.category,
        params.photoUrl || "",
        params.isAuction ?? false,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Actor not available");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

export function useUpgradeSubscriptionTier() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tier: SubscriptionTier) => {
      if (!actor) throw new Error("Actor not available");
      return actor.upgradeSubscriptionTier(tier);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}
