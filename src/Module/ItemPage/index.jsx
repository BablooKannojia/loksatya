import React, { useContext, useEffect } from "react";
import "./style/index.css";
import ItemPageCard1 from "../../Components/ItemPage/ItemPageCard1";
import { useTranslation } from "react-i18next";
import ImageCard from "../../Components/MainPage/ImageCard";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Empty, Skeleton } from "antd";
import { Loading } from "../../Context";
import axios from "axios";
import { API_URL } from "../../../API";
import LatesetNewsSection from "../../Components/SharedComponents/LatestNewsSection";
import { data } from "autoprefixer";
import StoriesCard from "../../Components/MainPage/StoriesCard";
import { HiOutlineChevronDoubleRight } from "react-icons/hi";
import AdCard from "../../Components/Global/AdCard";

const ItemPage = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const [topStories, settopStories] = useState();
  const [stories, setStories] = useState(null);
  const [bottomAd, setBottomAd] = useState({});
  const [paginationData, setPaginationData] = useState({
    total: 0,
    pages: 0,
    page: 1,
    hasNext: false,
    hasPrev: false
  });

  useEffect(() => {
    axios.get(`${API_URL}/ads?active=true&side=bottom`).then((data) => {
      const activeAds = data.data.filter((data) => data.active);
      setBottomAd(activeAds.reverse()[0]);
    });
  }, []);

  useEffect(() => {
    // Fetch stories when the component mounts
    const fetchStories = async () => {
      try {
        const response = await axios.get(`${API_URL}/story`);
        setStories(response.data);
      } catch (error) {
        console.error("Error fetching stories:", error);
      }
    };

    fetchStories();
  }, []);

  useEffect(() => {
    axios
      .get(
        `${API_URL}/article?pagenation=true&limit=4&type=img&newsType=topStories&status=online`
      )
      .then((data) => {
        settopStories(data.data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  async function onClickAd(id) {
    try {
      const response = await axios.post(`${API_URL}/ads/click`, { id });
    } catch (error) {
      console.error("Error updating ads:", error);
    }
  }
  
  const { search } = useLocation();
  const [Data, setData] = useState([]);
  const [isLoad, setIsLoad] = useState(true);
  const [isChange, setIsChange] = useState(true);
  const { loading, setLoading, effect } = useContext(Loading);
  const query = new URLSearchParams(search);
  const navigation = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  useEffect(() => {
    fetchData(currentPage);
  }, [effect, query.get("item"), query.get("sub"), currentPage]);

  const fetchData = (page) => {
    setIsLoad(true);
    window.scroll(0, 0);
    
    axios
      .get(
        `${API_URL}/article?category=${query.get("item")}&search=${query.get(
          "item"
        )}&keyword=${query.get("item")}&pagenation=true&page=${page}&limit=${itemsPerPage}&subCategory=${
          query.get("sub") ? query.get("sub") : ""
        }`
      )
      .then((response) => {
        // Filter to ensure only articles with status 'online'
        const onlineArticles = response.data.data.filter(
          (article) => article.status === "online"
        );

        // Set the filtered data and pagination info
        setData(onlineArticles);
        setPaginationData({
          total: response.data.total,
          pages: response.data.pages,
          page: response.data.page,
          hasNext: response.data.hasNext,
          hasPrev: response.data.hasPrev
        });
        setIsLoad(false);
      })
      .catch(() => {
        setIsLoad(false);
      });
  };

  // Handle next and previous buttons
  const handleNext = () => {
    if (paginationData.hasNext) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (paginationData.hasPrev) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Skeleton loader
  const SkeletonLoader = () => (
    <>
      {Array.from({ length: 7 }, (_, index) => (
        <div
          key={index}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <Skeleton.Image
            style={{ height: "180px", width: "260px" }}
            active={true}
          />
          <Skeleton style={{ marginLeft: 10 }} active={true} />
        </div>
      ))}
    </>
  );
  
  return (
    <>
      <div className="container2 container3 ">
        <div className="item-page-heading  details-main-related-new-area-heading">
          <div className="w-fit flex items-center gap-1">
            <span>{query?.get("item")} </span>
            <span>
              {query?.get("sub") && <HiOutlineChevronDoubleRight />}
            </span>{" "}
          </div>
          <div>
            {query?.get("sub") && (
              <div className="-mt-2 text-gray-900">
                <span style={{ fontSize: 16 }}>{query?.get("sub")}</span>
              </div>
            )}
          </div>
        </div>
        <div className="item-page-main-area">
          
          <div className="item-page-main-area-1">
            {isLoad ? (
              <>
                <SkeletonLoader />
              </>
            ) : Data.length > 0 ? (
              <>
                {Data.map((item, index) => {
                  let date = new Date(item.date);
                  date = JSON.stringify(date).split("T")[0].split('"')[1];
                  let title = item.title
                    .replace(/[/\%.?]/g, "")
                    .split(" ")
                    .join("-");
                  if (item.slug) {
                    title = item.slug;
                  }
                  return (
                    <div key={index}>
                      <div className="hidden sm:block">
                        <ItemPageCard1
                          onPress={() => {
                            if (item.type === "img") {
                              navigation(`/details/${title}?id=${item._id}`);
                            } else {
                              navigation(`/videos/${title}?id=${item._id}`);
                            }
                          }}
                          title={item?.title}
                          discription={item?.discription}
                          image={item?.image}
                          date={date}
                          type={item.type}
                        />
                      </div>
                      <div className="block sm:hidden">
                        <StoriesCard
                          data={data}
                          OnPress={() => {
                            if (item.type === "img") {
                              navigation(`/details/${title}?id=${item._id}`);
                            } else {
                              navigation(`/videos/${title}?id=${item._id}`);
                            }
                          }}
                          wid="w-[45%] h-[110px]"
                          image={item?.image}
                          text={item?.title}
                          date={date}
                        />
                      </div>
                    </div>
                  );
                })}
                {/* Pagination Controls */}
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  {/* Previous Button */}
                  <button
                    onClick={handlePrevious}
                    disabled={!paginationData.hasPrev}
                    className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Prev
                  </button>

                  {/* Show page numbers */}
                  {Array.from({ length: Math.min(5, paginationData.pages) }, (_, i) => {
                    let page;
                    if (currentPage < 3) {
                      page = i + 1;
                    } else if (currentPage > paginationData.pages - 2) {
                      page = paginationData.pages - 4 + i;
                    } else {
                      page = currentPage - 2 + i;
                    }

                    if (page > 0 && page <= paginationData.pages) {
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-10 h-10 rounded-md text-center ${
                            currentPage === page
                              ? "bg-red-500 text-white font-bold"
                              : "bg-gray-200 text-black hover:bg-gray-300"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    }
                    return null;
                  })}

                  {/* Next Button */}
                  <button
                    onClick={handleNext}
                    disabled={!paginationData.hasNext}
                    className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </>
            ) : (
              <div style={{ marginTop: 50 }}>
                <Empty />
              </div>
            )}
          </div>
          <div className="w-full md:hidden">
            <AdCard type={"mid"} />
          </div>
          <div className="item-page-main-area-2  pt-0 -mt-4 lg:-mt-0">
            <div className="item-page-main-area-2-news-cards w-full ">
              <LatesetNewsSection />
            </div>
          </div>
        </div>
      </div>
      {stories && stories.length > 0 && (
        <div className="visual-stories-main-container container2 container3">
          <div className="main-page-technology-heading">{t("vs")}</div>

          <div className="main-page-visual-story-Ad-container">
            <div className="main-page-visual-story-container">
              {stories.map((story) => {
                return (
                  <>
                    <a href={`/stories?id=${story._id}`} target="_blank" rel="noopener noreferrer">
                      <div key={story._id} className="visual-story-card">
                        <ImageCard
                          style={{
                            fontSize: "15px",
                            fontWeight: 400,
                            height: "80px",
                            borderRadius: 0,
                          }}
                          fromVStrories={true}
                          height="300px"
                          width="100"
                          img={story.images[0]?.img}
                          id={story._id}
                          title={story.title}
                          text={story.title}
                        />
                      </div>
                    </a>
                  </>
                );
              })}
            </div>
            <div className="main-page-Ad-container-visualStory">
              {bottomAd && (
                <a
                  href={bottomAd.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    onClickAd(bottomAd._id);
                  }}
                >
                  <img
                    alt=""
                    src={bottomAd.imgLink}
                    style={{ width: "100%", height: "100%" }}
                  />
                  <p style={{ fontSize: "16px", fontFamily: "Poppins" }}>
                    {bottomAd.slugName}
                  </p>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ItemPage;