import { useEffect, useState } from "react";
import getRandom from "../utils/getRandom";

const DEFAULT_TIMEOUT = 6500;

const useBackgroundImage = (imagePaths: string[]) => {
  const [currentImagePath, setCurrentImagePath] = useState("");

  useEffect(() => {
    const timerId = setInterval(() => {
      const newImageSrc = imagePaths[getRandom(0, imagePaths.length - 1)];
      setCurrentImagePath(newImageSrc);
    }, DEFAULT_TIMEOUT);

    return () => clearInterval(timerId);
  }, []);

  return { currentImagePath };
};

export default useBackgroundImage;
