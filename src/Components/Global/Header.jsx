import { useEffect, useState } from "react";
import "./style/index.css";
import logo from "../../assets/Logo-new.PNG";
import { MdArrowDropDown } from "react-icons/md";
import { BiSolidSearch } from "react-icons/bi";
import { GiHamburgerMenu } from "react-icons/gi";
import { RxCross1 } from "react-icons/rx";
import { useContext } from "react";
import { LanguageSelect, Loading } from "../../Context";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { API_URL } from "../../../API";
import { useNavigate } from "react-router-dom";
import { AutoComplete, Dropdown, Input } from "antd";
import { IoIosCloseCircle } from "react-icons/io";
import MobileHeader from "./MobileHeader";
import { HomeOutlined } from "@ant-design/icons";
import { useCategories } from "../../Context/CategoriesContext";

const Header = () => {
  const [isHamBurger, setIsHamBurger] = useState(false);
  const { lang, setLang } = useContext(LanguageSelect);
  const { setEffect, effect } = useContext(Loading);
  const { t, i18n } = useTranslation();
  const [topAd, setTopAd] = useState({});
  const [search, setSearch] = useState(false);
  const Navigation = useNavigate();
  
  // Use shared categories data
  const { categories, subcategories, loading: categoriesLoading } = useCategories();

  // Split into main items and overflow items
  const mainItems = categories.slice(0, 11);
  const extraItems = categories.slice(11);
  const itsItem2 = categories.map((item) => ({ value: item.text }));

  // Build "Display More" dropdown items
  const AllcatgeoryData = extraItems.map((item) => {
    const subItems = subcategories[item.text] || [];

    return {
      key: item._id,
      label: subItems.length > 0 ? (
        <Dropdown
          menu={{ 
            items: subItems.map((element) => ({
              key: element._id,
              label: (
                <a
                  onClick={() => {
                    Navigation(`/itempage?item=${element.category}&sub=${element.text}`);
                    setEffect((prev) => !prev);
                  }}
                >
                  {element.text}
                </a>
              ),
            }))
          }}
          placement="bottomLeft"
          arrow
        >
          <a
            onClick={() => {
              Navigation(`/itempage?item=${item.text}`);
              setEffect((prev) => !prev);
            }}
            className="flex items-center"
          >
            {item.text}
            <MdArrowDropDown size={20} className="ml-1" />
          </a>
        </Dropdown>
      ) : (
        <a
          onClick={() => {
            Navigation(`/itempage?item=${item.text}`);
            setEffect((prev) => !prev);
          }}
        >
          {item.text}
        </a>
      ),
    };
  });

  useEffect(() => {
    // Fetch top ad separately
    axios.get(`${API_URL}/ads?active=true&side=top`).then((data) => {
      const activeAds = data.data.filter((data) => data.active);
      const topAdData = activeAds.filter((data) => data.device === "laptop");
      setTopAd(topAdData.reverse()[0]);
    });
  }, []);

  useEffect(() => {
    if (topAd && topAd._id) {
      axios.get(`${API_URL}/ads/click?id=${topAd._id}`).then(() => {});
    }
  }, [topAd]);

  const onClickAd = async (id) => {
    try {
      const response = await axios.post(`${API_URL}/ads/click`, { id });
    } catch (error) {
      console.error("Error updating ads:", error);
    }
  };

  if (categoriesLoading) {
    return null;
  }

  return (
    <>
      <MobileHeader listitem={AllcatgeoryData} />

      <div className="header-main-area">
        {topAd && (
          <div className="">
            <a
              href={topAd?.link}
              target="_blank"
              onClick={() => {
                onClickAd(topAd._id);
              }}
              rel="noreferrer"
            >
              <img
                style={{
                  cursor: "pointer",
                  padding: "2px",
                }}
                className="top-header-img"
                src={topAd?.imgLink}
                alt=""
              />
            </a>
          </div>
        )}

        <div className="header-contianer">
          <div
            onClick={() => Navigation("/")}
            style={{
              cursor: "pointer",
            }}
            className="header-logo-box"
          >
            <img src={logo} alt="" />
          </div>
          <div className="header-row-box">
            <ul
              style={{ flexWrap: "wrap" }}
              className="header-row-box-items "
            >
              <li
                className="mr-2 flex gap-1 items-center"
                onClick={() => {
                  Navigation(`/`);
                  setEffect(!effect);
                }}
              >
                <span>
                  <HomeOutlined />
                </span>
                <span>होम</span>
              </li>
              {
                <>
                  {mainItems.length > 0 &&
                    mainItems.map((data) => (
                      <Dropdown
                        key={data._id}
                        menu={{
                          items: (subcategories[data.text] || []).map((element) => ({
                            key: element._id,
                            label: (
                              <a
                                onClick={() => {
                                  Navigation(`/itempage?item=${element.category}&sub=${element.text}`);
                                  setEffect((prev) => !prev);
                                }}
                              >
                                {element.text}
                              </a>
                            ),
                          }))
                        }}
                        placement="bottom"
                        arrow
                      >
                        <li
                          onClick={() => {
                            Navigation(`/itempage?item=${data.text}`);
                            setEffect(!effect);
                          }}
                        >
                          {data.text} <MdArrowDropDown size={20} />
                        </li>
                      </Dropdown>
                    ))}
                </>
              }
              <li onClick={() => Navigation("/live")}>{t("h14")}</li>

              {AllcatgeoryData.length > 0 && (
                <Dropdown
                  menu={{
                    items: AllcatgeoryData,
                  }}
                  placement="bottom"
                  arrow
                >
                  <li className="">
                    Display More <MdArrowDropDown size={20} />
                  </li>
                </Dropdown>
              )}
              <li>
                <BiSolidSearch
                  onClick={() => {
                    setSearch(true);
                  }}
                  size={30}
                  color="white"
                  style={{
                    marginLeft: "10px",
                  }}
                />
              </li>
            </ul>
            <GiHamburgerMenu
              className="ham-burger"
              size={30}
              color="white"
              onClick={() => setIsHamBurger(true)}
            />
          </div>
        </div>
        <div
          className={`ham-burger-area `}
          style={{ display: isHamBurger ? "block" : "none" }}
        >
          <div className="header-row2-icons">
            <BiSolidSearch size={30} color="white" />
            <RxCross1
              size={30}
              color="white"
              onClick={() => setIsHamBurger(false)}
              className="ham-burger-area-cross-child"
            />
          </div>
          <ul className="header-row-box-items2">
            {mainItems.length > 0 &&
              mainItems.map((data) => {
                return (
                  <li
                    key={data._id}
                    onClick={() => {
                      setIsHamBurger(false);
                      Navigation(`/itempage?item=${data.text}`);
                      setEffect(!effect);
                    }}
                  >
                    {data.text} <MdArrowDropDown size={20} />
                  </li>
                );
              })}
            <li>
              {t("key")} <MdArrowDropDown size={30} />
            </li>
          </ul>
        </div>
      </div>
      {search ? (
        <div
          onClick={() => {
            // setSearch(false);
          }}
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.2)",
            position: "absolute",
            zIndex: 9999,
            top: 0,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "100%",
              padding: "10px",
              display: "flex",
            }}
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <AutoComplete
                style={{
                  width: "70%",
                  marginTop: 88,
                }}
                options={itsItem2}
                filterOption={(inputValue, option) =>
                  option.value
                    ?.toUpperCase()
                    .indexOf(inputValue.toUpperCase()) !== -1
                }
              >
                <Input.Search
                  autoFocus
                  size="large"
                  placeholder="Search"
                  enterButton
                  onSearch={(e) => {
                    Navigation(`itempage?item=${e}`);
                    setSearch(false);
                  }}
                />
              </AutoComplete>
              <div style={{}}>
                <IoIosCloseCircle
                  onClick={() => setSearch(false)}
                  size={55}
                  style={{
                    padding: "10px",
                    marginLeft: 20,
                    marginTop: 79,
                    cursor: "pointer",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Header;