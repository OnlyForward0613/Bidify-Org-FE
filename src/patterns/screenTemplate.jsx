import React, { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";

//IMPORTING COMPONENTS

import { Button, Text } from "../components";

//IMPORTING MEDIA ASSETS

import logofull from "../assets/logo/logofull.svg";

//IMPORTING UTILITY PACKAGES

import { injected } from "../utils/connector";

const ScreenTemplate = ({ children }) => {
  const [initailLoad, setInitialLoad] = useState(true);
  const [wrongNetwork, setWrongNetwork] = useState(false);
  const { active, activate, chainId } = useWeb3React();
  const [isMetamask, setIsMetamask] = useState(false);

  useEffect(() => {
    if (chainId) {
      if (
        chainId === 4 ||
        chainId === 5 ||
        chainId === 42 ||
        chainId === 3 ||
        chainId === 1
      ) {
        setWrongNetwork(false);
      } else setWrongNetwork(true);
    }
  }, [chainId]);

  useEffect(() => {
    if (window.ethereum === "undefined") setIsMetamask(true);
    else setIsMetamask(false);
  }, []);

  useEffect(() => {
    setInitialLoad(true);
    setTimeout(() => {
      setInitialLoad(false);
    }, 2000);
  }, []);

  if (initailLoad) {
    return (
      <div className="flex_center">
        <img src={logofull} alt="logo" width={300} />
      </div>
    );
  }

  if (isMetamask) {
    return (
      <div className="flex_center">
        <img src={logofull} alt="logo" width={300} />
        <Text variant="primary">Install Metamask Extension</Text>
        <a
          className="web"
          target="_blank"
          rel="noopener noreferrer"
          href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en-US"
        >
          <Button variant="secondary">Click here</Button>
        </a>
        <a
          className="mob"
          target="_blank"
          rel="noopener noreferrer"
          href="https://play.google.com/store/apps/details?id=io.metamask"
        >
          <Button variant="secondary">Click here</Button>
        </a>
      </div>
    );
  }

  if (wrongNetwork) {
    return (
      <div className="flex_center">
        <img src={logofull} alt="logo" width={300} />
        <Button variant="primary">Wrong Network</Button>
      </div>
    );
  }

  if (!active) {
    return (
      <div className="flex_center">
        <img src={logofull} alt="logo" width={300} />
        <Button variant="primary" onClick={() => activate(injected)}>
          Connect Wallet
        </Button>
      </div>
    );
  }

  return <div className="screen_template">{children}</div>;
};

export default ScreenTemplate;
