import React, { useEffect, useContext } from "react";
import { useWeb3React } from "@web3-react/core";
import { FetchWrapper, useNft } from "use-nft";
import Web3 from "web3";
import { Contract, ethers } from "ethers";

//STYLESHEET

import "../styles/pages/homepage.scss";

//IMPORTING PATTERNS

import ScreenTemplate from "../patterns/screenTemplate";
import Footer from "../patterns/footer";
import CollectionCard from "../patterns/collectionCard";
import Header from "../patterns/header";
import NoArtifacts from "../patterns/noArtifacts";
import Loader from "../patterns/loader";

//IMPORTING STORE COMPONENTS

import { UserContext } from "../store/contexts";

//IMPORTING UTILITY PACKAGES

import { ERC721, ERC1155, URLS } from "../utils/config";

const Collection = () => {
  //INITIALIZING HOOKS

  const { userState, userDispatch } = useContext(UserContext);

  const { chainId, account } = useWeb3React();

  //HANDLING METHODS

  useEffect(() => {
    if (account !== undefined) {
      if (!userState?.isCollectionFetched) getDetails();
    } else {
      console.log("connect wallet to view collections");
    }
  }, [account, chainId]);

  // const account = "0x0B172a4E265AcF4c2E0aB238F63A44bf29bBd158";

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
      isERC721: result.owner ? true : false,
    };
    return finalResult;
  };

  const getDetails = async () => {
    userDispatch({
      type: "MY_COLLECTIONS",
      payload: { results: undefined },
    });
    let getNft;

    let results = [];
    getNft = await getNFTs();
    for (var i = 0; i < getNft?.length; i++) {
      try {
        const res = await getFetchValues(getNft[i]);
        results.push(res);
      } catch (error) {
        console.log(error)
      }
    }
    userDispatch({
      type: "MY_COLLECTIONS",
      payload: { results, isCollectionFetched: true },
    });
  };

  async function getNFTs() {
    const from = "0x0B172a4E265AcF4c2E0aB238F63A44bf29bBd158";
    // const from = account;
    const web3 = new Web3(new Web3.providers.HttpProvider(URLS[chainId]));
    // Get all transfers to us
    const logs = await web3.eth.getPastLogs({
      fromBlock: 0,
      toBlock: "latest",
      topics: [
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
        // "0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62",
        // null,
        null,
        "0x" + from.split("0x")[1].padStart(64, "0"),
      ],
    });
    // Filter to just tokens which are still in our custody
    const res = [];
    const ids = {};

    for (let log of logs) {
      if (log.topics[3] !== undefined) {
        let platform = log.address;
        let token = log.topics[3];
        let owner = await new web3.eth.Contract(ERC721.abi, platform).methods
          .ownerOf(token)
          .call();
        if (owner.toLowerCase() !== from.toLowerCase()) {
          continue;
        }

        let jointID = platform + token;

        if (ids[jointID]) {
          continue;
        }
        token = parseInt(token, 16).toString();
        ids[jointID] = true;
        res.push({ platform, token });
      } else {
        continue;
      }
    }
    const logs_1155 = await web3.eth.getPastLogs({
      fromBlock: 0,
      toBlock: "latest",
      topics: [
        // "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
        "0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62",
        null,
        null,
        "0x" + from.split("0x")[1].padStart(64, "0"),
      ],
    });
    for (let log of logs_1155) {
      if (log.topics[3] !== undefined) {
        let platform = log.address;
        const decodeData = web3.eth.abi.decodeParameters(['uint256', 'uint256'], log.data);
        let token = web3.utils.toHex(decodeData[0]);
        let owner = await new web3.eth.Contract(ERC1155.abi, platform).methods
          .balanceOf(from, decodeData[0])
          .call();
        if(owner < 1) continue;
        // if (owner.toLowerCase() !== from.toLowerCase()) {
        //   continue;
        // }

        let jointID = platform + token;

        if (ids[jointID]) {
          continue;
        }
        token = token.toString();
        ids[jointID] = true;
        res.push({ platform, token });
      } else {
        continue;
      }
    }
    console.log("nfts", res)
    return res;
  }

  const renderCards = (
    <div className="card_wrapper">
      {userState?.myCollections?.map((lists, index) => {
        return (
          <CollectionCard
            {...lists}
            getDetails={getDetails}
            key={index.toString()}
          />
        );
      })}
    </div>
  );

  const renderScreen = (
    <div className="collection_screen">
      <Header
        title="My NFTs"
        description="view and list your NFTs for auction"
      />
      {userState?.myCollections ? (
        userState?.myCollections?.length > 0 ? (
          renderCards
        ) : (
          <NoArtifacts title="There are currently no compatible NFTs in this wallet" />
        )
      ) : (
        <Loader />
      )}
    </div>
  );

  return (
    <>
      <ScreenTemplate>
        {renderScreen}
        <Footer />
      </ScreenTemplate>
    </>
  );
};

export default Collection;
