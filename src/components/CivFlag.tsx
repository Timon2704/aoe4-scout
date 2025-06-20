import React, { useEffect, useState } from 'react';

// Use import.meta.glob for robust dynamic imports in Vite.
// This creates a map of all possible flag images at build time.
const flagImages = import.meta.glob('/src/assets/flags/*.png');

interface CivFlagProps {
  civilization: string;
  className?: string;
}

const CivFlag: React.FC<CivFlagProps> = ({ civilization, className }) => {
  const [flagUrl, setFlagUrl] = useState<string>('');

  useEffect(() => {
    if (!civilization) return;

    const formattedCiv = civilization.toLowerCase().replace(/ /g, '_');
    const imagePath = `/src/assets/flags/${formattedCiv}.png`;

    if (flagImages[imagePath]) {
      flagImages[imagePath]()
        .then((module: any) => setFlagUrl(module.default))
        .catch((err: any) => console.error(`Failed to load flag for ${civilization}:`, err));
    } else {
      console.error(`Flag not found for ${civilization} at path ${imagePath}`);
      setFlagUrl('');
    }
  }, [civilization]);

  if (!flagUrl) {
    // Return a placeholder to maintain layout
    return <div className={className} style={{ display: 'inline-block', width: '24px', height: '16px' }} />;
  }

  return <img src={flagUrl} alt={civilization} className={className} />;
};

export default CivFlag;
