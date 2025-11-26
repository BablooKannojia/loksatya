import { useState, useRef, useEffect } from "react";
import { Skeleton } from "antd";

// Optimized Image Component with WebP support
const OptimizedImg = ({ src, alt, style, isSlider = false, quality = 80, width, height }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (!imgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '100px' }
    );

    observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, []);

  // Advanced WebP conversion with multiple CDN support
  const getOptimizedSrc = (imageSrc) => {
    if (!imageSrc) return imageSrc;

    // Skip if already WebP or SVG
    if (imageSrc.match(/\.(webp|svg)$/i)) {
      return imageSrc;
    }

    // Skip if it's a data URL or blob
    if (imageSrc.startsWith('data:') || imageSrc.startsWith('blob:')) {
      return imageSrc;
    }

    // Cloudinary CDN WebP conversion
    if (imageSrc.includes('cloudinary.com')) {
      return imageSrc.replace(/\.(jpg|jpeg|png|gif|bmp|tiff)(\?.*)?$/i, '.webp$2');
    }

    // ImageKit CDN WebP conversion
    if (imageSrc.includes('ik.imagekit.io')) {
      const separator = imageSrc.includes('?') ? '&' : '?';
      return `${imageSrc}${separator}f=webp&q=${quality}`;
    }

    // Imgix CDN WebP conversion
    if (imageSrc.includes('imgix.net')) {
      const separator = imageSrc.includes('?') ? '&' : '?';
      return `${imageSrc}${separator}fm=webp&q=${quality}`;
    }

    // AWS CloudFront/S3 with Lambda@Edge
    if (imageSrc.includes('amazonaws.com') || imageSrc.includes('cloudfront.net')) {
      const separator = imageSrc.includes('?') ? '&' : '?';
      return `${imageSrc}${separator}format=webp&quality=${quality}`;
    }

    // Generic CDN - add your own domain patterns here
    if (imageSrc.includes('your-cdn-domain.com')) {
      const separator = imageSrc.includes('?') ? '&' : '?';
      return `${imageSrc}${separator}format=webp&quality=${quality}`;
    }

    // For local images or unknown CDNs - use browser's native WebP support
    // Note: This requires your server to support WebP
    return imageSrc;
  };

  // Get optimized dimensions for responsive images
  const getResponsiveSizes = () => {
    if (width && height) {
      return {
        width: `${width}px`,
        height: `${height}px`,
        maxWidth: '100%',
        objectFit: 'cover'
      };
    }
    return {};
  };

  if (isError) {
    return (
      <div style={{
        ...style, 
        backgroundColor: '#f0f0f0', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        ...getResponsiveSizes()
      }}>
        <span style={{ color: '#999', fontSize: '14px' }}>Image not available</span>
      </div>
    );
  }

  return (
    <div ref={imgRef} style={{ 
      position: 'relative', 
      width: '100%', 
      height: '100%',
      overflow: 'hidden',
      ...getResponsiveSizes()
    }}>
      {!isLoaded && (
        <Skeleton.Node 
          active 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: style?.borderRadius || '0px',
            zIndex: 1
          }}
        />
      )}
      <img
        src={getOptimizedSrc(src)}
        alt={alt || "News image"}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => setIsError(true)}
        style={{
          ...style,
          position: 'absolute',
          top: 0,
          left: 0,
          display: isLoaded ? 'block' : 'none',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          ...getResponsiveSizes()
        }}
      />
    </div>
  );
};

export default OptimizedImg;