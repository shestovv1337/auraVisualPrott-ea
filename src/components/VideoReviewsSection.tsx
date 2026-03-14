import { motion } from "framer-motion";
import { Play, Volume2, VolumeX } from "lucide-react";
import { useRef, useState } from "react";

const videoReviews = [
  {
    title: "Обзор AuraVisual",
    author: "Видеообзор #1",
    videoSrc: "/videos/video-2.mp4",
  },
  {
    title: "PvP с Infinity",
    author: "Видеообзор #2",
    videoSrc: "/videos/video-3.mp4",
  },
  {
    title: "Настройка модулей",
    author: "Видеообзор #3",
    videoSrc: "/videos/video-4.mp4",
  },
];

const VideoCard = ({ review }: { review: typeof videoReviews[0] }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  const handleClick = () => {
    const video = videoRef.current;
    if (!video) return;

    if (playing) {
      video.pause();
      setPlaying(false);
    } else {
      video.muted = true;
      video.play().then(() => {
        setPlaying(true);
      }).catch(() => {});
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  return (
    <div className="group rounded-2xl overflow-hidden glass hover:border-primary/30 transition-all duration-300 hover:translate-y-[-2px]">
      {/* Video */}
      <div className="relative aspect-video overflow-hidden cursor-pointer" onClick={handleClick}>
        <video
          ref={videoRef}
          src={review.videoSrc}
          className="w-full h-full object-cover"
          muted
          loop
          playsInline
          preload="metadata"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60 pointer-events-none" />
        
        {/* Play overlay */}
        {!playing && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <div className="w-14 h-14 rounded-full bg-primary/20 backdrop-blur-md flex items-center justify-center border border-primary/30 shadow-lg shadow-primary/20 hover:scale-110 transition-transform">
              <Play size={24} className="text-primary ml-0.5" />
            </div>
          </div>
        )}

        {/* Mute toggle when playing */}
        {playing && (
          <button
            onClick={toggleMute}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 flex items-center justify-center text-foreground/70 hover:text-primary transition-colors z-10"
          >
            {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
        )}
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="font-bold text-sm mb-1 group-hover:text-primary transition-colors">{review.title}</h3>
        <p className="text-xs text-muted-foreground font-mono">{review.author}</p>
      </div>
    </div>
  );
};

const VideoReviewsSection = () => {
  return (
    <section id="reviews" className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 section-glow" />
      <div className="absolute inset-0 noise-bg" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-primary font-mono text-sm tracking-widest uppercase mb-3 block">gameplay</span>
          <h2 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
            <span className="gradient-text">Видеообзоры</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            Посмотри как Infinity выглядит в действии
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {videoReviews.map((review, i) => (
            <motion.div
              key={review.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
            >
              <VideoCard review={review} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoReviewsSection;
