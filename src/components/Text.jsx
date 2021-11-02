import React from "react";

//STYLESHEET

import "../styles/components/typography.scss";

const Text = (props) => {
  const { children, variant, component, size, className, ...rest } = props;

  const getClassName = () => {
    switch (variant) {
      case "primary":
        return `text_primary size${size || 16} ${className || null}`;

      default:
        return `text_secondary size${size || 14} ${className || null}`;
    }
  };

  switch (component) {
    case "div":
      return (
        <div className={getClassName()} {...rest}>
          {children}
        </div>
      );
    case "span":
      return (
        <span className={getClassName()} {...rest}>
          {children}
        </span>
      );
    default:
      return (
        <p className={getClassName()} {...rest}>
          {children}
        </p>
      );
  }
};

export default React.memo(Text);
