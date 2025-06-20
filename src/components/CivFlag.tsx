import React from 'react';

interface CivFlagProps {
  civilization: string;
  className?: string;
}

const CivFlag: React.FC<CivFlagProps> = ({ civilization, className }) => {
  if (!civilization) {
    return <div className={className} style={{ display: 'inline-block', width: '24px', height: '16px' }} />;
  }

  const formattedCiv = civilization.toLowerCase().replace(/ /g, '_');
  const flagUrl = `/flags/${formattedCiv}.png`;

  return <img src={flagUrl} alt={civilization} className={className} />;
};

export default CivFlag;

