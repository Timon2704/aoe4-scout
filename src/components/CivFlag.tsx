import React, { useEffect, useState } from 'react';

interface CivFlagProps {
  civilization: string;
  className?: string;
}

const CivFlag: React.FC<CivFlagProps> = ({ civilization, className }) => {
  const [flagUrl, setFlagUrl] = useState<string>('');

  useEffect(() => {
    if (!civilization) return;

    const formattedCiv = civilization.toLowerCase().replace(/ /g, '_');
    import(`../assets/flags/${formattedCiv}.png`)
      .then(module => setFlagUrl(module.default))
      .catch(err => console.error(`Failed to load flag for ${civilization}:`, err));
  }, [civilization]);

  if (!flagUrl) {
    return <div className={className} style={{ width: '24px', height: '16px', backgroundColor: '#333' }} />; // Placeholder
  }

  return <img src={flagUrl} alt={civilization} className={className} />;
};

export default CivFlag;
