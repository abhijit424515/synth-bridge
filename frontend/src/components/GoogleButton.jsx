import React from "react";

export default function GoogleButton(props) {
  const n = props.type == "login" ? "in" : "up";
  return (
    <div className="google-btn active:bg-[#1669f2] hover:shadow-[0_0_6px_#2463eb]">
      <div className="absolute w-10 h-10 bg-white ml-px mt-px rounded-sm">
        <img
          className="absolute w-[18px] h-[18px] ml-[11px] mt-[11px]"
          src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
        />
      </div>
      <p className="float-right text-white text-sm tracking-[0.2px] ml-0 mr-[11px] mt-[11px] mb-0">
        <b>Sign {n} with google</b>
      </p>
    </div>
  );
}
