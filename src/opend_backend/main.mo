import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Nat8 "mo:base/Nat8";
import NFTActorClass "../NFT/nft";
import Cycles "mo:base/ExperimentalCycles";
import Debug "mo:base/Debug";
import HashMap "mo:base/HashMap";
import List "mo:base/List";
import Nat "mo:base/Nat";
import Bool "mo:base/Bool";

actor opend_backend {
  private type Listing = 
  {
    itemOwner :Principal;
    itemPrice : Nat;
  };
  var mapOfnfts = HashMap.HashMap<Principal,NFTActorClass.NFT>(1,Principal.equal,Principal.hash);
  var mapOfOwners = HashMap.HashMap<Principal,List.List<Principal>>(1,Principal.equal,Principal.hash);
  var mapOflisting = HashMap.HashMap<Principal,Listing>(1,Principal.equal,Principal.hash);
  public shared(msg) func mint (imgedata:[Nat8],name: Text):async Principal{
      var owner : Principal = msg.caller;
      // Debug.print(debug_show(Cycles.balance()));
      Cycles.add(100_500_000_000_000_000);
      var newNft = await NFTActorClass.NFT(name,owner,imgedata);
      //  Debug.print(debug_show(Cycles.balance()));
      var newNFTprincipal = await newNft.getCanisterid();
      mapOfnfts.put(newNFTprincipal,newNft);
      addToOwnershipMap(owner, newNFTprincipal);
      return newNFTprincipal;
  };
  private func addToOwnershipMap(owner:Principal,nftId:Principal){
    var ownedNft : List.List<Principal> = switch( mapOfOwners.get(owner)){
      case null List.nil<Principal>();
      case (?result) result;
    };
    ownedNft := List.push(nftId,ownedNft);
    mapOfOwners.put(owner,ownedNft);
  };
  public query func getOwnedNFTs(user:Principal):async [Principal]{
      var userNft : List.List<Principal> = switch( mapOfOwners.get(user)){
      case null List.nil<Principal>();
      case (?result) result;
    };
    return List.toArray(userNft);
  };

  public shared (msg) func listItem(id:Principal,price:Nat) : async Text{
        var items :NFTActorClass.NFT = switch(mapOfnfts.get(id)) {
          case null return "NFT does Not exist.";
          case(?result) result;
        };
        let owner = await items.getOwner();
        if(Principal.equal(owner,msg.caller)){
            let newlisting : Listing = {
               itemOwner = owner;
              itemPrice = price;
            };
            mapOflisting.put(id,newlisting);
            return"success";
        }else{
          return"you are not the owner";
        }  
  };
  public query func getOpendCanisterID() :async Principal {
    return Principal.fromActor(opend_backend);
  };
  public query func isListed(id:Principal):async Bool{
    if(mapOflisting.get(id)==null){
      return false;
    }
    else{
      return true;
    }
  };
};
