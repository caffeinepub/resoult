import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Product {
    id: bigint;
    title: string;
    description: string;
    photoUrl: string;
    sellerTier: SubscriptionTier;
    category: string;
    price: bigint;
    isAuction: boolean;
}
export interface Category {
    name: string;
}
export interface UserProfile {
    name: string;
    subscriptionTier: SubscriptionTier;
}
export enum SubscriptionTier {
    max = "max",
    pro = "pro",
    starter = "starter"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addProduct(title: string, description: string, price: bigint, category: string, photoUrl: string, isAuction: boolean): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllCategories(): Promise<Array<Category>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCategoryProducts(categoryName: string): Promise<Array<Product>>;
    getDefaultCategories(): Promise<Array<Category>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    upgradeSubscriptionTier(tier: SubscriptionTier): Promise<void>;
}
