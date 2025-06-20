import React, { useEffect, useState } from 'react';

interface RankBadgeProps {
  rankLevel?: string;
  mode: 'solo' | 'team';
}

const RankBadge: React.FC<RankBadgeProps> = ({ rankLevel, mode }) => {
  const [BadgeComponent, setBadgeComponent] = useState<React.FC<React.SVGProps<SVGSVGElement>> | null>(null);

  useEffect(() => {
    if (!rankLevel) {
      import(`../assets/badges/${mode}_unranked.svg?react`)
        .then(module => setBadgeComponent(() => module.default))
        .catch(() => setBadgeComponent(null));
      return;
    }

    const formattedRank = rankLevel.toLowerCase().replace(/ /g, '_');
    import(`../assets/badges/${mode}_${formattedRank}.svg?react`)
      .then(module => setBadgeComponent(() => module.default))
      .catch(() => setBadgeComponent(null));
  }, [rankLevel, mode]);

  if (!BadgeComponent) {
    return null;
  }

  return <BadgeComponent className="h-[60px] w-auto" />;
};

export default RankBadge;
