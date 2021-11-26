import React, { useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Web3 from "web3";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
//IMPORTING STYLESHEET

import "../styles/patterns/card.scss";

//IMPORTING COMPONENTS

import { Text, Button } from "../components";
import { CollectionModal } from "./modal";
import Prompt from "./prompt";

//IMPORTING MEDIA ASSETS

import playImg from "../assets/icons/play-circle.svg";
import pauseImg from "../assets/icons/pause-circle.svg";

//IMPORTING UTILITY PACKGAES

import { BIT, BIDIFY } from "../utils/config";
import { getDecimals, atomic } from "../utils/Bidify";
import { useWeb3React } from "@web3-react/core";
import { ERC721, ERC1155 } from "../utils/config";

const CollectionCard = (props) => {
  const { name, description, image, platform, token, getDetails, isERC721 } = props;

  const { chainId, account } = useWeb3React();
  const videoRef = useRef(null);

  // const account = '0x0B172a4E265AcF4c2E0aB238F63A44bf29bBd158'

  const [processContent, setProcessContent] = useState("");

  const [isVideo, setIsVideo] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isPlay, setIsPlay] = useState(false);

  const initialValues = {
    price: "",
    days: "",
    platform,
    token,
    currency: "0xc778417E063141139Fce010982780140Aa0cD5Ab"
    // currency: BIT.address[chainId],
  };

  const validationSchema = Yup.object({
    price: Yup.number()
      .typeError("price must be a number")
      .min(0, "price must be greater than 20")
      .required("This field is required"),
    days: Yup.number()
      .typeError("days must be a number")
      .min(1, "days must be greater than one day")
      .max(10, "days should be less than 10 days")
      .required("This field is required"),
  });

  const onSubmit = async (values, onSubmitProps) => {
    const { currency, platform, token, price, days } = values;
    setIsModal(false);
    setIsLoading(true);
    setProcessContent(
      "Please allow https://bidify.org permission within your wallet when prompted, there will be a small fee for this…"
    );
    try {
      await signList({ currency, platform, token, price, days, isERC721 });
      setProcessContent(
        "Confirm the second transaction to allow your NFT to be listed, there will be another small network fee."
      );
      await list({ currency, platform, token, price, days, isERC721 });
      setIsLoading(false);
      setIsSuccess(true);
      getDetails();
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
    } finally {
      onSubmitProps.setSubmitting(false);
      onSubmitProps.resetForm();
    }
  };

  async function signList({
    currency,
    platform,
    token,
    price,
    days,
    allowMarketplace = false,
    isERC721,
  }) {

    if (!currency) {
      currency = "0x0000000000000000000000000000000000000000";
    }

    const web3 = new Web3(window.ethereum);
    if(isERC721)
      await new web3.eth.Contract(ERC721.abi, platform).methods
        .approve(BIDIFY.address[chainId], token)
        .send({ from: account });
    else 
      await new web3.eth.Contract(ERC1155.abi, platform).methods
        .setApprovalForAll(BIDIFY.address[chainId], true)
        .send({ from: account });
  }

  async function list({
    currency,
    platform,
    token,
    price,
    days,
    allowMarketplace = false,
  }) {
    let decimals = await getDecimals(currency);
    if (!currency) {
      currency = "0x0000000000000000000000000000000000000000";
    }
    const Bidify = new new Web3(window.ethereum).eth.Contract(
      BIDIFY.abi,
      BIDIFY.address[chainId]
    );
    // return token;
    const tokenNum = isERC721 ? token : new Web3(window.ethereum).utils.hexToNumberString(token);
    try{
      return await Bidify.methods
      .list(
        currency,
        platform,
        tokenNum,
        atomic(price.toString(), decimals),
        days,
        "0x0000000000000000000000000000000000000000",
        allowMarketplace,
        isERC721
      )
      .send({ from: account });
    }catch (error) {
      return console.log("list error", error)
    }
    }
    

  const renderCreateForm = (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      <Form>
        <div className="create_form">
          <Text>Initial Bid Amount</Text>
          <div className="form_input">
            <Field type="number" name="price" id="price" />
            <Text style={{ color: "#F79420" }}>WETH</Text>
          </div>
          <ErrorMessage
            name="price"
            component="p"
            className="error_input_msg"
          />
          <Text>Bidding Days</Text>
          <div className="form_input">
            <Field type="number" name="days" id="days" />
          </div>
          <ErrorMessage
            name="days"
            component="div"
            className="error_input_msg"
          />
          <Button variant="primary" type="submit">
            Create Auction
          </Button>
        </div>
      </Form>
    </Formik>
  );

  const handlePlay = () => {
    if (videoRef) videoRef.current.play();
    setIsPlay(true);
  };

  const handlePause = () => {
    if (videoRef) videoRef.current.pause();
    setIsPlay(false);
  };

  const renderImage = (
    <div className="card_image">
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

  const renderContent = (
    <div className="card_content">
      <Text variant="primary" className="title">
        {name}
      </Text>
      <div className="description_block">
        <Text className="description">{description}</Text>
      </div>
      <Button variant="secondary" onClick={() => setIsModal(true)}>
        Create Auction
      </Button>
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
      <CollectionModal
        {...props}
        renderCreateForm={renderCreateForm}
        isModal={isModal}
        setIsModal={setIsModal}
        setIsLoading={setIsLoading}
        setIsError={setIsError}
        setIsSuccess={setIsSuccess}
      />
      <Prompt isModal={isLoading} processContent={processContent} />
      <Prompt
        variant="success"
        isModal={isSuccess}
        successContent={
          "Your NFT has now been listed and will be available to purchase on Bidify and all applicable Bidify powered sites and platforms."
        }
      />
      <Prompt variant="error" isModal={isError} />
    </>
  );
};

export default CollectionCard;
