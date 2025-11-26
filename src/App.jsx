import { useEffect, lazy, Suspense } from "react"; // Add lazy and Suspense
import { Route, Routes, useLocation } from "react-router-dom";
import Header from "./Components/Global/Header";
import Footer from "./Components/Global/Footer";
import { Login } from "./Module/Registartion/Login";
import Signup from "./Module/Registartion/Signup";
import OtpVerify from "./Module/Registartion/OtpVerify";
import axios from "axios";
import { useState } from "react";
import ForgotPassword from "./Module/Registartion/ForgotPassword";
import NewPassword from "./Module/Registartion/NewPassword";
import { LanguageSelect, Loading, OnEdit } from "./Context";
import ReactGa from "react-ga";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { API_URL } from "../API";
import MenuBelowSlider from "./Components/Global/MenuBelowSlider";

// Lazy load heavy components
const MainPage = lazy(() => import("./Module/MainPage"));
const DetailsPage = lazy(() => import("./Module/DetailsPage"));
const VideoPage = lazy(() => import("./Module/VideoPage"));
const AdminLayout = lazy(() => import("./Module/Admin/LayOut"));
const ItemPage = lazy(() => import("./Module/ItemPage"));
const DetailsPage2 = lazy(() => import("./Module/DetailsPage/Details2"));
const VideoPage2 = lazy(() => import("./Module/VideoPage/Video2"));
const LivePage = lazy(() => import("./Module/VideoPage/Live"));
const VideoPage3 = lazy(() => import("./Module/VideoPage/Video3"));
const WebStory = lazy(() => import("./Components/MainPage/WebStory"));
const ImageCrousel = lazy(() => import("./Components/MainPage/ImageCrousel"));
const ItemPageCatSub = lazy(() => import("./Module/ItemPage/itemPageCatSubCat"));
const Gallerypage = lazy(() => import("./Module/MainPage/Gallerypage"));
const VisualStoryPage = lazy(() => import("./Module/MainPage/visualstorypage"));
const ProtectedRoute = lazy(() => import("./Protected Routes"));

// Loading component
const PageLoader = () => (
  <div
    style={{
      width: "100vw",
      height: "100vh",
      justifyContent: "center",
      alignItems: "center",
      display: "flex",
    }}
  >
    <Spin
      indicator={
        <LoadingOutlined
          style={{
            fontSize: 40,
            color: "rgba(255, 14, 14, 1)",
          }}
          spin
        />
      }
    />
  </div>
);

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [lang, setLang] = useState("ur");
  const [loading, setLoading] = useState(false);
  const [effect, setEffect] = useState(false);
  const [onEdit, setOnEdit] = useState(false);
  const [id, setId] = useState("");
  const location = useLocation();

  useEffect(() => {
    const userId = localStorage.getItem("id");

    if (userId) {
      // Use request cancellation to prevent memory leaks
      const source = axios.CancelToken.source();
      
      axios
        .get(`${API_URL}/user?id=${userId}`, {
          cancelToken: source.token
        })
        .then((user) => {
          if (user.data[0].role !== "user") {
            setIsAdmin(true);
          }
        })
        .catch((err) => {
          if (!axios.isCancel(err)) {
            console.error("Error fetching user data: ", err);
          }
        });

      return () => {
        source.cancel("Component unmounted");
      };
    }
  }, [location]);

  // Move Google Analytics to useEffect to avoid blocking
  useEffect(() => {
    ReactGa.initialize("G-1CES7BYV2Q");
  }, []);

  const isAdminRoute = location.pathname.split("/")[1] === "dashboard" || 
                      location.pathname.split("/")[1] === "stories";

  return (
    <Loading.Provider value={{ loading, setLoading, effect, setEffect }}>
      <LanguageSelect.Provider value={{ lang, setLang }}>
        <OnEdit.Provider value={{ onEdit, setOnEdit, id, setId }}>
          <>
            {!isAdminRoute && (
              <>
                <Header />
                <MenuBelowSlider />
              </>
            )}

            <Routes>
              <Route
                index
                element={
                  <Suspense fallback={<PageLoader />}>
                    {loading ? <PageLoader /> : <MainPage />}
                  </Suspense>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route 
                path="/stories" 
                element={
                  <Suspense fallback={<PageLoader />}>
                    <WebStory />
                  </Suspense>
                } 
              />
              <Route 
                path="/photos/:id" 
                element={
                  <Suspense fallback={<PageLoader />}>
                    <ImageCrousel />
                  </Suspense>
                } 
              />
              <Route path="/signup" element={<Signup />} />
              <Route path="/verfication/:id" element={<OtpVerify />} />
              <Route
                path="/details/:title"
                element={
                  <Suspense fallback={<PageLoader />}>
                    {loading ? <PageLoader /> : <DetailsPage />}
                  </Suspense>
                }
              />
              <Route 
                path="/details2/*" 
                element={
                  <Suspense fallback={<PageLoader />}>
                    <DetailsPage2 />
                  </Suspense>
                } 
              />
              <Route 
                path="/itempage" 
                element={
                  <Suspense fallback={<PageLoader />}>
                    <ItemPage />
                  </Suspense>
                } 
              />
              <Route 
                path="/itempage2" 
                element={
                  <Suspense fallback={<PageLoader />}>
                    <ItemPageCatSub />
                  </Suspense>
                } 
              />
              <Route 
                path="/videos2/:id" 
                element={
                  <Suspense fallback={<PageLoader />}>
                    <VideoPage />
                  </Suspense>
                } 
              />
              <Route 
                path="/videos/:id" 
                element={
                  <Suspense fallback={<PageLoader />}>
                    <VideoPage2 />
                  </Suspense>
                } 
              />
              <Route 
                path="/videos3" 
                element={
                  <Suspense fallback={<PageLoader />}>
                    <VideoPage3 />
                  </Suspense>
                } 
              />
              <Route 
                path="/photos" 
                element={
                  <Suspense fallback={<PageLoader />}>
                    <Gallerypage />
                  </Suspense>
                } 
              />
              <Route 
                path="/story" 
                element={
                  <Suspense fallback={<PageLoader />}>
                    <VisualStoryPage />
                  </Suspense>
                } 
              />
              <Route path="/live" element={<LivePage />} />
              <Route path="/forgot" element={<ForgotPassword />} />
              <Route path="/newPassword" element={<NewPassword />} />
              <Route
                path="/dashboard/*"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <ProtectedRoute isAdmin={isAdmin}>
                      <AdminLayout />
                    </ProtectedRoute>
                  </Suspense>
                }
              />
              <Route path="*" element={<>Not found</>} />
            </Routes>
            
            {!isAdminRoute && <Footer />}
          </>
        </OnEdit.Provider>
      </LanguageSelect.Provider>
    </Loading.Provider>
  );
};

export default App;