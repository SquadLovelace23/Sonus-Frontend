import React from 'react'
import { Toaster } from "react-hot-toast";

const ToasterComponent = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        error: {
          iconTheme: {
            primary: "var(--clr-white)",
            secondary: "var(--clr-black)",
          },
          style: {
            background: "var(--clr-dark)",
            color: "var(--clr-white)",
          },
        },
        success: {
          iconTheme: {
            primary: "var(--clr-white)",
            secondary: "var(--clr-black)",
          },
          style: {
            background: "var(--clr-dark)",
            color: "var(--clr-white)",
          },
        },
      }}
    />
  );
};

export default ToasterComponent;
