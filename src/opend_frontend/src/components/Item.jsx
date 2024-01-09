import React, { useEffect, useState } from "react";
import { HttpAgent } from "../../../../node_modules/@dfinity/agent";
import { Actor } from "../../../../node_modules/@dfinity/agent/lib/cjs/actor";
import { idlFactory } from "../../../declarations/nft/index";
import Button from "./Button";
import { opend_backend } from "../../../declarations/opend_backend/index";
import CURRENT_USER_ID from "../index";
import PriceLabel from "./priceLabel";

function Item(props) {
  const[name,setname] = useState("");
  const[owner,setowner] = useState("");
  const[logos,setlogos] = useState();
  const[button,setButton] = useState();
  const[priceInput,setpriceInput] = useState();
  const[sellStatus,setsellStatus] = useState("");
  const[handleBuy,sethandleBuy] = useState();
  const[loaderHidden,setloaderHidden] = useState(true);
  const[blur,setBlur] = useState();
  const[priceLabel,setpriceLabel] = useState();
  const id = props.id; // its id of current used you can say it's principal of current user import from app.jsx
  const localHost = "http://localhost:8080/";


  const agent =  new HttpAgent({
    host:localHost, 
    verifyQuerySignatures: false,
  });
  //Use this just in Developermode not in live mode;
  agent.fetchRootKey();
  let NFTActor;            
  async function loadNft() {
    NFTActor = await Actor.createActor(idlFactory,{
      agent,
      canisterId:id,
      
      
    });

    const name = await NFTActor.getName();
    const Owner = await NFTActor.getOwner();
    const Logo = await NFTActor.getAsset();
    const ImageContenet = new Uint8Array(Logo);//first we have to convert image to Uint8Array
    const image =URL.createObjectURL(new Blob([ImageContenet.buffer],{type:"image/png"}));
    console.log(image);
    console.log(Owner.toText());
    setname(name);
    setowner(Owner.toText());
    setlogos(image);
    if(props.role == "collection")
    {
      const nftIslisted = await opend_backend.isListed(props.id);
      if(nftIslisted){
        setowner("openD");
        setBlur({filter: "blur(4px)"});
        setsellStatus("Listed");
      } else{
      setButton(<Button handleClick = { handleSell}  text={"Sell"} ></Button>)
      };
    }else if(props.role == "discover") 
    {
      const originalOwner = await opend_backend.getOriginalOwner(props.id);
      if(originalOwner.toText()!=CURRENT_USER_ID.toText()){
      setButton(<Button handleClick = { handleBuy}  text={"Buy"} ></Button>)
      }
      const price = await opend_backend.getListedNFTPrice(props.id);
      setpriceLabel(<PriceLabel sellPrice = {price}/>);
    }

  }
  useEffect(()=>{
    loadNft();
  },[]);
  let price;
  function handleSell(){
    console.log("enter to sell");
      console.log("sell Clicked");
      setpriceInput(<input
        placeholder="Price in DANG"
        type="number"
        className="price-input"
        value={price}
        onChange={(e)=>price = e.target.value}
      
      />);
      setButton(<Button handleClick = { sellItem} text={"Confirm"} ></Button>)
  }
  async function sellItem() {
    console.log("enter to sell");
    setBlur({filter: "blur(4px)"});
    setloaderHidden(false);
    console.log("sell items = "+price);
    const listingres = await opend_backend.listItem(props.id,Number(price));
    console.log("listin = "+listingres);
    if(listingres =="success"){
      const OpendID = await opend_backend.getOpendCanisterID();
      const transferresult = await NFTActor.transferOwnership(OpendID);
      console.log("transferresult = "+ transferresult);
      if(transferresult == "Success")
      {
        setpriceInput();
        setButton();
        setloaderHidden(true);
        setowner("openD");
        setsellStatus("Listed");
      }
    }
  }
  return (
    <div className="disGrid-item">
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={logos}
          style={blur}
        />
        <div className="lds-ellipsis" hidden = {loaderHidden}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
        <div className="disCardContent-root">
          {priceLabel}
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {name}<span className="purple-text"> {sellStatus}</span>
          </h2>
          <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            Owner: {owner}
          </p>
          {priceInput}
          {button}
        </div>
      </div>
    </div>
  );
}

export default Item;
