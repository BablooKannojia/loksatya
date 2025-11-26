import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import OptimizedImg from "../OptimizedImage";

const ImageCard = ({
  fromVStrories = false,
  width,
  height,
  img,
  text,
  style,
  border = "0px",
  id,
  slug,
  dis,
}) => {
  const navigate = useNavigate();
  
  // Slider settings for 5-second autoplay
  const sliderSettings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5000, // 5 seconds
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    lazyLoad: 'progressive',
  };

  const imageStyle = {
    width: "100%",
    height: "100%",
    borderRadius: border,
    objectFit: "cover",
  };

  return (
    <div
      className="image-box"
      style={{ 
        width, 
        height, 
        borderRadius: border, 
        cursor: "pointer",
        position: 'relative',
        overflow: 'hidden',
        background: 'transparent'
      }}
      onClick={() => {
        if (dis === false) {
          return;
        } else {
          if (fromVStrories) {
            console.log("Visual story");
          } else {
            navigate(`/details/${slug}?id=${id}`);
          }
        }
      }}
    >
      {/* Image Container */}
      <div style={{ 
        width: "100%", 
        height: "100%",
        position: 'relative'
      }}>
        {/* Conditional rendering based on img type */}
        {Array.isArray(img) && img.length > 1 ? (
          <Slider {...sliderSettings}>
            {img.map((imgSrc, index) => (
              <OptimizedImg
                key={index}
                src={imgSrc}
                alt={text || `Image ${index + 1}`}
                style={imageStyle}
                isSlider={true}
              />
            ))}
          </Slider>
        ) : (
          <OptimizedImg
            src={Array.isArray(img) ? img[0] : img}
            alt={text || "News image"}
            style={imageStyle}
          />
        )}
      </div>

      {/* Transparent Text Overlay */}
      {text && (
        <div 
          className="image-text-box"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            width: '100%',
            color: 'white',
            borderRadius: `0 0 ${border} ${border}`
          }}
        >
          <div style={{
            ...style,
            backgroundColor: '#0808084d',
            color: 'white',
            fontSize: '21px',
            fontWeight: '700',
            lineHeight: '1.4',
            height: '70px',
            overflow: 'hidden',
            padding: '10px',
            width: '100%',
            margin: 0,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}>
            {text}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageCard;