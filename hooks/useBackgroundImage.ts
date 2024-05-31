import { useEffect, useState } from "react";
import getRandom from "../utils/getRandom";

const useBackgroundImage = (imagePaths: string[]) => {
  const [currentImagePath, setCurrentImagePath] = useState("");

  useEffect(() => {
    const timerId = setInterval(() => {
      const newImageSrc = imagePaths[getRandom(0, imagePaths.length - 1)];
      setCurrentImagePath(newImageSrc);
    }, 6500);

    return () => clearInterval(timerId);
  }, []);

  return { currentImagePath };
};

export default useBackgroundImage;
