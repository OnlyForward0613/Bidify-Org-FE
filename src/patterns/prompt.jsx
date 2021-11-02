import React from "react";
import { motion, AnimatePresence } from "framer-motion";

//IMPORTING STYLESHEET

import "../styles/patterns/modal.scss";

//IMPORTING COMPONENTS

import { Text } from "../components";

//IMPORTING MEDIA ASSETS

import check_big from "../assets/icons/check_big.svg";
import error_outline from "../assets/icons/error_outline.svg";
import lock from "../assets/icons/lock.svg";
import transactionComplete from "../assets/abstracts/transactionComplete.svg";
import transactionIncomplete from "../assets/abstracts/transactionIncomplete.svg";
import transactionProcessing from "../assets/abstracts/transactionProcessing.svg";
import facebook from "../assets/icons/facebook.svg";
import instagram from "../assets/icons/instagram.svg";
import twitter from "../assets/icons/twitter.svg";

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modal = {
  hidden: { opacity: 0, transform: "translate(-50%, -50%) scale(2)" },
  visible: {
    opacity: 1,
    transform: "translate(-50%, -50%) scale(1)",
    transition: { delay: 0.25 },
  },
  exit: {
    opacity: 0,
    transform: "translate(-50%, -50%) scale(0)",
    top: "-100vh",
  },
};

const Prompt = ({
  variant,
  isModal,
  errorMessage,
  processContent,
  successContent = "",
}) => {
  const renderTitle = () => {
    switch (variant) {
      case "success":
        return "Transaction Complete";
      case "error":
        return "Transaction Incomplete";
      default:
        return "Transaction Processing";
    }
  };

  const renderContent = () => {
    switch (variant) {
      case "success":
        return successContent;
      case "error":
        return "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Id etiam fermentum, et odio pellentesque ultrices fringilla. Sem phasellus laoreet leo dui pellentesque ultrices.te";
      default:
        return processContent;
    }
  };

  const renderFooterImage = () => {
    switch (variant) {
      case "success":
        return check_big;
      case "error":
        return error_outline;
      default:
        return lock;
    }
  };

  const renderIllustration = () => {
    switch (variant) {
      case "success":
        return transactionComplete;
      case "error":
        return transactionIncomplete;
      default:
        return transactionProcessing;
    }
  };

  return (
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
            className="payment_modal"
            variants={modal}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="image">
              <img src={renderIllustration()} alt="illustration" />
            </div>
            <p className={`title ${variant}`}>{renderTitle()}</p>
            <Text>{errorMessage ? errorMessage : renderContent()}</Text>
            <div className="flex">
              <img src={renderFooterImage()} alt="icon" />
              {variant === "error" ? (
                <Text style={{ color: "#FF7360", fontweight: 500 }}>
                  Error code #12315
                </Text>
              ) : (
                <Text style={{ fontweight: 500 }}>
                  Secure Transaction By Metamask
                </Text>
              )}
            </div>
            {variant === "success" && (
              <div className="social_icons">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={facebook} alt="facebook" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={instagram} alt="instagram" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={twitter} alt="twitter" />
                </a>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Prompt;
