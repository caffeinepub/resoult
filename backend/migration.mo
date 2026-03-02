import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Nat "mo:core/Nat";

module {
  type OldActor = {
    userProfiles : Map.Map<Principal, OldUserProfile>;
    categoryMap : Map.Map<Text, List.List<OldProduct>>;
    productIdCounter : List.List<Nat>;
  };

  type OldUserProfile = {
    name : Text;
  };

  type OldProduct = {
    id : Nat;
    title : Text;
    description : Text;
    price : Nat;
    category : Text;
    photoUrl : Text;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, NewUserProfile>;
    categoryMap : Map.Map<Text, List.List<NewProduct>>;
    productIdCounter : Nat;
  };

  type NewUserProfile = {
    name : Text;
    subscriptionTier : SubscriptionTier;
  };

  type SubscriptionTier = {
    #starter;
    #pro;
    #max;
  };

  type NewProduct = {
    id : Nat;
    title : Text;
    description : Text;
    price : Nat;
    category : Text;
    photoUrl : Text;
    isAuction : Bool;
    sellerTier : SubscriptionTier;
  };

  public func run(old : OldActor) : NewActor {
    // Migrate user profiles to include subscription tier
    let newUserProfiles = old.userProfiles.map<Principal, OldUserProfile, NewUserProfile>(
      func(_id, oldProfile) {
        { oldProfile with subscriptionTier = #starter };
      }
    );

    // Migrate products to include auction and seller tier information
    let newCategoryMap = old.categoryMap.map<Text, List.List<OldProduct>, List.List<NewProduct>>(
      func(_category, oldProducts) {
        oldProducts.map<OldProduct, NewProduct>(
          func(oldProduct) {
            { oldProduct with isAuction = false; sellerTier = #starter };
          }
        );
      }
    );

    // Extract product ID counter from legacy list
    let newProductIdCounter : Nat = switch (old.productIdCounter.size()) {
      case (0) { 0 };
      case (size) {
        let allProducts = old.productIdCounter.toArray();
        allProducts[size - 1];
      };
    };

    {
      old with
      userProfiles = newUserProfiles;
      categoryMap = newCategoryMap;
      productIdCounter = newProductIdCounter;
    };
  };
};
