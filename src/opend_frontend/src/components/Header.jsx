import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import homeImage from "../../assets/home-img.png";
import { BrowserRouter, Link ,Routes } from "react-router-dom";
import Minter from "./Minter";
import Gallery from "./Gallery";
import { Route } from "react-router";
import { opend_backend } from "../../../declarations/opend_backend/index";

import CURRENT_USER_ID from "../index.jsx";



function Header() {
  const[userownGallaery,setGallery] = useState();
  const[listingGallery,setListingGallery] = useState();
  async function getNft(){
    const usernftid = await opend_backend.getOwnedNFTs(CURRENT_USER_ID);
    setGallery(<Gallery title = "MY NFT" ids = {usernftid} role="collection"/>);
    
    const ListedNftIDs = await opend_backend.getListedNfts();
  
    setListingGallery(<Gallery title = "Discover" ids = {ListedNftIDs} role="discover" />);
  }
  useEffect(()=>{ 
    getNft();
  });
  
  return (
    <BrowserRouter>
    <div className="app-root-1">
      <header className="Paper-root AppBar-root AppBar-positionStatic AppBar-colorPrimary Paper-elevation4">
        <div className="Toolbar-root Toolbar-regular header-appBar-13 Toolbar-gutters">
          <div className="header-left-4"></div>
          <img className="header-logo-11" src={logo} />
          <div className="header-vertical-9"></div>
          <Link to = "/">
          <h5 className="Typography-root header-logo-text">OpenD</h5>
          </Link>
          <div className="header-empty-6"></div>
          <div className="header-space-8"></div>
          <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
          <Link to="/discover">
            Discover
            </Link>
          </button>
          <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
          <Link to="/minter">
            Minter
            </Link>
          </button>
          <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
           <Link to = "/collection">
            My NFTs
           </Link> 
            
          </button>
        </div>
      </header>
  
    </div>
   
    
<Routes>
  <Route path = "/" element = { <img className="bottom-space" src={homeImage} />} />
  <Route path = "/discover" element = {listingGallery}  />
  <Route path = "/minter" element = {<Minter />} />
  <Route path = "/collection" element = {userownGallaery} />
  
</Routes>

    </BrowserRouter>
  );
}

export default Header;
