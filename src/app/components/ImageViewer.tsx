import BackDrop from "@/app/components/BackDrop";
import {FC} from "react";
import Image from "next/image";

interface ImageViewerProps {
  url: string
}

const ImageViewer: FC<ImageViewerProps> = ({url}) => {
  return (
      <BackDrop>
          <Image src={url} alt={"Image"} onDoubleClick={() => location.href = url} />
      </BackDrop>
  )
}

export default ImageViewer;
