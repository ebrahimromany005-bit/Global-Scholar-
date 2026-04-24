import { useEffect, useRef } from 'react';
import { usePremium } from '@/hooks/usePremium';
import { useTrackAdEvent } from '@workspace/api-client-react';

interface AdSlotProps {
  slot: string;
  size?: 'banner' | 'inline' | 'inpage' | 'footer';
  className?: string;
}

export function AdSlot({ slot, size = 'banner', className = '' }: AdSlotProps) {
  const { isPremium } = usePremium();
  const trackAd = useTrackAdEvent();
  const trackedImpression = useRef(false);

  useEffect(() => {
    if (!isPremium && !trackedImpression.current) {
      trackAd.mutate({ data: { slot, event: 'impression' } });
      trackedImpression.current = true;
    }
  }, [isPremium, slot, trackAd]);

  if (isPremium) {
    return null;
  }

  const handleAdClick = () => {
    trackAd.mutate({ data: { slot, event: 'click' } });
  };

  const sizeClasses = {
    banner: 'h-24 md:h-32 w-full max-w-4xl',
    inline: 'h-32 md:h-48 w-full',
    inpage: 'h-64 w-full max-w-sm',
    footer: 'h-20 w-full max-w-3xl',
  };

  return (
    <div 
      className={`flex items-center justify-center border-2 border-dashed border-border/60 bg-muted/30 rounded-xl my-6 mx-auto cursor-pointer hover:bg-muted/50 transition-colors ${sizeClasses[size]} ${className}`}
      onClick={handleAdClick}
      title="إعلان"
    >
      <div className="text-center p-4">
        <p className="text-sm font-medium text-muted-foreground">مساحة إعلانية</p>
        <p className="text-xs text-muted-foreground/70 mt-1">Ad Space — جاهز لربط Google AdSense</p>
      </div>
      {/* To integrate Google AdSense, replace the placeholder div with <ins class='adsbygoogle' .../> and load the AdSense script in index.html. */}
    </div>
  );
}
