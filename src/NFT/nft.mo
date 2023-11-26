import Debug "mo:base/Debug";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Nat8 "mo:base/Nat8";
// actor class NFT(name:Text, owner:Principal,content:[Nat8]){
//     let iteName = name;
//     let nftOwner = owner;
//     let imageByte = content;
//     public query func getName() : async Text {
//         return iteName;
//     };
//     public query func getOwner() : async Principal {
//         return nftOwner;
//     };
//     public query func getAsset() : async [Nat8] {
//         return imageByte;
//     };
// };
actor class NFT(name:Text,owner:Principal,content:[Nat8]){
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
};
