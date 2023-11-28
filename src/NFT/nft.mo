import Debug "mo:base/Debug";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Nat8 "mo:base/Nat8";
// Define a record type for options

actor class NFT(name:Text,owner:Principal,content:[Nat8]) = this{
    let iteName = name;
    let nftOwner = owner;
    let imageByte = content;
    public query func getName() : async Text {
        return iteName;
    };
    public query func getOwner() : async Principal {
        return nftOwner;
    };
    public query func getAsset() : async [Nat8] {
        return imageByte;
    };
     public query func getCanisterid() : async Principal{
        return Principal.fromActor(this);
     }
};
