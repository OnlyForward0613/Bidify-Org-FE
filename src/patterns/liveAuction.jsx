import React, { useEffect, useContext, useState } from "react";
import { FetchWrapper } from "use-nft";
import { ethers, Contract } from "ethers";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";

//IMPORTING STYLESHEET

import "../styles/patterns/liveauction.scss";

//IMPORTING COMPONENTS

import Card from "./card";
import { Text } from "../components";
import NoArtifacts from "./noArtifacts";
import Loader from "./loader";

//IMPORTING STORE COMPONENTS

import { UserContext } from "../store/contexts";

//IMPORTING UTILITY PACKAGES

import { BIDIFY, URLS } from "../utils/config";
import { getListing } from "../utils/Bidify";

const LiveAuction = () => {
  //INITIALIZING HOOKS
  const { userState, userDispatch } = useContext(UserContext);
  const { account, chainId } = useWeb3React();

  //HANDLING METHODS

  useEffect(() => {
    if (!userState?.isLiveAuctionFetched) getLists();
  }, []);

  const getLists = async () => {
    userDispatch({
      type: "LIVE_AUCTION_NFT",
      payload: { results: undefined },
    });
    //const Bidify = new web3.eth.Contract(BIDIFY.abi, BIDIFY.address);
    //const totalAuction = await Bidify.methods.totalListings().call();

    const totalAuction = await getLogs();
    let Lists = [];
    for (let i = 0; i < totalAuction; i++) {
      const result = await getListing(i.toString());
      Lists[i] = result;
    }
    getDetails(Lists);
  };

  const getLogs = async () => {
    const web3 = new Web3(new Web3.providers.HttpProvider(URLS[chainId]));
    const topic0 =
      "0xb8160cd5a5d5f01ed9352faa7324b9df403f9c15c1ed9ba8cb8ee8ddbd50b748";
    const logs = await web3.eth.getPastLogs({
      fromBlock: "earliest",
      toBlock: "latest",
      address: BIDIFY.address[chainId],
      topics: [topic0],
    });

    let totalLists = 0;
    for (let log of logs) {
      totalLists++;
    }

    return totalLists;
  };

  const getFetchValues = async (val) => {
    let provider;
    if (chainId === 4) {
      provider = new ethers.providers.InfuraProvider(
        "rinkeby",
        "5eee22163f644a2caebb48fb76f3cce0"
      );
    } else if (chainId === 3) {
      provider = new ethers.providers.InfuraProvider(
        "ropsten",
        "5eee22163f644a2caebb48fb76f3cce0"
      );
    } else if (chainId === 5) {
      provider = new ethers.providers.InfuraProvider(
        "goerli",
        "5eee22163f644a2caebb48fb76f3cce0"
      );
    } else if (chainId === 42) {
      provider = new ethers.providers.InfuraProvider(
        "kovan",
        "5eee22163f644a2caebb48fb76f3cce0"
      );
    } else if (chainId === 1) {
      provider = new ethers.providers.InfuraProvider(
        "goerli",
        "5eee22163f644a2caebb48fb76f3cce0"
      );
    }

    const ethersConfig = {
      ethers: { Contract },
      provider: provider,
    };
    
    const fetcher = ["ethers", ethersConfig];

    function ipfsUrl(cid, path = "") {
      return `https://dweb.link/ipfs/${cid}${path}`;
    }

    function imageurl(url) {
      const string = url;
      const check = url.substr(16, 4);
      if (check === "ipfs") {
        const manipulated = url.substr(16, 16 + 45);
        return "https://dweb.link/" + manipulated;
      } else {
        return `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
      }
    }
    const fetchWrapper = new FetchWrapper(fetcher, {
      jsonProxy: (url) => {
        return `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
      },
      imageProxy: (url) => {
        return imageurl(url);
      },
      ipfsUrl: (cid, path) => {
        return ipfsUrl(cid, path);
      },
    });

    const result = await fetchWrapper
      .fetchNft(val?.platform, val?.token)
      .catch((err) => {
        console.log("fetchWrapper error", err.message);
      });
    const finalResult = {
      ...result,
      platform: val?.platform,
      token: val?.token,
      ...val,
    };
    return finalResult;
  };

  const getDetails = async (lists) => {
    const unsolvedPromises = lists.map((val) => getFetchValues(val));
    const results = await Promise.all(unsolvedPromises);
    const filteredData = results.filter((val) => val.paidOut !== true);
    const userBiddings = results.filter((value) =>
      value.bids.some(
        (val) =>
          val.bidder?.toLocaleLowerCase() === account?.toLocaleLowerCase()
      )
    );
    userDispatch({
      type: "LIVE_AUCTION_NFT",
      payload: { results: filteredData, userBiddings, isFetched: true },
    });
  };

  // const renderNoMathches = (
  //   <div className="loader">
  //     <div style={{ display: "flex", alignItems: "center", gridGap: "1em" }}>
  //       <img
  //         src={search}
  //         alt="loader"
  //         width={24}
  //         style={{ filter: "greyscale(1)" }}
  //       />{" "}
  //       <Text>No matches found</Text>
  //     </div>
  //   </div>
  // );

  const renderCards = (
    <>
      {userState?.searchResults?.length === undefined ? (
        <div className="live_auction_card_wrapper">
          {userState?.liveAuctions?.map((lists, index) => {
            return <Card {...lists} getLists={getLists} key={index} />;
          })}
        </div>
      ) : userState?.searchResults?.length === 0 ? (
        <div className="center">
          <Text>No matches found</Text>
        </div>
      ) : (
        <div className="live_auction_card_wrapper">
          {userState?.searchResults?.map((lists, index) => {
            return <Card {...lists} getLists={getLists} key={index} />;
          })}
        </div>
      )}
    </>
  );

  return (
    <>
      {userState?.liveAuctions ? (
        userState?.liveAuctions?.length > 0 ? (
          <div className="live_auctions">{renderCards}</div>
        ) : (
          <NoArtifacts />
        )
      ) : (
        <Loader />
      )}
    </>
  );
};

export default LiveAuction;
