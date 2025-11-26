import React, { useEffect, lazy, Suspense } from "react";

import "./style/index.css";
import DetailImg from "../../assets/detailsPage.png";
import RelatedNewsCard from "../../Components/DetailsPage";
import { FaUser } from "react-icons/fa6";
import { AiOutlineCalendar, AiFillHeart } from "react-icons/ai";
import { TiHeartOutline } from "react-icons/ti";
import { RiMessage2Fill } from "react-icons/ri";
import { GrShareOption } from "react-icons/gr";
import { BsWhatsapp } from "react-icons/bs";
import { FaRegComment } from "react-icons/fa";
import DetailsNewsCard from "../../Components/DetailsPage/NewsCard";
import DetailsVideoCard from "../../Components/DetailsPage/VideoCard";
import AdCard from "../../Components/Global/AdCard";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router-dom";
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { Col, Input, Modal, Row, Spin, message, Skeleton } from "antd";
import { Loading } from "../../Context";
import { useContext } from "react";
import { API_URL } from "../../../API";
// import LatesetNewsSection from "../../Components/SharedComponents/LatestNewsSection";
// import RelatedNewsSection from "../../Components/SharedComponents/RelatedNewSection";
import { InstagramFilled } from "@ant-design/icons";
// import AdCardPopup from "../../Components/DetailsPage/AdCardPopup";
// import StoriesCard from "../../Components/MainPage/StoriesCard";
import { Title } from "chart.js";

const StoriesCard = lazy(() => import("../../Components/MainPage/StoriesCard"));
const LatesetNewsSection = lazy(() => import("../../Components/SharedComponents/LatestNewsSection"));
const AdCardPopup = lazy(() => import("../../Components/DetailsPage/AdCardPopup"));
const RelatedNewsSection = lazy(() => import("../../Components/SharedComponents/RelatedNewSection"));

const { TextArea } = Input;

// Instagram share button (custom implementation)
const InstagramShareButton = ({ url }) => {
  const handleInstagramShare = () => {
    const instagramUrl = `https://www.instagram.com/?url=${encodeURIComponent(
      url
    )}`;
    window.open(instagramUrl, "_blank");
  };

  return (
    <button
      onClick={handleInstagramShare}
      style={{
        backgroundColor: "#C02A50",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        padding: "4px",
        marginTop: "-8px",
      }}
    >
      <InstagramFilled style={{ fontSize: "20px" }} />
    </button>
  );
};
// Babloo In your URL parsing (where you read the ID):
function findStoryIdFromUrl(pathname) {
  const idRegex = /id=([^&]+)/;
  const idMatch = pathname.match(idRegex);

  if (idMatch) {
    try {
      // Decode the entire ID parameter
      return decodeURIComponent(idMatch[1]);
    } catch (e) {
      console.error("Error decoding ID:", e);
      return idMatch[1]; // Return raw if decoding fails
    }
  } else {
    console.log("ID parameter not found in the URL.");
    return null;
  }
}

const DetailsPage = () => {
  const { pathname, search } = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [article, setArticle] = useState(null);
  const [name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [userData, setUserData] = useState([]);
  const { t, i18n } = useTranslation();
  const navigation = useNavigate();
  const { loading, setLoading, effect } = useContext(Loading);
  const storyId = findStoryIdFromUrl(search);
  const query = new URLSearchParams(search);

  const [topStories, settopStories] = useState([]);
  const [breakingNews, setBreakingNews] = useState([]);
  const [relatedNews, setRelatedNews] = useState([]);
  const [adPopup, setAdPopup] = useState(false);

  const title = data?.title || "Loksatya News";

  const getOptimizedImageUrl = (image) => {
    console.log('🖼️ getOptimizedImageUrl called with:', image);

    if (!image) {
      console.log('❌ No image provided');
      return 'https://loksatya.com/assets/Logo-new-BNYCZvJK.PNG';
    }

    // If it's already a full URL, return as is
    if (image.startsWith('http')) {
      console.log('🔗 HTTP URL detected');

      // Clean up Firebase URLs - IMPORTANT for social media crawlers
      if (image.includes('firebasestorage.googleapis.com')) {
        // Remove all parameters and add only essential ones
        const cleanUrl = image.split('?')[0];
        const finalUrl = cleanUrl + '?alt=media';
        console.log('🔥 Firebase URL cleaned:', finalUrl);
        return finalUrl;
      }

      console.log('✅ Returning original URL:', image);
      return image;
    }

    // If it's a relative path, make it absolute
    const absoluteUrl = `https://loksatya.com${image.startsWith('/') ? '' : '/'}${image}`;
    console.log('🔄 Converted relative to absolute:', absoluteUrl);
    return absoluteUrl;
  };

  const [imgUrl, setImgUrl] = useState('');

  useEffect(() => {
    if (data?.image) {
      const optimizedUrl = getOptimizedImageUrl(data.image);
      console.log('🎯 Final optimized image URL for meta tags:', optimizedUrl);
      setImgUrl(optimizedUrl);
    } else {
      // Fallback only if no image
      setImgUrl('https://loksatya.com/assets/Logo-new-BNYCZvJK.PNG');
    }
  }, [data?.image]);

  // Firebase URL को completely replace करें CDN के साथ
  // let imageUrl = data.image;
  let imageUrl = 'https://loksatya.com/assets/Logo-new-BNYCZvJK.PNG'; // Your website logo


  if (data.image && !data.image.includes('firebasestorage')) {
    imageUrl = data.image;
  }

  // Fallback
  if (!imageUrl) {
    imageUrl = 'https://loksatya.com/assets/Logo-new-BNYCZvJK.PNG';
  }

  // let imageUrl = data.image;
  // ✅ Firebase URL को optimize करें
  // if (imageUrl && imageUrl.includes('firebasestorage.googleapis.com')) {
  //   // Firebase URL को clean करें
  //   imageUrl = imageUrl.split('?')[0]; // Remove query parameters
  //   imageUrl += '?alt=media'; // Add only essential parameter
  // }

  // ✅ Fallback अगर image नहीं है
  // if (!imageUrl) {
  //   imageUrl = 'https://loksatya.com/logo.png'; // Your website logo
  // }

  const description = data?.discription
    ? data.discription.replace(/<[^>]*>/g, '').substring(0, 160) + '...'
    : 'Stay updated with the latest news at Loksatya.';

useEffect(() => {
    if (data && data._id) {
      debugMetaTags();
      
      // Also set content properly
      if (data.discription) {
        const processedHtml = data.discription
          .replace(/<blockquote class="twitter-tweet">/g, 
            '<blockquote class="twitter-tweet" data-lang="hi" data-theme="light">')
          .replace(/<script async="" src="https:\/\/platform\.twitter\.com\/widgets\.js" charset="utf-8"><\/script>/g, '');

        document.getElementById("mob_parar").innerHTML = processedHtml;
        document.getElementById("parar").innerHTML = processedHtml;
      }
    }
  }, [data]);

  // 27-10-25
  const generateShareUrl = (id, title) => {
    if (!id || !title) return 'https://loksatya.com';

    try {
      const slug = title.replace(/[/\%.?]/g, "").split(" ").join("-");
      const encodedId = encodeURIComponent(id);

      // ✅ Direct production URL
      const directUrl = `https://loksatya.com/details/${slug}?id=${encodedId}`;

      // ✅ Backend share URL for crawlers
      const crawlerUrl = `https://admin.loksatya.com/api/shareUrl?relocation=${encodeURIComponent(directUrl)}&id=${id}`;

      console.log('🔗 URL Debug Info:');
      console.log('📰 Article Title:', title);
      console.log('🆔 Article ID:', id);
      console.log('🎯 Direct URL:', directUrl);
      console.log('🤖 Crawler URL:', crawlerUrl);
      console.log('---');

      return directUrl; // या crawlerUrl, आपकी requirement के according

    } catch (error) {
      console.error('❌ Error generating share URL:', error);
      return 'https://loksatya.com';
    }
  };

  // shareurl variable को भी update करें
  const shareurl = data ? generateShareUrl(data._id, data.title)
    : `https://loksatya.com${window.location.pathname}${window.location.search}`;

useEffect(() => {
  const href = window.location.href;

  if (!storyId) {
    console.error('❌ No story ID found');
    setLoading(false);
    return;
  }

  axios
    .get(`${API_URL}/article?id=${storyId}&url=${href}`)
    .then((res) => {
      console.log("✅ Raw API response:", res);

      if (!res.data || !res.data[0]) {
        console.error("❌ No article data found");
        setLoading(false);
        return;
      }

      const articleData = res.data[0];
      console.log("📰 Single article:", articleData);

      setArticle(articleData);
      setData(articleData);
      setLoading(false);
    })
    .catch((err) => {
      console.error("❌ API error:", err);
      setLoading(false);
    });
}, [storyId]);


  useEffect(() => {
    axios.get(`${API_URL}/comment?id=${query.get("id")}`).then((res) => {
      // console.log("article from api : ", res.data);
      setData2(res.data);
    });
  }, []);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  const onAdd = () => {
    setLoading2(true);
    // console.log(
    //   { email: Email, name, message: comment, postId: data._id },
    //   "dd"
    // );
    axios
      .post(`${API_URL}/comment`, {
        email: Email,
        name,
        message: comment,
        postId: data._id,
      })
      .then((users) => {
        setUserData(users.data.data);
        message.success("Successfully Added");
        handleCancel();
        setLoading2(false);
      })
      .catch((err) => {
        console.log(err);
        message.error("Successfully Not Added");
        setLoading2(false);
        message.success("Successfully Added");
      });
  };

  useEffect(() => {
    axios
      .get(
        `${API_URL}/article?pagenation=true&limit=7&type=img&newsType=topStories&status=online`
      )
      .then((data) => {
        console.log("settopStories",data.data.data)
        settopStories(data.data.data);
      })
      .catch(() => {});
    axios
      .get(
        `${API_URL}/article?pagenation=true&limit=7&type=img&newsType=breakingNews&status=online`
      )
      .then((data) => {
        setBreakingNews(data.data.data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!data) {
      console.error("❌ No article data yet");
      return;
    }

    if (!Array.isArray(data.keyWord) || data.keyWord.length === 0) {
      console.warn("⚠️ No keywords found for article:", data.title);
      setRelatedNews([]);
      return;
    }

    // Combine breakingNews and topStories into one array
    const combinedNews = [...breakingNews, ...topStories];
    // console.log("Combined news:", combinedNews);

    // Step 1: Filter by keywords
    let filteredNews = combinedNews.filter(
      (newsItem) =>
        newsItem.keyWord?.some((keyword) => data.keyWord.includes(keyword)) && // Matches any keyword
        newsItem._id !== data._id // Exclude the current data
    );

    // console.log("Filtered news by keywords:", filteredNews);

    // Step 2: If no keyword matches, fallback to newsType
    if (filteredNews.length < 1) {
      console.warn("No news matched keywords. Falling back to newsType match.");
      filteredNews = combinedNews.filter(
        (newsItem) =>
          newsItem.topic === data.topic && // Matches the news type
          newsItem._id !== data._id // Exclude the current data
      );
    }

    // console.log("Final filtered news (after fallback):", filteredNews);

    // Step 3: Update relatedNews state
    setRelatedNews([...filteredNews]); // Ensure a new reference to trigger state updates
  }, [data, breakingNews, topStories]);

  const formatDatetime = (datetimeStr) => {
    if (!datetimeStr) return "12|08|2023 12:15"; // Default date if no datetime string is provided

    const dateObj = new Date(datetimeStr);

    const formattedDatetimeStr = `
        ${String(dateObj.getDate()).padStart(2, "0")}|
        ${String(dateObj.getMonth() + 1).padStart(2, "0")}|
        ${dateObj.getFullYear()} 
        ${String(dateObj.getHours()).padStart(2, "0")}:
        ${String(dateObj.getMinutes()).padStart(2, "0")}
      `
      .replace(/\s+/g, " ")
      .trim(); // Replace multiple spaces with a single space and trim

    return formattedDatetimeStr;
  };

  const newFormatDate = (datetimeStr) => {
    // console.log("newFormatDate", i18n.language);

    // Create a Date object from the input string
    const date = new Date(datetimeStr);

    // Set up options for date and time
    const dateOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const timeOptions = {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    };

    // Format the date and time separately
    const formattedDate = date.toLocaleDateString(
      i18n.language === "ur"
        ? "ur-PK"
        : i18n.language === "hi"
        ? "hi-IN"
        : "en-GB",
      dateOptions
    );
    const formattedTime = date.toLocaleTimeString(
      i18n.language === "ur"
        ? "ur-PK"
        : i18n.language === "hi"
        ? "hi-IN"
        : "en-GB",
      timeOptions
    );

    // Combine date and time for output
    let formattedDateTime;
    if (i18n.language === "ur") {
      formattedDateTime = `${formattedTime} ${formattedDate}`;
    } else {
      formattedDateTime = `${formattedDate}, ${formattedTime}`;
    }

    return formattedDateTime;
  };

  // debugMetaTags function में
  const debugMetaTags = () => {
    if (!data) {
      console.log('❌ No data available for meta tags');
      return;
    }

    console.log('=== 🔍 META TAGS DEBUG INFO ===');
    console.log('📰 Article Title:', data.title);
    console.log('📝 Description:', description);
    console.log('🖼️ Image URL:', imgUrl);
    console.log('Share URL:', shareurl);

    // ✅ Cleaned Image URL show करें
    // let debugImageUrl = data.image;
    // if (debugImageUrl && debugImageUrl.includes('firebasestorage.googleapis.com')) {
    //   debugImageUrl = debugImageUrl.split('?')[0] + '?alt=media';
    // }
    // console.log('🖼️ Cleaned Image:', debugImageUrl);
    console.log('🔗 Share URL:', shareurl);
    console.log('🆔 Article ID:', data._id);

    // Check if meta tags are properly set
    const metaTags = document.querySelectorAll('meta');
    console.log('📋 Total Meta Tags Found:', metaTags.length);

    // Specific meta tags check
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogImage = document.querySelector('meta[property="og:image"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const ogUrl = document.querySelector('meta[property="og:url"]');

    console.log('✅ og:title:', ogTitle ? ogTitle.getAttribute('content') : 'MISSING');
    console.log('✅ og:image:', ogImage ? ogImage.getAttribute('content') : 'MISSING');
    console.log('✅ og:description:', ogDescription ? ogDescription.getAttribute('content') : 'MISSING');
    console.log('✅ og:url:', ogUrl ? ogUrl.getAttribute('content') : 'MISSING');
    console.log('============================');
  };

  // useEffect में call करें
  useEffect(() => {
    if (data && data._id) {
      debugMetaTags();
    }
  }, [data]);

  const generateShareUrlFacebook = (id, title, forFacebook = false) => {
    if (!id || !title) return 'https://loksatya.com';

    try {
      const slug = title.replace(/[/\%.?]/g, "").split(" ").join("-");
      const encodedId = encodeURIComponent(id);

      // Real page (for normal users)
      const directUrl = `https://loksatya.com/details/${slug}?id=${encodedId}`;

      // Backend API proxy (for crawlers)
      const crawlerUrl = `https://loksatya.com/api/shareUrl?relocation=${encodeURIComponent(directUrl)}&id=${id}`;
      // const crawlerUrl = `https://admin.loksatya.com/api/shareUrl?relocation=${encodeURIComponent(directUrl)}&id=${id}`;

      console.log('🔗 URL Debug Info:');
      console.log('📰 Article Title:', title);
      console.log('🆔 Article ID:', id);
      console.log('🎯 Direct URL:', directUrl);
      console.log('🤖 Crawler URL:', crawlerUrl);
      console.log('---');

      // 👉 Facebook ko hamesha backend proxy dena hai
      return forFacebook ? crawlerUrl : directUrl;

    } catch (error) {
      console.error('❌ Error generating share URL:', error);
      return 'https://loksatya.com';
    }
  };


// Add this useEffect hook to your component
useEffect(() => {
  // Function to load Twitter widgets
  const loadTwitterWidgets = () => {
    if (window.twttr) {
      window.twttr.widgets.load();
    } else {
      const script = document.createElement('script');
      script.src = 'https://platform.twitter.com/widgets.js';
      script.async = true;
      script.charset = 'utf-8';
      document.body.appendChild(script);
    }
  };

  // Load Twitter widgets when component mounts
  loadTwitterWidgets();

  // Also load widgets when content changes (if you're using dynamic content)
  const observer = new MutationObserver(() => {
    loadTwitterWidgets();
  });

  // Observe changes to the content container
  const contentContainer = document.getElementById('parar');
  if (contentContainer) {
    observer.observe(contentContainer, {
      childList: true,
      subtree: true
    });
  }

  return () => {
    observer.disconnect();
  };
}, [data]); // Add dependencies as needed
// Replace your current content setting code with this:

useEffect(() => {
  if (data?.discription) {
    // Process the description to ensure Twitter embeds work AND fix fonts
    const processedHtml = data.discription
      .replace(/<blockquote class="twitter-tweet">/g, 
        '<blockquote class="twitter-tweet" data-lang="hi" data-theme="light">')
      .replace(/<script async="" src="https:\/\/platform\.twitter\.com\/widgets\.js" charset="utf-8"><\/script>/g, '')
      // Font size fixes in HTML
      .replace(/font-size:[^;"]*%;?/gi, 'font-size:16px;')
      .replace(/<font[^>]*size[^>]*>/gi, '<font style="font-size:16px;">')
      .replace(/style="[^"]*font-size[^;"]*%;[^"]*"/gi, 'style="font-size:16px;"');

    // Set the processed HTML
    document.getElementById("mob_parar").innerHTML = processedHtml;
    document.getElementById("parar").innerHTML = processedHtml;

    // Apply font fixes after content is set
    // setTimeout(() => {
    //   document.querySelectorAll('#mob_parar *, #parar *').forEach(el => {
    //     el.style.fontSize = '16px';
    //     el.style.fontFamily = '"Noto Sans Devanagari", "Arial", sans-serif';
    //   });
    // }, 100);

    // Manually load Twitter widgets after content is set
    if (window.twttr && window.twttr.widgets) {
      window.twttr.widgets.load();
    }
  }
}, [data?.discription]);

useEffect(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (window.twttr) {
          window.twttr.widgets.load(entry.target);
        }
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.twitter-tweet').forEach(tweet => {
    observer.observe(tweet);
  });

  return () => observer.disconnect();
}, [data?.discription]);

  // console.log("this is coming from the new article", article);

  useEffect(() => {
    setAdPopup(true);
  }, [data]);

  // console.log("detail article data : ", data);

  return (
    <div className=" relative">
      <>
        {/* Ad Popup */}
        {adPopup && (
          <AdCardPopup type={"top"} adPopup={adPopup} setAdPopup={setAdPopup} />
        )}
      </>

      {/* <Helmet>
        <title>{title}</title>
        <meta name="description" content={description?.replace(/<[^>]*>/g, '').substring(0, 160)} />

        <link rel="canonical" href={shareurl} />

        <meta property="og:type" content="article" />
        <meta property="og:title" content={title} />
        <meta property="og:url" content={shareurl} />
        <meta property="og:image" content={imgUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:description" content={description?.replace(/<[^>]*>/g, '').substring(0, 160)} />
        <meta property="og:site_name" content="LokSatya News" />
        <meta property="og:locale" content="en_US" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description?.replace(/<[^>]*>/g, '').substring(0, 160)} />
        <meta name="twitter:image" content={imgUrl} />
        <meta name="twitter:site" content="@LokSatyaNews" />

        <meta name="author" content={data?.reportedBy || 'LokSatya'} />
      </Helmet> */}

      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />

        {/* ✅ Canonical URL */}
        <link rel="canonical" href={shareurl} />

        {/* ✅ Open Graph Meta Tags */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={imgUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content={shareurl} />
        <meta property="og:site_name" content="LokSatya News" />
        <meta property="og:locale" content="hi_IN" />

        {/* ✅ Twitter Card Meta Tags - property attribute use करें */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:image" content={imgUrl} />
        <meta property="twitter:site" content="@LokSatyaNews" />
        <meta property="twitter:creator" content="@LokSatyaNews" />

        {/* ✅ Additional Meta Tags */}
        <meta name="author" content={data?.reportedBy || 'LokSatya'} />
      </Helmet>


      {/* mobile version  */}
      <div className="mobileDetailsPage ">
        <div className="">
          <AdCard type={"mid"} />
        </div>
        <div className="p-2">
          <h1 style={{ fontSize: "20px", fontWeight: "bold" }} className="details-page-main-heading">
            {loading ? (
              <Skeleton paragraph={{ rows: 1 }} active />
            ) : (
              data?.title
            )}
          </h1>
          <p>
            {
              loading ? (
                <Skeleton paragraph={{ rows: 1 }} active />
              ) : (
                <>
                  <span className="font-bold">Reported By: </span>
                  {data?.reportedBy}
                </>
              )
            }
          </p>
          {/* <p>
            <span className="font-bold">Date: </span>
            {data?.date}
          </p> */}
          <p>
            {
              loading ? (
                <Skeleton paragraph={{ rows: 1 }} active />
              ) : (<>
                <span className="font-bold">Date & Time: </span>
                {data ? newFormatDate(data.updatedAt) : "12|08|2023 12:15"}
              </>)
            }
          </p>
          {/* <p>
            <span className="font-bold">Time: </span>
            {data ? newFormatDate(data.updatedAt) : "12|08|2023 12:15"}
          </p> */}
        </div>

        <div className="details-page-top-item3 -mt-2  px-2 pb-2">
          {isFav ? (
            <>
              <AiFillHeart
                style={{ marginRight: "18px" }}
                color="red"
                onClick={() => setIsFav(!isFav)}
              />
            </>
          ) : (
            <TiHeartOutline
              style={{ marginRight: "18px" }}
              onClick={() => setIsFav(!isFav)}
            />
          )}
          {data ? (
            data.comment ? (
              <RiMessage2Fill
                style={{ marginRight: "18px" }}
                onClick={() => {
                  showModal();
                }}
              />
            ) : null
          ) : null}
          <div style={{ position: "relative" }}>
            <GrShareOption
              style={{ marginRight: "18px", cursor: "pointer" }}
              onClick={() => setIsOpen(!isOpen)}
            />
            <div
              style={{
                position: "absolute",
                height: "30px",
                width: "150px",
                backgroundColor: "#5a5a5a",
                borderRadius: 100,
                bottom: -40,
                left: -20,
                alignItems: "center",
                justifyContent: "space-around",
                display: isOpen ? "flex" : "none",
                paddingTop: 10,
                paddingLeft: 5,
                paddingRight: 5,
              }}
            >
            <FacebookShareButton
              url={generateShareUrlFacebook(data._id, data.title, true)}
              quote={data.title}
              hashtag="#LokSatyaNews"
              beforeOnClick={() => {
                console.log('🎯 Facebook Share Button Clicked!');
                console.log('📤 Sharing URL:', shareurl);
                console.log('📝 Sharing Title:', title);
                console.log('🖼️ Sharing Image:', imgUrl);
                console.log('📋 Sharing Description:', description);
                return true;
              }}
            >
              <FacebookIcon size={32} round />
            </FacebookShareButton>
              <TwitterShareButton
                url={shareurl}
                title={`${title} - ${description?.substring(0, 100)}`}
                // title={title}
                // hashtags={data?.keyWord?.slice(0, 2) || ['LokSatya News']}
                className="Demo__some-network__share-button"
              >
                <TwitterIcon size={32} round />
              </TwitterShareButton>
              <EmailShareButton
                url={shareurl}
                subject={title}
                body={`Check this out: ${title} \n ${shareurl} \n ${imgUrl}`}
                className="Demo__some-network__share-button"
              >
                <EmailIcon size={32} round />
              </EmailShareButton>
              <InstagramShareButton url={window.location.href} />
            </div>
          </div>
          {/* whatsapp share */}
          <div>
            {/* WhatsApp share button को update करें */}
            <WhatsappShareButton
              url={shareurl}
              title={`${data?.title || 'LokSatya News'}`}
              // title={`${data?.title || 'LokSatya News'}\n\n${data?.discription?.replace(/<[^>]*>/g, '').substring(0, 100) || 'Latest news on LokSatya'}\n\n`}
              // separator="\n"
              className="Demo__some-network__share-button"
            >
              <WhatsappIcon size={32} round style={{ marginTop: "10px" }} />
            </WhatsappShareButton>
          </div>
        </div>
        <div className="mobileDetailsMainImage ">
          <img
            src={data ? data?.image : DetailImg}
            alt=""
            loading="lazy"
            className="details-page-main-img"
          />
        </div>
        <div className="container3">
          <div className="deatils-main-para-area " id="mob_parar"></div>

          <div className="container-detail-page-rigth-side mt-3 ">
            {relatedNews && (
              <div className="details-page-related-news">
                <div className="details-page-related-news-heading">
                  {t("rn")}
                </div>
              </div>
            )}
            {/* <div className="detail-page-relate-new-cards">
              {relatedNews?.slice(0, 5)?.map((data) => {
                let title = data.title
                  .replace(/[/\%.?]/g, "")
                  .split(" ")
                  .join("-");
                if (data.slug) {
                  title = data.slug;
                }
                if (data._id === storyId) return;
                const OnPress = () => {
                  navigation(`/details2/${title}?id=${encodeURIComponent(data?._id)}`);
                };
                const text = data?.title.substring(0, 45) + "...";
                const image = data?.image;
                return (
                  <Suspense fallback={<div>Loading card...</div>}>
                    <StoriesCard
                      data={data}
                      key={data._id} 
                      OnPress={() =>
                        navigation(`/details2/${title}?id=${encodeURIComponent(data?._id)}`)
                      }
                      wid="w-[45%] h-[110px]"
                      image={data?.image}
                      text={data?.title}
                    />
                  </Suspense>
                );
              })}
            </div> */}
            <div className="detail-page-relate-new-cards">
              {relatedNews?.slice(0, 5)?.map((data) => {
                let title = data.title
                  .replace(/[/\%.?]/g, "")
                  .split(" ")
                  .join("-");
                if (data.slug) {
                  title = data.slug;
                }
                if (data._id === storyId) return null; // return null, not undefined

                return (
                  <Suspense
                    key={data._id} // ✅ key must be here
                    fallback={<div>Loading card...</div>}
                  >
                    <StoriesCard
                      data={data}
                      OnPress={() =>
                        navigation(
                          `/details/${title}?id=${encodeURIComponent(data?._id)}`
                        )
                      }
                      wid="w-[45%] h-[110px]"
                      image={data?.image}
                      text={data?.title}
                    />
                  </Suspense>
                );
              })}
            </div>

            <Suspense fallback={<div>Loading...</div>}>
              <LatesetNewsSection />
            </Suspense>
            <div className="w-full ">
              <Suspense fallback={<div>Loading...</div>}>
                <AdCard type={"bottom"} />
              </Suspense>
            </div>
            {data?.comment ? (
              <div className="details-comment-area">
                <div
                  className="comment-button"
                  style={{ cursor: "pointer" }}
                  onClick={showModal}
                >
                  <FaRegComment style={{ marginRight: "10px" }} /> Comment
                </div>
              </div>
            ) : (
              <></>
            )}
            {data2.map(({ name, message }) => {
              return (
                <div style={{ display: "flex", marginTop: "10px" }}>
                  <div>
                    <div
                      style={{
                        fontSize: "25px",
                        fontFamily: "Poppins",
                        backgroundColor: "rgba(0,0,0,0.1)",
                        padding: "10px 20px",
                        display: "flex",
                        height: 30,
                      }}
                    >
                      {data2 && name[0].toUpperCase()}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: "16px",
                      fontFamily: "Poppins",
                      backgroundColor: "rgba(0,0,0,0.1)",
                      padding: "5px 10px",
                      width: "200px",
                      display: "flex",
                      marginLeft: 10,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: "16px",
                          fontFamily: "Poppins",
                          fontWeight: "600",
                        }}
                      >
                        {data2 && name.toUpperCase()}
                      </div>
                      <div
                        style={{
                          fontSize: "16px",
                          fontFamily: "Poppins",
                        }}
                      >
                        {data2 && message}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Laptop version  */}
      <div className="detail-page-top-container container2 container3 webDetailsContainer ">
        <div className="container-detail-page-left-side ">
          {
              loading ? (
                <Skeleton paragraph={{ rows: 1 }} style={{ width: '100%', height: 200 }} active />
              ) : (
                <h1 className="details-page-main-heading">{data?.title}</h1>
              )
            }
          {/* <h1 className="details-page-main-heading">{data?.title}</h1> */}
          <div className="details-page-top-items">
            <div className="details-page-top-item1">
              <FaUser style={{ marginRight: "10px" }} />
              {
                loading ? (
                  <Skeleton paragraph={{ rows: 1 }} style={{ width: '100%', height: 10 }} active />
                ) : (
                  <>
                    {data?.reportedBy}
                  </>
                )}
              {/* {console.log(data)} */}
            </div>
            <div className="details-page-top-item2">
              <AiOutlineCalendar size={22} style={{ marginRight: "10px" }} />
              {
                loading ? (
                  <Skeleton paragraph={{ rows: 1 }} style={{ width: '100%', height: 10 }} active />
                ) : (
                  <>
                    {data ? newFormatDate(data.updatedAt) : "12|08|2023 12:15"}
                  </>)}
            </div>

            <div className="details-page-top-item3 ">
              {isFav ? (
                <>
                  <AiFillHeart
                    style={{ marginRight: "18px" }}
                    color="red"
                    onClick={() => setIsFav(!isFav)}
                  />
                </>
              ) : (
                <TiHeartOutline
                  style={{ marginRight: "18px" }}
                  onClick={() => setIsFav(!isFav)}
                />
              )}
              {data ? (
                data.comment ? (
                  <RiMessage2Fill
                    style={{ marginRight: "18px" }}
                    onClick={() => {
                      showModal();
                    }}
                  />
                ) : null
              ) : null}
              <div style={{ position: "relative" }}>
                <GrShareOption
                  style={{ marginRight: "18px", cursor: "pointer" }}
                  onClick={() => setIsOpen(!isOpen)}
                />
                <div
                  style={{
                    position: "absolute",
                    height: "30px",
                    width: "150px",
                    backgroundColor: "#5a5a5a",
                    borderRadius: 100,
                    bottom: -40,
                    left: -20,
                    alignItems: "center",
                    justifyContent: "space-around",
                    display: isOpen ? "flex" : "none",
                    paddingTop: 10,
                    paddingLeft: 5,
                    paddingRight: 5,
                  }}
                >
                <FacebookShareButton
                  // url={shareurl}
                  url={generateShareUrlFacebook(data._id, data.title, true)}
                  quote={data.title}
                  // quote={title}
                  hashtag="#LokSatyaNews"
                  beforeOnClick={() => {
                    console.log('🎯 Facebook Share Button Clicked!');
                    console.log('📤 Sharing URL:', shareurl);
                    console.log('📝 Sharing Title:', title);
                    console.log('🖼️ Sharing Image:', imgUrl);
                    console.log('📋 Sharing Description:', description);
                    return true;
                  }}
                >
                  <FacebookIcon size={32} round />
                </FacebookShareButton>
                  <TwitterShareButton
                    url={shareurl}
                    title={`${title} - ${description?.substring(0, 100)}`}
                    // title={title}
                    // hashtags={data?.keyWord?.slice(0, 2) || ['LokSatya News']}
                    // url={shareurl}
                    // title={title}
                    className="Demo__some-network__share-button"
                  >
                    <TwitterIcon size={32} round />
                  </TwitterShareButton>
                  <EmailShareButton
                    url={shareurl}
                    subject={title}
                    body={`Check this out: ${title} \n ${shareurl} \n ${imgUrl}`}
                    className="Demo__some-network__share-button"
                  >
                    <EmailIcon size={32} round />
                  </EmailShareButton>

                  <InstagramShareButton url={window.location.href} />
                </div>
              </div>
              {/* whatsapp share */}
              <div>
                <WhatsappShareButton
                  url={shareurl}
                  title={`${data?.title || 'LokSatya News'}`}
                  // url={shareurl}
                  className="Demo__some-network__share-button"
                >
                  <WhatsappIcon size={32} round />
                </WhatsappShareButton>
              </div>
            </div>
          </div>
          <img
            src={data ? data?.image : null}
            alt=""
            loading="lazy"
            className="details-page-main-img"
          />
          <div className="details-main-text-area">
            {/* <div className="details-main-text-area-heading">{data?.title}</div> */}
            <div className="deatils-main-para-area" id="parar"></div>
          </div>
          <Suspense fallback={<div>Loading...</div>}>
          <RelatedNewsSection currentNewId={storyId} topic={data?.topic} />
          </Suspense>
          <div className="detalis-page-commment-area1">
            <div className=" bg-gradient-to-r text-red-500 p-3 from-white text-2xl to-transparents font-bold">
              <span className="text-black">{t("to")} :</span> {data?.topic}
            </div>
            {data?.comment ? (
              <div className="details-comment-area">
                <div
                  className="comment-button"
                  style={{ cursor: "pointer" }}
                  onClick={showModal}
                >
                  <FaRegComment style={{ marginRight: "10px" }} /> Comment
                </div>
              </div>
            ) : (
              <></>
            )}
            {data2.map(({ name, message, _id  }, index) => {
              return (
                <div key={_id || index} style={{ display: "flex", marginTop: "10px" }}>
                  <div>
                    <div
                      style={{
                        fontSize: "25px",
                        fontFamily: "Poppins",
                        backgroundColor: "rgba(0,0,0,0.1)",
                        padding: "10px 20px",
                        display: "flex",
                        height: 30,
                      }}
                    >
                      {data2 && name[0].toUpperCase()}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: "16px",
                      fontFamily: "Poppins",
                      backgroundColor: "rgba(0,0,0,0.1)",
                      padding: "5px 10px",
                      width: "200px",
                      display: "flex",
                      marginLeft: 10,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: "16px",
                          fontFamily: "Poppins",
                          fontWeight: "600",
                        }}
                      >
                        {data2 && name.toUpperCase()}
                      </div>
                      <div
                        style={{
                          fontSize: "16px",
                          fontFamily: "Poppins",
                        }}
                      >
                        {data2 && message}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="w-full mt-4">
            <AdCard type={"bottom"} />
          </div>
        </div>
        <div className="container-detail-page-rigth-side ">
          <Suspense fallback={<div>Loading...</div>}>
            <LatesetNewsSection />
          </Suspense>
          <div className="w-full">
            <Suspense fallback={<div>Loading...</div>}>
              <AdCard type={"mid"} />
            </Suspense>
          </div>
          {topStories && (
            <div className="details-page-related-news">
              <div className="details-page-related-news-heading">{t("ln")}</div>
            </div>
          )}
          <div className="detail-page-relate-new-cards">
            {breakingNews?.slice(0, 6)?.map((data, index) => {
              let title = data.title
                .replace(/[/\%.?]/g, "")
                .split(" ")
                .join("-");
              if (data.slug) {
                title = data.slug;
              }
              if (data._id === storyId) return;
              return (
                <StoriesCard
                  data={data}
                  key={index}
                  OnPress={() =>
                    navigation(`/details/${title}?id=${encodeURIComponent(data?._id)}`)
                  }
                  wid="w-[45%] h-[110px]"
                  image={data?.image}
                  text={data?.title}
                />
              );
            })}
          </div>
        </div>

        <div className="detalis-page-commment-area2 ">
          <div className=" bg-gradient-to-r text-red-500 p-3 from-white text-2xl to-transparents font-bold">
            <span className="text-black">{t("to")} :</span> {data?.topic}
          </div>
          {data?.comment ? (
            <div className="details-comment-area">
              <div
                className="comment-button"
                style={{ cursor: "pointer" }}
                onClick={showModal}
              >
                <FaRegComment style={{ marginRight: "10px" }} /> Comment
              </div>
            </div>
          ) : (
            <></>
          )}
          <div>
            <div>{data2 && data2[0]?.name}</div>
          </div>
        </div>
      </div>
      <Modal
        title="Comment"
        open={isModalOpen}
        onOk={onAdd}
        onCancel={() => (loading2 ? () => {} : handleCancel())}
        okText="Let`s Comment"
        confirmLoading={loading2}
      >
        <Row gutter={12} style={{ marginTop: "10px" }}>
          <Col span={12}>
            <Input
              size="large"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Col>
          <Col span={12}>
            <Input
              size="large"
              placeholder="Email"
              value={Email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Col>
          <Col span={24} style={{ marginTop: "20px" }}>
            <TextArea
              style={{ resize: "none" }}
              rows={5}
              placeholder="Comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </Col>
        </Row>
      </Modal>
    </div>
  );
};

export default DetailsPage;
