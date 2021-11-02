import React from "react";
import { Link } from "react-router-dom";

//IMPORTING STYLESHEET

import "../styles/patterns/footer.scss";

//IMPORTING MEDIA ASSETS

import logofull from "../assets/logo/logofull.svg";
import instagram from "../assets/icons/instagram.svg";
import youtube from "../assets/icons/youtube.svg";
import twitter from "../assets/icons/twitter.svg";
import github from "../assets/icons/github.svg";

const usefullLinks = [
  { title: "Home", to: "/" },
  { title: "Marketplace", to: "/marketplace" },
  { title: "Tutorials", to: "/tutorials" },
];

const legalLinks = [
  { title: "Privacy Policy", to: "/privacy_policy" },
  { title: "Terms & Conditions", to: "/terms_and_conditions" },
];

const socialMediaLinks = [
  {
    title: "instagram",
    to: "https://www.instagram.com/smartreach_official/?hl=en-gb",
    image: instagram,
  },
  { title: "twitter", to: "https://twitter.com/Crypto_SI", image: twitter },
  { title: "github", to: "https://github.com/Bidify", image: github },
  {
    title: "youtube",
    to: "https://www.youtube.com/channel/UCcOzf3f6ZWVlIu-6qQpjudA",
    image: youtube,
  },
];

const Footer = () => {
  //RENDER LINKS

  const renderFooterLinks = (
    <div className="footer_links">
      <ul>
        <p>Useful Links</p>
        {usefullLinks.map((link, index) => {
          return (
            <li key={index}>
              <Link to={link.to}>{link.title}</Link>
            </li>
          );
        })}
      </ul>
      <ul>
        <p>Legal</p>
        {legalLinks.map((link, index) => {
          return (
            <li key={index}>
              <Link to={link.to}>{link.title}</Link>
            </li>
          );
        })}
      </ul>
      <ul>
        <p>Follow Us</p>
        {socialMediaLinks.map((link, index) => {
          return (
            <li key={index}>
              <a href={link.to} target="_blank" rel="noopener noreferrer">
                <img src={link.image} alt="icon" />
                <span>{link.title}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <div className="footer">
      <div className="footer_logo">
        <img src={logofull} alt="logo" width={170} />
      </div>
      {renderFooterLinks}
    </div>
  );
};

export default Footer;
