import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";

actor {
  include MixinStorage();

  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User profile system
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Product listing system
  let categoryMap = Map.empty<Text, List.List<Product>>();
  let productIdCounter = List.fromArray<Nat>([0]);

  type Product = {
    id : Nat;
    title : Text;
    description : Text;
    price : Nat;
    category : Text;
  };

  public shared ({ caller }) func addProduct(title : Text, description : Text, price : Nat, category : Text) : async () {
    // Authorization: Only authenticated users can add products
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add products");
    };

    if (title == "") { Runtime.trap("Title cannot be empty") };
    if (description == "") { Runtime.trap("Description cannot be empty") };
    if (price == 0) { Runtime.trap("Price must be greater than 0") };
    if (category == "") { Runtime.trap("Category cannot be empty") };

    let newId = productIdCounter.size() + 1;
    let product : Product = {
      id = newId;
      title;
      description;
      price;
      category;
    };

    let existingProducts = switch (categoryMap.get(category)) {
      case (null) { List.empty<Product>() };
      case (?products) { products };
    };
    existingProducts.add(product);
    categoryMap.add(category, existingProducts);

    productIdCounter.clear();
    productIdCounter.add(newId);
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

  type Category = {
    name : Text;
  };
};
