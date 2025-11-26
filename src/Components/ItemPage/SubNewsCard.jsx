import React from "react";
import "./style/index.css";
import { BsPlayCircle } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const SubNewsCard = ({ isVideo, data }) => {
  const navigation = useNavigate();
  
  let title = data?.title
    ?.replace(/[/\%.?]/g, "")
    ?.split(" ")
    ?.join("-") || "no-title";
  
  if (data?.slug) {
    title = data.slug;
  }

  const displayTitle = data?.title ? data.title.slice(0, 80) + "..." : "No title available";

  return (
    <div
      onClick={() => {
        if (data?._id) {
          navigation(`/details/${title}?id=${data._id}`);
        }
      }}
      className="sub-News-area-1-img-main"
      style={{ width: "100%", height: "100px" }}
    >
      <div className="sub-News-area-1-img">
        {data?.image && (
          <img src={data.image} alt={displayTitle} />
        )}
        <div>
          {isVideo && (
            <div className="item-video-card-length">
              <BsPlayCircle style={{ marginRight: "3px" }} /> 8:15
            </div>
          )}
        </div>
      </div>
      <div className="sub-News-area-1-text">
        {displayTitle}
      </div>
    </div>
  );
};

export default SubNewsCard;