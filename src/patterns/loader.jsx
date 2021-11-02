import React from "react";

//IMPORTING MEDIA ASSETS

import loader from "../assets/icons/loader.svg";

const Loader = () => {
  return (
    <div className="loader">
      <img src={loader} alt="loader" style={{ width: "3em" }} />
    </div>
  );
};

export default React.memo(Loader);
