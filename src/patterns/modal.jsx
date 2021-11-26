import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Field } from "formik";

//IMPORTING STYLESHEET

import "../styles/patterns/modal.scss";

//IMPORTING COMPONENTS

import { Text, Button } from "../components";

//IMPORTING MEDIA ASSETS

import close from "../assets/icons/close.svg";
import playImg from "../assets/icons/play-circle.svg";
import pauseImg from "../assets/icons/pause-circle.svg";

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modal = {
  hidden: { opacity: 0, transform: "translate(-50%, -50%) scale(0.5)" },
  visible: {
    opacity: 1,
    transform: "translate(-50%, -50%) scale(1)",
    transition: { delay: 0.1 },
  },
  exit: { opacity: 0, transform: "translate(-50%, -50%) scale(0)" },
};

export const CollectionModal = (props) => {
  const { isModal, setIsModal, image, name, owner, renderCreateForm } = props;

  const [isPlay, setIsPlay] = useState(false);
  const [isVideo, setIsVideo] = useState(false);
  const videoRef = useRef(null);

  const handlePlay = () => {
    if (videoRef) videoRef.current.play();
    setIsPlay(true);
  };

  const handlePause = () => {
    if (videoRef) videoRef.current.pause();
    setIsPlay(false);
  };

  const renderModalHeader = (
    <div className="modal_header">
      <div>
        <Text variant="primary" style={{ marginBottom: 5 }}>
          Create Auction
        </Text>
      </div>
      <img
        src={close}
        alt="close"
        width={24}
        onClick={() => setIsModal(false)}
      />
    </div>
  );

  const renderBody = (
    <div className="modal_body">
      <div className="image">
        {isVideo ? (
          <>
            <video ref={videoRef} loop>
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
          <img src={image} alt="art" onError={() => setIsVideo(true)} />
        )}
      </div>
      <Text variant="primary" style={{ fontSize: 20, lineHeight: "27px" }}>
        {name}
      </Text>
      <Text>
        By: {`${owner?.slice(0, 6)}...${owner?.slice(owner?.length - 6)}`}
      </Text>
    </div>
  );

  const renderCreateModal = (
    <AnimatePresence exitBeforeEnter>
      {isModal && (
        <motion.div
          className="backdrop"
          variants={backdrop}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div
            className="modal"
            variants={modal}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {renderModalHeader}
            {renderBody}
            {renderCreateForm}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return <>{renderCreateModal}</>;
};

export const LiveAuctionModal = (props) => {
  const { isModal, setIsModal, currentBid, nextBid, handleBidMethod, symbol } = props;
  const [yourBid, setYourBid] = useState(nextBid);
  const renderModalHeader = (
    <div className="modal_header">
      <div></div>
      <img
        src={close}
        alt="close"
        width={24}
        onClick={() => setIsModal(false)}
      />
    </div>
  );

  const renderForm = (
    <div className="create_form">
      <Text>Current bid</Text>
      <div className="form_input">
        <section>{currentBid ? currentBid : 0}</section>
        <Text style={{ color: "#F79420" }}>{symbol}</Text>
      </div>
      <Text>Minimum bid</Text>
      <div className="form_input">
        <section>{nextBid}</section>
        <Text style={{ color: "#F79420" }}>{symbol}</Text>
      </div>
      <Text>Your bid</Text>
      <div className="form_input">
        <input type="number" defaultValue={nextBid} onChange={(e) => {setYourBid(e.target.value)}} />
        <Text style={{ color: "#F79420" }}>{symbol}</Text>
      </div>
      <Button variant="primary" type="submit" onClick={() => handleBidMethod(yourBid)}>
        Place Your Bid
      </Button>
    </div>
  );

  const renderBidModal = (
    <AnimatePresence>
      {isModal && (
        <motion.div
          className="backdrop"
          variants={backdrop}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div
            className="modal"
            variants={modal}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {renderModalHeader}
            {renderForm}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return <>{renderBidModal}</>;
};
