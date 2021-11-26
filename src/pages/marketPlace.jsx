import React, { useContext, useEffect, useState } from "react";
import _ from "lodash";
//STYLESHEET

import "../styles/pages/homepage.scss";
import "../styles/pages/marketplace.scss";
import "../styles/patterns/liveauction.scss";

//IMPORTING PATTERNS

import ScreenTemplate from "../patterns/screenTemplate";
import Footer from "../patterns/footer";
import { Text } from "../components";
import Header from "../patterns/header";
import Card from "../patterns/card";
import NoArtifacts from "../patterns/noArtifacts";

//IMPORTING MEDIA ASSETS

import down from "../assets/icons/down.svg";

//IMPORTING STORE COMPONENTS

import { UserContext } from "../store/contexts";

const MarketPlace = () => {
  //INITIALIZING HOOKS

  const { userState, userDispatch } = useContext(UserContext);
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState({});
  const [isPriceDropdown, setIsPriceDropdown] = useState(false);
  const [isBidsDropdown, setIsBidsDropdown] = useState(false);
  const [range, setRange] = useState(0);
  const options = {method: 'GET'};

  useEffect(() => {
    if (userState?.liveAuctions) {
      setData(userState?.liveAuctions);
    }
  }, []);

  useEffect(() => {
    if (filterData.price) {
      let type = filterData.price;
      setData(_.orderBy(userState?.liveAuctions, ["nextBid"], [type]));
    }
    if (filterData.bids) {
      var filData =
        filterData.bids === 20
          ? userState?.liveAuctions?.filter(
              (val) => val.bids?.length >= filterData.bids
            )
          : userState?.liveAuctions?.filter(
              (val) => val.bids?.length <= filterData.bids
            );
      setData(filData);
    }
    setIsBidsDropdown(false);
    setIsPriceDropdown(false);
  }, [filterData]);

  useEffect(() => {
    var filData = userState?.liveAuctions?.filter(
      ({ nextBid }) => Number(nextBid) >= range
    );
    setData(filData);
  }, [range]);

  const renderPriceDropdown = (
    <div className="dropdown_content">
      <div onClick={() => setFilterData({ price: "asc" })}>
        <Text component="span">Lowest to Highest</Text>
      </div>
      <div onClick={() => setFilterData({ price: "desc" })}>
        <Text component="span">Highest to Lowest</Text>
      </div>
    </div>
  );

  const renderBidsDropdown = (
    <div className="dropdown_content">
      <div onClick={() => setFilterData({ bids: 20 })}>
        <Text component="span">20 Bids or more</Text>
      </div>
      <div onClick={() => setFilterData({ bids: 19 })}>
        <Text component="span">less than 20 bids</Text>
      </div>
    </div>
  );

  const renderFilterActions = (
    <div className="filter_auctions">
      <div>
        <Text
          variant="primary"
          style={{ fontSize: 12, fontFamily: "sans-regular" }}
        >
          Price
        </Text>
        <div
          className="dropdown"
          onClick={() => setIsPriceDropdown(!isPriceDropdown)}
        >
          <Text component="span">
            {filterData?.price === "desc"
              ? "Highest to Lowest"
              : "Lowest to Highest"}
          </Text>
          <img src={down} alt="down" width={22} />
          {isPriceDropdown && renderPriceDropdown}
        </div>
      </div>
      <div>
        <Text
          variant="primary"
          style={{ fontSize: 12, fontFamily: "sans-regular" }}
        >
          No. of bids
        </Text>
        <div
          className="dropdown"
          onClick={() => setIsBidsDropdown(!isBidsDropdown)}
        >
          <Text component="span">20 bids or more</Text>
          <img src={down} alt="down" width={22} />
          {isBidsDropdown && renderBidsDropdown}
        </div>
      </div>
      <div>
        <Text
          variant="primary"
          style={{ fontSize: 12, fontFamily: "sans-regular" }}
        >
          Price range
        </Text>
        <div className="range">
          <div>
            <section>
              <p
                style={{
                  background: "#f79420",
                  width: `${(range / 1000) * 100}%`,
                }}
              ></p>
              <input
                type="range"
                min="0"
                max="1000"
                value={range}
                onChange={({ target: { value } }) => setRange(value)}
                step="1"
              />
            </section>
            <p>
              <Text component="span">0 BIT</Text>
              <Text component="span">1000 BIT</Text>
            </p>
          </div>
          <p style={{ transform: "translateY(-20px)" }}>{range} BIT</p>
        </div>
      </div>
    </div>
  );
  const renderScreen = (
    <div className="marketplace_screen">
      <Header
        title="Marketplace"
        description="All the NFTs listed at one place"
      />
      {renderFilterActions}
    </div>
  );

  const renderCards = (
    <>
      {data?.length > 0 ? (
        <div className="live_auction_card_wrapper">
          {data?.map((lists, index) => {
            return <Card {...lists} key={index} />;
          })}
        </div>
      ) : (
        <NoArtifacts />
      )}
    </>
  );

  return (
    <ScreenTemplate>
      {renderScreen}
      {renderCards}
      <Footer />
    </ScreenTemplate>
  );
};

export default MarketPlace;
