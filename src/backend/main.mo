import Array "mo:core/Array";
import List "mo:core/List";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";

import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";

// Migration setup

actor {
  include MixinStorage();

  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type SubscriptionTier = {
    #starter;
    #pro;
    #max;
  };

  public type UserProfile = {
    name : Text;
    subscriptionTier : SubscriptionTier;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access profile");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func upgradeSubscriptionTier(tier : SubscriptionTier) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can upgrade subscriptions");
    };

    switch (userProfiles.get(caller)) {
      case (null) {
        Runtime.trap("User profile not found. Please create a profile first.");
      };
      case (?profile) {
        let newProfile = { profile with subscriptionTier = tier };
        userProfiles.add(caller, newProfile);
      };
    };
  };

  public type Category = {
    name : Text;
  };

  public shared ({ caller }) func getDefaultCategories() : async [Category] {
    [
      { name = "All" },
      { name = "Gaming" },
      { name = "Sports" },
      { name = "Bikes" },
      { name = "Cars" },
      { name = "TCG" },
      { name = "Limited Editions" },
      { name = "Watches" },
      { name = "Pens" },
    ];
  };

  public type Product = {
    id : Nat;
    title : Text;
    description : Text;
    price : Nat;
    category : Text;
    photoUrl : Text;
    isAuction : Bool;
    sellerTier : SubscriptionTier;
  };

  let categoryMap = Map.empty<Text, List.List<Product>>();
  var productIdCounter = 0;

  public shared ({ caller }) func addProduct(
    title : Text,
    description : Text,
    price : Nat,
    category : Text,
    photoUrl : Text,
    isAuction : Bool,
  ) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can add products");
    };

    if (title == "") { Runtime.trap("Title cannot be empty") };
    if (description == "") { Runtime.trap("Description cannot be empty") };
    if (price == 0) { Runtime.trap("Price must be greater than 0") };
    if (category == "") { Runtime.trap("Category cannot be empty") };

    productIdCounter += 1;
    let sellerTier = switch (userProfiles.get(caller)) {
      case (null) { #starter };
      case (?profile) { profile.subscriptionTier };
    };

    let product : Product = {
      id = productIdCounter;
      title;
      description;
      price;
      category;
      photoUrl;
      isAuction;
      sellerTier;
    };

    let existingProducts = switch (categoryMap.get(category)) {
      case (null) { List.empty<Product>() };
      case (?products) { products };
    };
    existingProducts.add(product);
    categoryMap.add(category, existingProducts);
  };

  public query ({ caller }) func getCategoryProducts(categoryName : Text) : async [Product] {
    if (categoryName == "") { Runtime.trap("Category name cannot be empty") };

    let products = switch (categoryMap.get(categoryName)) {
      case (null) { List.empty<Product>() };
      case (?existingProducts) { existingProducts };
    };

    products.toArray();
  };

  public query ({ caller }) func getAllCategories() : async [Category] {
    categoryMap.keys().map(func(categoryName) { { name = categoryName : Text } }).toArray();
  };
};
