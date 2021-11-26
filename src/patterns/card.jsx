import React, { useEffect, useState } from "react";
import Countdown from "react-countdown";
import { useWeb3React } from "@web3-react/core";
import { useHistory } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
//IMPORTING STYLESHEET

import "../styles/patterns/card.scss";

//IMPORTING COMPONENTS

import { Text, Button } from "../components";
import { LiveAuctionModal } from "./modal";
import Prompt from "./prompt";

//IMPORTING MEDIA ASSETS

import lock from "../assets/icons/lock.svg";

//IMPORTING UTILITY PACKGAES

import { finish, signBid, bid } from "../utils/Bidify";
import { getSymbol } from "../utils/getCurrencySymbol";
import Web3 from "web3";
import { BIDIFY } from "../utils/config";

const Card = (props) => {
  const { name, creator, image, currentBid, endTime, id, currency, getLists, highBidder } =
    props;

  const { account, chainId } = useWeb3React();
  const history = useHistory();

  const isUser = account?.toLocaleLowerCase() === creator?.toLocaleLowerCase();
  const isHighBidder = account?.toLocaleLowerCase() === highBidder?.toLocaleLowerCase();
  const [isModal, setIsModal] = useState(false);
  const [processContent, setProcessContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [isVideo, setIsVideo] = useState(false);
  const [symbol, setSymbol] = useState('');

  // useEffect(() => {
  //   if (isSuccess) getLists();

  //   return () => setIsSuccess(false);
  // }, [isSuccess]);

  useEffect(async () => {
    const res = await getSymbol(currency);
    setSymbol(res);
  }, []);

  const handleFinisheAuction = async () => {
    setIsLoading(true);
    try {
      await new new Web3(window.ethereum).eth.Contract(
        BIDIFY.abi,
        BIDIFY.address[chainId]
      ).methods
        .finish(id)
        .send({ from: account });
      setIsLoading(false);
      setIsSuccess(true);
      getLists();
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setIsError(true);
      setTimeout(() => {
        setIsError(false);
      }, 3000);
    }
  };

  const handleBidMethod = async (amount) => {
    setIsModal(false);
    setIsLoading(true);
    setProcessContent(
      "Please allow https://Bidify.org permission within your wallet when prompted there will be a small fee for this"
    );
    try {
      await signBid(id, amount);
      setProcessContent(
        "Confirm the second transaction of your bid amount, there will be a small network fee for this."
      );
      await bid(id, amount);
      setIsLoading(false);
      setIsSuccess(true);
      getLists();
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    } catch (error) {
      console.log(error);
      if (error === "low_balance") {
        setIsLoading(false);
        setIsError(true);
        setErrorMessage(
          "Check your balance.your balance is low to bid for this NFT"
        );
        setTimeout(() => {
          setIsError(false);
        }, 3000);
      } else {
        setIsLoading(false);
        setIsError(true);
        setTimeout(() => {
          setIsError(false);
        }, 3000);
      }
    }
  };
  // Renderer callback with condition
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return (
        <>
          <div className="card_content_details">
            <div className="block_left">
              {
                currentBid ? 
                <Text variant="primary" style={{ color: "#F79420" }}>
                  Sold out for {currentBid} {symbol}
                </Text> : 
                <Text style={{ fontSize: 12 }}>Not sold out</Text>
              }
            </div>
          </div>
          {/* {isUser ? ( */}
            <Button
              variant="secondary"
              // style={{ pointerEvents: !isUser && "none" }}
              onClick={ () => handleFinisheAuction() }
            >
              Finish auction
            </Button>
          {/* ) : ( */}
            {/* <p></p> */}
          {/* )} */}
        </>
      );
    } else {
      // Render a countdown
      return (
        <>
          <div className="card_content_details">
            <div className="block_left">
              <Text variant="primary" style={{ color: "#F79420" }}>
                {currentBid ? currentBid : 0} {symbol}
              </Text>
              <Text style={{ fontSize: 12 }}>Current Bid</Text>
            </div>
            <div className="block_right">
              <Text variant="primary" style={{ color: "#FB5050" }}>
                {days} : {hours} : {minutes} : {seconds}
              </Text>
              <Text style={{ fontSize: 12 }}>Bidding Ends In</Text>
            </div>
          </div>
          <Button
            variant="secondary"
            style={{ pointerEvents: (isUser || isHighBidder) && "none" }}
            onClick={isUser ? null : () => setIsModal(true)}
          >
            {isUser ? (
              <img src={lock} alt="lock" width={14} />
            ) : (
              !isHighBidder ? "Place Your Bid" : "You are the highest bidder"
            )}
          </Button>
        </>
      );
    }
  };

  const renderImage = (
    <div
      className="card_image cursor"
      onClick={() => history.push(`/nft_details/${id}`)}
    >
      {isVideo ? (
        <video controls loop>
          <source src={image} type="video/mp4" />
          <source src={image} type="video/ogg" />
          <source src={image} type="video/mov" />
          <source src={image} type="video/avi" />
          <source src={image} type="video/wmv" />
          <source src={image} type="video/flv" />
          <source src={image} type="video/webm" />
          <source src={image} type="video/mkv" />
          <source src={image} type="video/avchd" />
        </video>
      ) : (
        <>
          <LazyLoadImage
            effect="blur"
            src={image}
            alt="art"
            onError={() => setIsVideo(true)}
            width={"100%"}
            heigh={"100%"}
          />
        </>
      )}
    </div>
  );

  const renderContent = (
    <div className="card_content">
      <div
        className="overlay"
        onClick={() => history.push(`/nft_details/${id}`)}
      ></div>
      <Text variant="primary" className="title">
        {name}
      </Text>
      <Text>
        By: #
        {`${creator?.slice(0, 4)}...${creator?.slice(creator?.length - 4)}`}
      </Text>

      <Countdown date={new Date(endTime * 1000)} renderer={renderer} />
    </div>
  );

  const renderCard = (
    <div className="card">
      {renderImage}
      {renderContent}
    </div>
  );

  return (
    <>
      {renderCard}
      <LiveAuctionModal
        {...props}
        symbol={symbol}
        handleBidMethod={handleBidMethod}
        isModal={isModal}
        setIsModal={setIsModal}
      />
      <Prompt isModal={isLoading} processContent={processContent} />
      <Prompt
        variant="success"
        isModal={isSuccess}
        successContent="Congratulations, you have successfully bid on this NFT (show image), you are the current highest bidder…. Good luck"
      />
      <Prompt variant="error" isModal={isError} errorMessage={errorMessage} />
    </>
  );
};

export default Card;
