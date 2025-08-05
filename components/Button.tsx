// components/Button.tsx

import React from "react";

interface ButtonProps {
  type?: "button" | "submit" | "reset";
  text: string;
  stylebutton?: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  type = "button",
  text,
  stylebutton = "",
  onClick,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`cursor-pointer ${stylebutton}`}
    >
      {text}
    </button>
  );
};

export default Button;
