import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { message } from "antd";
import axios from "axios";

import "./style/index.css";
import logo from "../../assets/Logo-new-bg.png";
import { API_URL } from "../../../API";
import { Loading } from "../../Context";
import MobileFooter from "./AccordinList";
import { HiOutlineChevronDoubleRight } from "react-icons/hi";
import SocialMediaContainer from "../common/SocialFooterContainer";
import { useCategories } from "../../Context/CategoriesContext";

const Footer = () => {
  const { t } = useTranslation();
  const { setEffect, effect } = useContext(Loading);
  const [email, setEmail] = useState();
  const navigate = useNavigate();
  
  // Use shared categories data
  const { categories, subcategories, loading: categoriesLoading } = useCategories();

  async function subscribeToNewsLetter() {
    try {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email?.trim())) {
        message.error("Invalid email address");
        return;
      }

      const response = await axios.post(`${API_URL}/newsletter`, { email });
      if (response.status === 201) {
        message.success("Subscribed to News Letter");
        setEmail(""); // Clear input after success
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      message.error(error.response?.data?.message || "Failed to subscribe");
    }
  }

  if (categoriesLoading) {
    return null;
  }

  return (
    <div className="footer-main-container py-0">
      <div className="footer-area-main-accordin">
        <MobileFooter />
      </div>
      <div className="footer-checkup-main-conatiner">
        <div
          className="footer-main mt-0"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            gap: "5px",
            flexWrap: "wrap",
            padding: "20px",
          }}
        >
          {categories.map((category) => (
            <div
              key={category._id}
              className="footer-item-box"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
              }}
            >
              {/* Category Header */}
              <div
                className="footer-heading flex gap-2 items-center"
                style={{
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
                onClick={() => navigate(`/itempage?item=${category.text}`)}
              >
                <span>{category.text}</span>
                <span>
                  <HiOutlineChevronDoubleRight className="text-lg" />
                </span>
              </div>

              {/* Subcategories */}
              <div className="footer-items pl-2 flex gap-2">
                {(subcategories[category.text] || []).map((item, index, array) => (
                  <Link
                    key={item._id}
                    to={`/itempage?item=${category.text}&sub=${item.text}`}
                    className="atag"
                    onClick={() => setEffect(prev => !prev)}
                  >
                    <div
                      className={`subtitle text-sm text-gray-400 my-1 w-fit py-0 pr-3 ${
                        array.length > 1 && index !== array.length - 1
                          ? "border-r border-gray-400"
                          : ""
                      }`}
                    >
                      {item.text}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="footer-line mt-0"></div>
      <div className="footer-middle-container">
        <div className="footer-middle-area">
          <div className="footer-img flex-col">
            <img src={logo} alt="Loksatya News" className="footer-img" />
            <SocialMediaContainer />
          </div>
          <div className="footer-middle-right">
            <div className="footer-middle-right-heading">{t("list")}</div>
            <div className="footer-middle-right-text">
              Stay updated with our weekly newsletter, delivered to your
              inbox. Don't miss out on any updates, stories or events around
              the world.
            </div>
            <div
              style={{
                display: "flex",
              }}
              className="footer-last-bottom"
            >
              <input
                type="email"
                className="footer-input"
                placeholder="name@email.com"
                value={email || ""}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    subscribeToNewsLetter();
                  }
                }}
              />
              <div
                className="footer-input-button"
                onClick={subscribeToNewsLetter}
              >
                Subscribe Now
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-line"></div>
      <div className="footer-bottom">
        <div className="footer-bottom-text">Copyright @2025 Loksatya News</div>
        <div className="footer-bottom-text">
          All Rights Reserved | Designed: <a href="https://helptogethergroup.com" target="_blank" rel="noopener noreferrer">Help Together Group</a>
          <span className="developer d-none">Development by- Babloo Kannojia</span>
        </div>
      </div>
    </div>
  );
};

export default Footer;