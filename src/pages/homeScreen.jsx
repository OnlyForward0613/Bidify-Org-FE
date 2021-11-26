import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
//STYLESHEET

import "../styles/pages/homepage.scss";
import "../styles/patterns/liveauction.scss";
import "../styles/patterns/card.scss";

//IMPORTING PATTERNS

import ScreenTemplate from "../patterns/screenTemplate";
import Footer from "../patterns/footer";
import { Text, Button } from "../components";
import LiveAuction from "../patterns/liveAuction";
import Header from "../patterns/header";
import NoArtifacts from "../patterns/noArtifacts";
import Loader from "../patterns/loader";

//IMPORTING MEDIA ASSETS

import heroIllustration from "../assets/abstracts/heroIllustration.svg";
import arrowUp from "../assets/icons/arrowUp.svg";

import { getNfts } from "../utils/NFTFetcher";

const platforms = [
  {
    name: "Cryptopunks",
    address: "0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB",
  },
  {
    name: "Gauntlets",
    address: "0x74EcB5F64363bd663abd3eF08dF75dD22d853BFC",
  },
  // {
  //   name:"Decentraland",
  //   address:"0x959e104e1a4db6317fa58f8295f586e1a978c297"
  // },
  // {
  //   name:"pymons ",
  //   address:"0x8620121c74DA24B7718849D3E6a57FaD9C2b098c"
  // },
];

const HomeScreen = () => {
  const [currentState, setCurrentState] = useState("live");
  const [currentPlatform, setCurrentPlatform] = useState("");
  const [nftData, setNftData] = useState([]);
  const [loading, setloading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(0);
  const [totalData, setTotalData] = useState(9);

  const handleFilter = async (platform, name) => {
    setloading(true);
    setCurrentPlatform(platform);
    setCurrentState(name);
    let result = [];
    var total = totalData === 9 ? totalData : totalData + 1;
    for (let i = initialLoad; i < total; i++) {
      var res = await getNfts(platform, i);
      result.push(res);
    }
    setloading(false);
    setNftData(result);
  };

  const renderFilterAuctions = (
    <ul>
      <li
        style={{
          fontWeight: currentState === "live" ? "600" : "normal",
        }}
        onClick={() => setCurrentState("live")}
      >
        All
      </li>
      {platforms.map((platform, index) => {
        return (
          <li
            key={index}
            onClick={() => handleFilter(platform.address, platform.name)}
            style={{
              fontWeight: currentState === platform.name ? "600" : "normal",
            }}
          >
            {platform.name}
          </li>
        );
      })}
    </ul>
  );

  const renderLiveAuctionHeader = (
    <div className="pattern_header">
      <div>
        <Text variant="primary" style={{ marginBottom: 5 }}>
          Live Auctions
        </Text>
        <Text style={{ whiteSpace: "nowrap" }}>
          Bid on your favourite NFTs here.
        </Text>
      </div>
      <div className="filter_auctions">{renderFilterAuctions}</div>
    </div>
  );

  const renderHero = (
    <div className="hero">
      <div className="block_left">
        <p>Bid, Buy and Sell </p>
        <p>any NFT on the Ethereum Network</p>
        <Link to="/marketplace">
          <Button variant="explore">
            <span>Explore Marketplace</span>
            <img src={arrowUp} alt="arrow" width={19} />
          </Button>
        </Link>
      </div>
      <div className="block_right">
        <img src={heroIllustration} alt="hero" height={200} />
      </div>
    </div>
  );

  const renderScreen = (
    <div className="home_screen">
      <Header
        title="Dashboard"
        description="Everything on Bidify at a glance"
      />
      {renderHero}
      {renderLiveAuctionHeader}
    </div>
  );

  const renderCards = (
    <>
      {loading ? (
        <Loader />
      ) : nftData?.length > 0 ? (
        <div className="live_auctions">
          <div className="live_auction_card_wrapper">
            {nftData?.map((data, index) => {
              return (
                <div className="card" key={index}>
                  <div className="card_image">
                    <LazyLoadImage
                      effect="blur"
                      src={data?.image}
                      alt="art"
                      width={"100%"}
                      heigh={"100%"}
                    />
                  </div>
                  <div
                    className="card_content"
                    style={{ minHeight: "fit-content" }}
                  >
                    <Text variant="primary" className="title">
                      {data?.name}
                    </Text>
                    <div className="description_block">
                      <Text className="description">{data?.description}</Text>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <NoArtifacts />
      )}
      {/* <center
        style={{ width: "fit-content", margin: "1em auto" }}
        onClick={() => setTotalData((t) => t + 9)}
      >
        <Button className="secondary_btn">Load more</Button>
      </center> */}
    </>
  );

  return (
    <ScreenTemplate>
      {renderScreen}
      {
        {
          live: <LiveAuction />,
          Gauntlets: renderCards,
          Cryptopunks: renderCards,
        }[currentState]
      }
      <Footer />
    </ScreenTemplate>
  );
};

export default HomeScreen;
