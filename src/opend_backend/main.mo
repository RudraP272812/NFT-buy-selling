import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Nat8 "mo:base/Nat8";
import NFTActorClass "../NFT/nft";
import Cycles "mo:base/ExperimentalCycles";
import Debug "mo:base/Debug";
import HashMap "mo:base/HashMap";
import List "mo:base/List";


actor opend_backend {
  var mapOfnfts = HashMap.HashMap<Principal,NFTActorClass.NFT>(1,Principal.equal,Principal.hash);
  var mapOfOwners = HashMap.HashMap<Principal,List.List<Principal>>(1,Principal.equal,Principal.hash);
  public shared(msg) func mint (imgedata:[Nat8],name: Text):async Principal{
      let owner : Principal = msg.caller;
      Debug.print(debug_show(Cycles.balance()));
      Cycles.add(100_500_000_000);
      let newNft = await NFTActorClass.NFT(name,owner,imgedata);
       Debug.print(debug_show(Cycles.balance()));
      let newNFTprincipal = await newNft.getCanisterid();
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
};
