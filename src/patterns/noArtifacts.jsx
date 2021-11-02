import React from "react";

//IMPORTING COMPONENTS

import { Text, Button } from "../components";

//IMPORTING MEDIA ASSETS

import noNFT from "../assets/abstracts/noNFT.svg";
import { Link } from "react-router-dom";

const NoArtifacts = ({ variant, title = "No Arts on live auction" }) => {
  return (
    <div className="no_artifacts">
      <img src={noNFT} alt="abstracts" />
      <Text variant="primary">{title}</Text>
      {variant === "mybiddings" ? (
        <Link to="/">
          <Button variant="secondary">Bid on NFT</Button>
        </Link>
      ) : (
        <a href="https://opensea.io/" target="_blank" rel="noopener noreferrer">
          <Button variant="secondary">Explore</Button>
        </a>
      )}
    </div>
  );
};

export default React.memo(NoArtifacts);
