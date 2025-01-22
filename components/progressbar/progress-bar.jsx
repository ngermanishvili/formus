"use client";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

const Providers = ({ children }) => {
  return (
    <>
      {children}
      <ProgressBar
        height="1px"
        color="#ABC188"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </>
  );
};

export default Providers;
