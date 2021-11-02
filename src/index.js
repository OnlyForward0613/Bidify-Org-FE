import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./App";
import Provider from "./store/provider";

import { Web3ReactProvider } from "@web3-react/core";

import { Web3Provider } from "@ethersproject/providers";

// function getErrorMessage(error) {
//   if (error instanceof NoEthereumProviderError) {
//     return "No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.";
//   } else if (error instanceof UnsupportedChainIdError) {
//     return "You're connected to an unsupported network.";
//   } else if (
//     error instanceof UserRejectedRequestErrorInjected ||
//     error instanceof UserRejectedRequestErrorFrame
//   ) {
//     return "Please authorize this website to access your Ethereum account.";
//   } else {
//     console.error(error);
//     return "An unknown error occurred. Check the console for more details.";
//   }
// }

function getLibrary(provider) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

ReactDOM.render(
  <Web3ReactProvider getLibrary={getLibrary}>
    <Provider>
      <App />
    </Provider>
  </Web3ReactProvider>,
  document.getElementById("root")
);
