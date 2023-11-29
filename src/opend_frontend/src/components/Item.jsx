import React, { useEffect, useState } from "react";
import { HttpAgent } from "../../../../node_modules/@dfinity/agent";
import { Actor } from "../../../../node_modules/@dfinity/agent/lib/cjs/actor";
import { idlFactory } from "../../../declarations/nft/index";
import { Principal } from "../../../../node_modules/@dfinity/principal";

function Item(props) {
  const[name,setname] = useState("");
  const[owner,setowner] = useState("");
  const[logos,setlogos] = useState();
  const id = props.id;
  const localHost = "http://localhost:8080/";

  const agent =  new HttpAgent({
    host:localHost, 
    verifyQuerySignatures: false,
  });
                 
  async function loadNft() {
    const NFTActor = await Actor.createActor(idlFactory,{
      agent,
      canisterId:id,
      
      
    });

    const name = await NFTActor.getName();
    const Owner = await NFTActor.getOwner();
    const Logo = await NFTActor.getAsset();
    const ImageContenet = new Uint8Array(Logo);
    const image =URL.createObjectURL(new Blob([ImageContenet.buffer],{type:"image/png"}))
    setname(name);
    setowner(Owner.toText());
    setlogos(image);
  }
  useEffect(()=>{
    loadNft();
  },[]);

  
  return (
    <div className="disGrid-item">
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={logos}
        />
        <div className="disCardContent-root">
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {name}<span className="purple-text"></span>
          </h2>
          <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            Owner: {owner}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Item;
