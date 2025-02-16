"use client";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

const Providers = ({ children }) => {
  return (
    <>
      {children}
      <ProgressBar
        height="3px"
        color="#FBB100"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </>
  );
};

export default Providers;
