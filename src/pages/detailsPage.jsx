import React, { useEffect, useState, Fragment, useRef } from "react";
import { useParams } from "react-router-dom";
import { getListing } from "../utils/Bidify";
import { FetchWrapper } from "use-nft";
import Web3 from "web3";
import Countdown from "react-countdown";
import { useWeb3React } from "@web3-react/core";
import { ethers, Contract } from "ethers";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { getSymbol } from "../utils/getCurrencySymbol";
import "react-lazy-load-image-component/src/effects/blur.css";
//STYLESHEET

import "../styles/pages/detailspage.scss";

//IMPORTING PATTERNS

import Footer from "../patterns/footer";
import ScreenTemplate from "../patterns/screenTemplate";
import { Button, Text } from "../components";
import Prompt from "../patterns/prompt";

//IMPORTING MEDIA ASSETS

import lock from "../assets/icons/lock.svg";

//IMPORTING UTILITY PACKGAES

import { finish, signBid, bid } from "../utils/Bidify";

//IMPORTING MEDIA ASSETS

import loader from "../assets/icons/loader.svg";
import playImg from "../assets/icons/play-circle.svg";
import pauseImg from "../assets/icons/pause-circle.svg";

//IMPORTING UTILITY PACKAGES

import { BIDIFY, URLS } from "../utils/config";

const DetailsPage = () => {
  //INITIALIZING HOOKS

  const params = useParams();
  const videoRef = useRef(null);

  const [isVideo, setIsVideo] = useState(false);
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [paramId, setParamId] = useState();
  const { chainId, account } = useWeb3React();
  const [isPlay, setIsPlay] = useState(false);
  const [yourBid, setYourBid] = useState(0);
  //HANDLING METHODS

  useEffect(() => {
    const { id } = params;
    setParamId(id);
    getLists(id);
  }, []);

  const getLists = async (id) => {
    //setData();
    //const Bidify = new web3.eth.Contract(BIDIFY.abi, BIDIFY.address);
    //const totalAuction = await Bidify.methods.totalListings().call();

    const totalAuction = await getLogs();
    let Lists = [];
    for (let i = 0; i < totalAuction; i++) {
      const result = await getListing(i.toString());
      Lists[i] = result;
    }
    getDetails(Lists, id);
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
    const res = await getSymbol(val.currency);
    const finalResult = {
      ...result,
      platform: val?.platform,
      token: val?.token,
      ...val,
      symbol: res
    };
    return finalResult;
  };

  const getDetails = async (lists, id) => {
    const unsolvedPromises = lists.map((val) => getFetchValues(val));
    const results = await Promise.all(unsolvedPromises);
    const filteredData = results.filter((val) => val.id === String(id));
    setData(filteredData);
  };
  
  const handleFinishAuction = async (id) => {
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

  const handleBidMethod = async (id, amount) => {
    setIsLoading(true);
    try {
      await signBid(id, amount);
      await bid(id, amount);
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        window.location.reload();
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

  // Renderer callback with condition
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return (
        <>
          {data?.map((val, index) => {
            return (
              <Fragment key={index}>
                <div className="bid_details">
                  <div>
                    <Text
                      variant="primary"
                      style={{ color: "#F79420", fontWeight: 500 }}
                    >
                      {val.currentBid ? val.currentBid : 0} {val.symbol}
                    </Text>
                    <Text style={{ fontSize: 12 }}>Reserved price</Text>
                  </div>
                </div>
                <div className="content_footer">
                  {account.toLocaleLowerCase() ===
                  val.creator.toLocaleLowerCase() ? (
                    <Button
                      variant="primary"
                      onClick={() => handleFinishAuction(val.id)}
                    >
                      Finish Auction
                    </Button>
                  ) : null}

                  {/* <Button variant="secondary">Pay gas fees</Button> */}
                  <Text style={{ fontSize: 12 }}>
                    1% seller fee to be added
                  </Text>
                </div>
              </Fragment>
            );
          })}
        </>
      );
    } else {
      // Render a countdown
      return (
        <>
          {data?.map((val, index) => {
            return (
              <Fragment key={index}>
                <div className="bid_details">
                  <div>
                    <Text
                      variant="primary"
                      style={{ color: "#F79420", fontWeight: 500 }}
                    >
                      {val.currentBid ? val.currentBid : 0} {val.symbol}
                    </Text>
                    <Text style={{ fontSize: 12 }}>Current bid</Text>
                  </div>
                  <div>
                    <Text
                      variant="primary"
                      style={{ color: "#FB5050", fontWeight: 500 }}
                    >
                      {days} : {hours} : {minutes} : {seconds}
                    </Text>
                    <Text style={{ fontSize: 12 }}>Bidding Ends In</Text>
                  </div>
                </div>
                <div className="content_footer">
                  {account.toLocaleLowerCase() !==
                    val.creator.toLocaleLowerCase() && (
                    <>
                      <Text
                        variant="primary"
                        style={{
                          fontSize: 14,
                          marginBottom: 10,
                          textAlign: "start",
                        }}
                      >
                        Bid amount
                      </Text>
                      <div className="form_input">
                        {/* <Text variant="primary">{val.nextBid}</Text> */}
                        <input className="bid-input" type="number" defaultValue={val.nextBid} onChange={(e) => {setYourBid(e.target.value)}} />
                        <Text style={{ color: "#F79420" }}>{val.symbol}</Text>
                      </div>
                    </>
                  )}
                  {account.toLocaleLowerCase() ===
                  val.creator.toLocaleLowerCase() ? (
                    <Button
                      variant="secondary"
                      style={{ pointerEvents: "none" }}
                    >
                      <img src={lock} alt="lock" width={14} />
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      onClick={() => handleBidMethod(val.id, yourBid ? yourBid : val.nextBid)}
                    >
                      Place Your Bid
                    </Button>
                  )}

                  {/* <Button variant="secondary">Pay gas fees</Button> */}
                  <Text style={{ fontSize: 12 }}>
                    1% seller fee to be added
                  </Text>
                </div>
              </Fragment>
            );
          })}
        </>
      );
    }
  };

  const handlePlay = () => {
    if (videoRef) videoRef.current.play();
    setIsPlay(true);
  };

  const handlePause = () => {
    if (videoRef) videoRef.current.pause();
    setIsPlay(false);
  };

  const renderImage = (
    <>
      {data?.map(({ image }, index) => {
        return (
          <div className="image" key={index}>
            {isVideo ? (
              <>
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
                {
                  <img
                    src={isPlay ? pauseImg : playImg}
                    alt="button"
                    className="video_nav_btn"
                    onClick={!isPlay ? () => handlePlay() : () => handlePause()}
                  />
                }
              </>
            ) : (
              <LazyLoadImage
                effect="blur"
                src={image}
                alt="art"
                onError={() => setIsVideo(true)}
                width={"100%"}
                heigh={"100%"}
              />
            )}
          </div>
        );
      })}
    </>
  );

  const renderNFTDetails = (
    <>
      {data?.map((val, index) => {
        return (
          <div className="nft_details" key={index}>
            <div className="content">
              <Text className="title" variant="primary">
                {val.name}
              </Text>
              <Text
                className="description"
                style={{ fontSize: 12, marginTop: 10 }}
              >
                {val.description}
              </Text>
              {/* <div>
                <img src={like} alt="like" />
                <img src={share} alt="share" />
                <img src={dot} alt="dot" />
              </div> */}
            </div>

            <Countdown
              date={new Date(val.endTime * 1000)}
              renderer={renderer}
            />
          </div>
        );
      })}
    </>
  );

  const renderScreen = (
    <div className="details_page">
      <div className="block">
        {renderImage}
        {renderNFTDetails}
      </div>
      <div className="nft_activity">
        <Text variant="primary" style={{ marginBottom: 5 }}>
          Ownership activity
        </Text>
        <Text>Know the history of this rare NFT artifact</Text>
        {data?.map((val, index) => {
          return (
            <div className="history_details" key={index}>
              {val.bids.length > 0 ? (
                val.bids.map((detail, index) => {
                  return (
                    <div className="flex_gap" key={index}>
                      <Text
                        variant="primary"
                        style={{ fontSize: 14 }}
                      >{`${detail.bidder?.slice(0, 6)}...${detail.bidder.slice(
                        detail.bidder?.length - 6
                      )}`}</Text>
                      <p>
                        <Text component="span">Bid amount : </Text>
                        <Text component="span" style={{ color: "#F79420" }}>
                          {detail.price}
                        </Text>
                      </p>
                    </div>
                  );
                })
              ) : (
                <div className="flex">
                  <Text style={{ fontWeight: 500 }}>
                    No recent activity here
                  </Text>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
  return (
    <>
      <ScreenTemplate>
        {data === undefined ? (
          <div className="grid_center">
            <img src={loader} alt="loader" width={24} />
          </div>
        ) : data?.length === 0 ? (
          <div className="grid_center">
            <Text>
              There is no NFT with token id{" "}
              <b style={{ fontWeight: 600, color: "#343434" }}>{paramId}</b>
            </Text>
          </div>
        ) : (
          renderScreen
        )}
        <Footer />
      </ScreenTemplate>
      <Prompt isModal={isLoading} />
      <Prompt variant="success" isModal={isSuccess} />
      <Prompt variant="error" isModal={isError} />
    </>
  );
};

export default DetailsPage;
