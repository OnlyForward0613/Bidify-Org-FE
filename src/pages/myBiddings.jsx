import React, { useEffect, useContext } from "react";
import { useWeb3React } from "@web3-react/core";
import { FetchWrapper } from "use-nft";
import { ethers, Contract } from "ethers";
import Web3 from "web3";
import { Link } from "react-router-dom";

//IMPORTING STYLESHEET

import "../styles/patterns/liveauction.scss";

//IMPORTING PATTERNS

import Card from "../patterns/card";
import { Text, Button } from "../components";
import ScreenTemplate from "../patterns/screenTemplate";
import NoArtifacts from "../patterns/noArtifacts";

//IMPORTING STORE COMPONENTS

import { UserContext } from "../store/contexts";

//IMPORTING UTILITY PACKAGES

import { BIDIFY, URLS } from "../utils/config";
import { getListing } from "../utils/Bidify";

const MyBiddings = () => {
  //INITIALIZING HOOKS

  const { userState, userDispatch } = useContext(UserContext);
  const { account, chainId } = useWeb3React();

  //HANDLING METHODS

  useEffect(() => {
    if (!userState?.isLiveAuctionFetched) getLists();
  }, [account, chainId]);

  const getLists = async () => {
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

    // function jsonurl(url) {
    //   return `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
    // }

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
    const result = await fetchWrapper.fetchNft(val?.platform, val?.token);
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

  const renderCards = (
    <>
      {userState?.userBiddings?.length > 0 ? (
        <div className="live_auction_card_wrapper">
          {userState?.userBiddings?.map((lists, index) => {
            return <Card {...lists} key={index} />;
          })}
        </div>
      ) : (
        <NoArtifacts
          title="This wallet has not bid on any NFTs using Bidify yet"
          variant="mybiddings"
        />
      )}
    </>
  );

  return <ScreenTemplate>{renderCards}</ScreenTemplate>;
};

export default MyBiddings;
