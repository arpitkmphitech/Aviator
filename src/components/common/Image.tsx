import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { IImage } from "@/types/types";

const ImageCustom: React.FC<IImage> = ({
  src,
  alt,
  className,
  onClick,
  width = 24,
  height = 24,
  fill = false,
  priority = true,
}) => {
  const imageWidth = fill ? undefined : width || 24;
  const imageHeight = fill ? undefined : height || 24;

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      {...(!fill && { width: imageWidth, height: imageHeight })}
      onClick={onClick}
      className={cn("w-6 h-6", className)}
      priority={priority}
      unoptimized={true}
      sizes={fill ? "100vw" : `${imageWidth}px`}
    />
  );
};

export default ImageCustom;
