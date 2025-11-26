import React from "react";
import "./style/index.css";
import { useState } from "react";
import { useEffect } from "react";

const ItemPageCard1 = ({ title, discription, date, image, onPress, type }) => {
  const [desc, SetDesc] = useState(discription);

  return (
    <div style={{ padding: "3px" }} className="">
      <div className="line"></div>
      <div
        className="item-page-card-main-conatiner flex py-2  h-fit sm:h-[245px] "
        onClick={onPress ? onPress : () => {}}
      >
        <div className=" w-[350px] h-full overflow-hidden">
          <img
            src={image}
            alt=""
            className=" h-full w-full box-border object-fill"
          />
        </div>

        <div className="item-page-card-main-conatiner-text ">
          <div className="heading-item-page-card-main-conatiner-text mt-0">
            {title}
          </div>
          <div className="date-item-page-card-main-conatiner-text">
            {date}
            {/* 15 august 2023 */}
          </div>
          <div
            className="text-item-page-card-main-conatiner-text text-sm  py-2 text-gray-500 itempage-desc"
            dangerouslySetInnerHTML={{ __html: desc }}
          >
            {/* {desc} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemPageCard1;
