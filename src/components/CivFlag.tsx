import React from 'react';
import { CIVILIZATION_FLAG_MAP } from '../utils/constants';

interface CivFlagProps {
  civilization: string;
  className?: string;
}

const CivFlag: React.FC<CivFlagProps> = ({ civilization, className }) => {
  if (!civilization) {
    return <div className={className} style={{ display: 'inline-block', width: '24px', height: '16px' }} />;
  }

  const flagCode = CIVILIZATION_FLAG_MAP[civilization];
  if (!flagCode) {
    console.warn(`No flag found for civilization: ${civilization}`);
    return <div className={className} style={{ display: 'inline-block', width: '24px', height: '16px' }} />;
  }

  const flagUrl = `/flags/${flagCode}.png`;

  return <img src={flagUrl} alt={civilization} className={className} />;
};

export default CivFlag;

