import React from "react";

import "../styles/components/button.scss";

function Button(props) {
  const { variant, onClick, children, style, ...rest } = props;

  const defaultStyle = {
    cursor: "pointer",
    whiteSpace: "nowrap",
    ...style,
  };

  return (
    <button
      className={`${variant}_btn`}
      onClick={onClick}
      type={props.type}
      style={defaultStyle}
      {...rest}
    >
      {children}
    </button>
  );
}

export default React.memo(Button);
