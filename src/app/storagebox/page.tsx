'use client'

import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import './StorageBox.scss'
import ImageViewer from "@/app/components/ImageViewer";
import { useModalStore } from "@/app/store/useStore";

export default function Page() {
  const [imageList, setImageList] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const { isOpen, setOpen } = useModalStore();
  const observer = useRef<IntersectionObserver | null>(null);
  const size = 10;

  const handleImageClick = (imageUrl: string) => {
    setSelectedImageUrl(imageUrl);
    setOpen(true);
  };

  // Last element ref callback for intersection observer
  const lastImageRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return;

    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });

    if (node) {
      observer.current.observe(node);
    }
  }, [isLoading, hasMore]);

  interface ApiResponse {
    code: number;
    data: {
      images: string[];
    };
  }

  const getImages = async (pageNum: number): Promise<void> => {
    try {
      setIsLoading(true);
      const res = await axios.get<ApiResponse>(
          `${process.env.NEXT_PUBLIC_API_URL}/chat/my-image?page=${pageNum}&size=${size}`,
          {
            headers: { 'x-auth-token': Cookies.get('token') }
          }
      );

      if (res.data.code === 200) {
        const newImages = res.data.data.images;
        setImageList(prev => [...prev, ...newImages]);
        setHasMore(newImages.length === size);
      }
    } catch (error) {
      console.error('Failed to fetch images:', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getImages(page);
    // Cleanup function to disconnect observer when component unmounts
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [page]);

  // Reset selected image when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedImageUrl(null);
    }
  }, [isOpen]);

  return (
      <div className="container">
        <div className="grid">
          {imageList.map((imageUrl, index) => (
              <div
                  key={index}
                  onClick={() => handleImageClick(imageUrl)}
                  ref={index === imageList.length - 1 ? lastImageRef : null}
                  className="imageWrapper"
              >
                <img
                    src={imageUrl}
                    alt={`Image ${index + 1}`}
                    loading="lazy"
                />
              </div>
          ))}
        </div>
        {selectedImageUrl && isOpen && (
            <ImageViewer url={selectedImageUrl} />
        )}
        {/*{isLoading && (*/}
        {/*    <div className="loading">*/}
        {/*      */}
        {/*    </div>*/}
        {/*)}*/}
      </div>
  );
}
