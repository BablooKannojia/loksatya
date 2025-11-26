import React from "react";
import { useNavigate } from "react-router-dom";

const DetailsNewsCard = ({ data }) => {
  const navigate = useNavigate();
  let title = data?.title.replace(/[%.?]/g, "").split(" ").join("-");
  if (data && data.slug) {
    title = data.slug;
  }

  return (
    <div className="Detail-news-card-mian-area">
      <img
        src={data?.image || ""}
        alt=""
        onClick={() => navigate(`/details/${title}?id=${encodeURIComponent(data?._id)}`)}
      />
      <div className="Detail-news-card-main-area-text">
        {data?.title || "International Aid Arrives In Flood-Hit Libya As More Bodies Wash Ashore"}
      </div>
    </div>
  );
};

export default DetailsNewsCard;

// import React from 'react'
// import { useNavigate } from 'react-router-dom';

// const DetailsNewsCard = ({data}) => {
//   const navigate = useNavigate()
//   let title = data?.title.replace(/[%.?]/g, "").split(" ").join("-");
//   if(data && data.slug){
//     title = data.slug
//   }
//   return (
//     <div className="Detail-news-card-mian-area">
//         <img src={data?.image} alt="" onClick={()=>navigate(`/details/${title}?id=${data?._id}`)}/>
//         <div className="Detail-news-card-main-area-text">
//         {data?data.title:"Nternational Aid Arrives In Flood-Hit Libya As More Bodies Wash Ashore"}
//         </div>
//     </div>
//   )
// }

// export default DetailsNewsCard