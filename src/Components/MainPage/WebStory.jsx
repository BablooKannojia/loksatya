import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import axios from "axios";
import { useEffect, useState } from "react";
import Stories from "react-insta-stories";
import { API_URL } from "../../../API";
import { useLocation } from "react-router-dom";
import AdCardPopup from "../DetailsPage/AdCardPopup";

function WebStory() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stories, setStories] = useState([]);
  const { pathname, search, state } = useLocation();
  const query1 = new URLSearchParams(search);
  const storyId = query1.get("id");

  useEffect(() => {
    // Fetch stories when the component mounts
    const fetchStories = async () => {
      try {
        const response = await axios.get(`${API_URL}/story?id=${storyId}`);
        setStories(response.data);
      } catch (error) {
        console.error("Error fetching stories:", error);
      }
    };
    fetchStories();
  }, []);

  const displayStories =
    stories && stories?.length > 0
      ? stories[0].images?.map((image, index) => {
          return {
            content: ({ action, isPaused }) => {
              const [active, setActive] = useState(false);
              useEffect(() => {
                setTimeout(() => {
                  setActive(true);
                }, 10);
              }, []);
              return (
                <div style={{ 
                  position: "relative",
                  height: "100%",
                  width: "100%"
                }}>
                  <img
                    className={`WebstroyCardImg ${
                      active ? " WebstroyCardImgActive" : ""
                    }`}
                    src={image?.img}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                    alt=""
                  />
                  <div
                    className={`WebstroyCardText ${
                      active ? " WebstroyCardTextActive" : ""
                    }`}
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      color: "white",
                      fontSize: "28px",
                      fontWeight: "800",
                      fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                      textShadow: "2px 2px 8px rgba(0,0,0,0.8)",
                      padding: "20px",
                      backgroundColor: "rgba(0,0,0,0.6)",
                      borderRadius: "12px",
                      wordWrap: "break-word",
                      whiteSpace: "normal",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: "vertical",
                      maxWidth: "80%",
                      textAlign: "center",
                      lineHeight: "1.4",
                      backdropFilter: "blur(2px)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.3)"
                    }}
                  >
                    {image?.text}
                  </div>
                </div>
              );
            },
          };
        })
      : null;

  const blurImgStoriesStyle =
    stories && stories?.length > 0
      ? stories[0].images?.map((image) => {
          return {
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          };
        })
      : null;

  function Increment() {
    if (stories?.length < 0 || !stories[0].images) return;
    if (currentIndex < stories[0].images?.length - 1) {
      setCurrentIndex((prevState) => prevState + 1);
    }
  }

  function Decrement() {
    if (currentIndex > 0) {
      setCurrentIndex((prevState) => prevState - 1);
    }
  }

  function containerStyles() {
    if (!blurImgStoriesStyle) return;
    return blurImgStoriesStyle[currentIndex];
  }

  const [adPopup, setAdPopup] = useState(false);

  useEffect(() => {
    setAdPopup(true);
  }, [stories]);

  return (
    <div className="h-[100vh]">
      <div className="z-[999]">
        {adPopup && (
          <AdCardPopup type={"top"} adPopup={adPopup} setAdPopup={setAdPopup} />
        )}
      </div>
      <div className="webStoryContainer h-full">
        <LeftOutlined
          className="webStoryControlIcon storyicon1"
          onClick={Decrement}
        />
        {stories?.length > 0 && (
          <div className="storySliderCard h-full">
            <Stories
              loop={true}
              keyboardNavigation={true}
              stories={displayStories}
              defaultInterval={5500}
              width="100%"
              height={"100%"}
              currentIndex={currentIndex}
              onStoryStart={(s, st) => setCurrentIndex(s)}
            />
          </div>
        )}
        <RightOutlined
          className="webStoryControlIcon storyicon2"
          onClick={Increment}
        />
      </div>
    </div>
  );
}

export default WebStory;