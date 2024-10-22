import {FC} from "react";
import Image from "next/image";
import BackDrop from "@/app/components/BackDrop";
import {useModalStore} from "@/app/store/useStore";

interface ImageViewerProps {
  url: string
}

const ImageViewer: FC<ImageViewerProps> = ({ url }) => {
  const { isOpen, setOpen } = useModalStore();

  console.log(isOpen)
  return (
      <BackDrop>
          <img
              src={url}
              alt="Image"
              className="cursor-pointer"
              onClick={() => setOpen(!isOpen)}
              onDoubleClick={() => window.open(url, '_blank')}
          />
      </BackDrop>
  );
};

export default ImageViewer;
