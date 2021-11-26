import React, { useContext, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import Web3 from "web3";

//IMPORTING COMPONENTS

import { Text, Button } from "../components";

//IMPORTING STYLESHEET

import "../styles/patterns/profile.scss";

//IMPORTING MEDIA ASSETS

import metamask from "../assets/logo/metamask.svg";
import notification from "../assets/icons/notification.svg";
import copy from "../assets/icons/copy.svg";
import refresh from "../assets/icons/refresh.svg";

//IMPORTING STORE COMPONENTS

import { UserContext } from "../store/contexts";
import { useWeb3React } from "@web3-react/core";
import { BIT, URLS } from "../utils/config";
import { useEffect } from "react";

const upcomingFeatures = [
  "Bidify Tutorials – Q4 2021",
  "Bidify Token 		– Q4 2021",
  "Bidify User Airdrop	– Q1 2022",
  "Discord/Telegram/Facebook Applications	-Q1 2022",
  "Bidify DAO		– Q2 2022",
  "Mobile Application 	– Q2 2022",
];

const networkData = [
  {
    id: "1",
    name: "MAINNET",
    color: "#EA6969",
  },
  {
    id: "3",
    name: "ROPSTEN",
    color: "#9F9DF8",
  },
  {
    id: "4",
    name: "RINKEBY",
    color: "#F4DD62",
  },
  {
    id: "5",
    name: "GOERLI",
    color: "#7AD7F4",
  },
  {
    id: "42",
    name: "KOVAN",
    color: "#27F805",
  },
];

const Profile = () => {
  //INITIALIZING HOOKS

  const { userState, userDispatch } = useContext(UserContext);
  const { account, active, chainId } = useWeb3React();

  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toggleSwitchNetwork, setToggleSwitchNetwork] = useState(false);
  const [balance, setBalance] = useState("");
  const [networkName, setNetworkName] = useState();

  useEffect(async () => {
    if (account) setBalance(await getBalance());
  }, [account]);

  // const handleFreeToken = async () => {
  //   setIsLoading(true);
  //   try {
  //     await new new Web3(window.ethereum).eth.Contract(
  //       BIT.abi,
  //       BIT.address[chainId]
  //     ).methods
  //       ._mint(Web3.utils.toWei(Web3.utils.toBN(1000)))
  //       .send({ from: account });

  //     await window.ethereum.request({
  //       method: "wallet_watchAsset",
  //       params: {
  //         type: "ERC20", // Initially only supports ERC20, but eventually more!
  //         options: {
  //           address: BIT.address[chainId], // The address that the token is at.
  //           symbol: "BID", // A ticker symbol or shorthand, up to 5 chars.
  //           decimals: 18, // The number of decimals in the token
  //           //image: tokenImage, // A string url of the token logo
  //         },
  //       },
  //     });
  //     setIsLoading(false);
  //     setBalance(await getBalance());
  //   } catch (error) {
  //     console.log(error);
  //     setIsLoading(false);
  //   }
  // };

  const switchNetwork = async (_chainId) => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: Web3.utils.toHex(_chainId) }],
      });
      setToggleSwitchNetwork(false);
    } catch (error) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              { chainId: Web3.utils.toHex(_chainId), rpcUrl: URLS[_chainId] },
            ],
          });
        } catch (addError) {
          // handle "add" error
        }
      }
      // handle other "switch" errors
    }
  };

  const handleSwitchNetwork = async (chainId) => {
    switch (Number(chainId)) {
      case 1:
        await switchNetwork(Number(1));
        break;
      case 3:
        await switchNetwork(Number(3));
        break;
      case 4:
        await switchNetwork(Number(4));
        break;
      case 5:
        await switchNetwork(Number(5));
        break;
      case 42:
        await switchNetwork(Number(42));
        break;
      default:
        console.log("select valid chain");
    }
    setToggleSwitchNetwork(false);
  };

  const getBalance = async () => {
    try {
      return Web3.utils.fromWei(
        await new new Web3(window.ethereum).eth.Contract(
          BIT.abi,
          BIT.address[chainId]
        ).methods
          .balanceOf(account)
          .call()
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(async () => {
    try {
      if (active) {
        switch (chainId) {
          case 1:
            setNetworkName("Mainnet");
            break;
          case 3:
            setNetworkName("Ropsten");
            break;
          case 4:
            setNetworkName("Rinkeby");
            break;
          case 5:
            setNetworkName("Goerli");
            break;
          case 42:
            setNetworkName("Kovan");
            break;
          default:
            break;
        }
      }
    } catch (err) {
      window.alert("Switch to Rinkeby Testnet");
    }
  }, [active, account, chainId]);

  const handleCopy = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

  // const renderUserProfile = (
  //   <div className="user_profile">
  //     {/* <img /> */}
  //     <Text variant="primary" style={{ marginBottom: 5 }}>
  //       Kevin Peterson
  //     </Text>
  //     <Text style={{ marginBottom: 24 }}>@kevin89peterson</Text>
  //     <div className="icons">
  //       <img src={like} alt="icons" />
  //       <img src={upload} alt="icons" />
  //       <img src={notification} alt="icons" />
  //     </div>
  //   </div>
  // );

  const renderSwitchNetwork = (
    <div className="switchnetwork_modal">
      {networkData.map((val, index) => {
        return (
          <div key={index} onClick={() => handleSwitchNetwork(val.id)}>
            <mark style={{ background: val.color }}></mark>
            <code>{val.name}</code>
          </div>
        );
      })}
    </div>
  );

  const renderUserWalletStatus = (
    <div className="user_wallet_status">
      <div>
        <div style={{ position: "relative" }}>
          <Text>Metamask</Text>
          <Text>
            <Text component="span">Connected to {networkName}</Text>
            <img
              src={refresh}
              alt="refresh"
              width={24}
              style={{ cursor: "pointer" }}
              onClick={() => setToggleSwitchNetwork(!toggleSwitchNetwork)}
            />
          </Text>
          {toggleSwitchNetwork && renderSwitchNetwork}
        </div>
        <img src={metamask} alt="metamask logo" width={35} />
      </div>
      <Text className="account_info">
        <Text component="span" style={{ fontSize: 11 }}>{`${account?.slice(
          0,
          4
        )}....${account?.slice(account?.length - 12)}`}</Text>
        <CopyToClipboard text={account}>
          <img
            src={copy}
            alt="copy"
            width={24}
            onClick={() => handleCopy()}
            style={{ cursor: "pointer" }}
          />
        </CopyToClipboard>
        <span className={isCopied ? "copy_text active" : "copy_text"}>
          copied
        </span>
      </Text>
      <Text style={{ fontWeight: 600 }}>{balance ? balance : 0} BIT</Text>
    </div>
  );

  const renderRecentActivities = (
    <div className="recent_activity">
      <Text variant="primary" style={{ marginBottom: 15 }}>
        Upcoming features
      </Text>
      {upcomingFeatures.map((val, index) => {
        return (
          <div className="details" key={index}>
            <img src={notification} alt="icons" width={40} />
            <Text>{val}</Text>
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      <div className={userState?.isSidebar ? "profile active" : "profile"}>
        {/* {renderUserProfile} */}
        {/* <Button
          style={{
            margin: "0 auto",
            marginBottom: 16,
            pointerEvents: isLoading && "none",
            opacity: isLoading && "0.6",
          }}
          variant="primary"
          onClick={() => handleFreeToken()}
        >
          Get free token
        </Button> */}
        {renderUserWalletStatus}
        {renderRecentActivities}
      </div>
      <div
        className={
          userState?.isSidebar ? "profile_backdrop active" : "profile_backdrop"
        }
        onClick={() =>
          userDispatch({
            type: "SIDEBAR",
            payload: { isSidebar: !userState?.isSidebar },
          })
        }
      ></div>
    </>
  );
};

export default Profile;
