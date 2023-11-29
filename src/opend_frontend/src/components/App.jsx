import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import "bootstrap/dist/css/bootstrap.min.css";

import Item from "./Item";
import Minter from "./Minter";
import { opend_backend } from "../../../declarations/opend_backend/index";
function App() {
  const canistetID = "bkyz2-fmaaa-aaaaa-qaaaq-cai";
  return (
    <div className="App">
      <Header />
   
      {/* <Item  id ={canistetID} />  */}
      {/* <Minter /> */}
      <Footer />
    </div>
  );
}

export default App;

