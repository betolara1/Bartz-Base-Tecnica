import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Maximize2, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { cn } from "./ui/utils";

interface VideoEmbedProps {
  src: string;
  title: string;
  duration?: string;
  thumbnail?: string;
  className?: string;
}

export function VideoEmbed({
  src,
  title,
  duration,
  thumbnail,
  className
}: VideoEmbedProps) {
  const isGif = src.toLowerCase().includes('.gif') || duration === 'GIF';

  // Hooks must always be called unconditionally (React rules of hooks)
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // GIF: just display the image — it loops automatically, no controls needed
  if (isGif) {
    return (
      <div className={cn("relative bg-black rounded-lg overflow-hidden w-full flex items-center justify-center", className)}
        style={{ maxHeight: '80vh' }}>
        <img
          src={src}
          alt={title}
          className="w-full h-auto object-contain"
          style={{ maxHeight: '80vh', display: 'block' }}
        />
      </div>
    );
  }

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
  };

  const handleMouseEnter = () => setShowControls(true);
  const handleMouseLeave = () => setShowControls(true); // Always show for better UX

  return (
    <div
      className={cn(
        "relative bg-slate-900 rounded-lg overflow-hidden group",
        "w-full h-0 pb-[56.25%]", // Fixed 16:9 aspect ratio using padding-bottom
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Container for absolute positioned content */}
      <div className="absolute inset-0">
        {/* Video Element */}
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          poster={thumbnail}
          onEnded={handleVideoEnd}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          preload="metadata"
        >
          <source src={src} type="video/mp4" />
          <p className="text-white p-4">
            Seu navegador não suporta reprodução de vídeo.
            <a href={src} className="text-blue-400 hover:underline ml-1">
              Baixe o vídeo aqui
            </a>
          </p>
        </video>

        {/* Thumbnail overlay when not playing */}
        {!isPlaying && thumbnail && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${thumbnail})` }}
          />
        )}

        {/* Video Info Overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center transition-opacity duration-300">
            <Button
              onClick={togglePlay}
              size="lg"
              className="bg-white/20 hover:bg-white/30 text-white border-white/20 backdrop-blur-sm h-12 w-12 rounded-full p-0 mb-3"
              variant="outline"
            >
              <Play className="w-5 h-5 ml-0.5" />
            </Button>
            <div className="text-center text-white px-3">
              <h4 className="font-medium mb-1 line-clamp-2 text-sm">{title}</h4>
              {duration && (
                <p className="text-xs text-white/80">⏱️ {duration}</p>
              )}
            </div>
          </div>
        )}

        {/* Video Controls */}
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 transition-opacity duration-300",
            showControls ? "opacity-100" : "opacity-0"
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Button
                onClick={togglePlay}
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20 h-6 w-6 p-0"
              >
                {isPlaying ? (
                  <Pause className="w-3 h-3" />
                ) : (
                  <Play className="w-3 h-3 ml-0.5" />
                )}
              </Button>

              <Button
                onClick={toggleMute}
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20 h-6 w-6 p-0"
              >
                {isMuted ? (
                  <VolumeX className="w-3 h-3" />
                ) : (
                  <Volume2 className="w-3 h-3" />
                )}
              </Button>

              {duration && (
                <span className="text-xs text-white/80 ml-1">{duration}</span>
              )}
            </div>

            <Button
              onClick={toggleFullscreen}
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20 h-6 w-6 p-0"
              title="Tela cheia"
            >
              <Maximize2 className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {!videoRef.current?.readyState && (
          <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          </div>
        )}
      </div>
    </div>
  );
}
