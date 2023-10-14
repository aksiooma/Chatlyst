import { useEffect, useState } from "react";

interface UseResponsiveImagesProps {
    avatarSmall: string;
    avatarMedium: string;
    avatarLarge: string;
}

const useResponsiveAvatar = ({ avatarSmall, avatarMedium, avatarLarge }: UseResponsiveImagesProps) => {
  const [currentAvatar, setCurrentAvatar] = useState<string>(avatarLarge);
  
  useEffect(() => {
    const updateImage = () => {
      if (window.innerWidth <= 599) {
        setCurrentAvatar(avatarSmall);
      } else if (window.innerWidth >= 600 && window.innerWidth <= 1199) {
        setCurrentAvatar(avatarMedium);
      } else {
        setCurrentAvatar(avatarLarge);
      }
    };

    // Initial call
    updateImage();

    // Add event listener
    window.addEventListener('resize', updateImage);

    // Cleanup
    return () => window.removeEventListener('resize', updateImage);
  }, [avatarSmall, avatarMedium, avatarLarge]);

  return currentAvatar;
}

export default useResponsiveAvatar;
