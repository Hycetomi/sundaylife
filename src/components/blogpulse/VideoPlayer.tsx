interface Props {
  url: string;
  type: 'youtube' | 'upload';
}

const extractYouTubeId = (url: string): string | null => {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
};

const VideoPlayer = ({ url, type }: Props) => {
  if (type === 'youtube') {
    const id = extractYouTubeId(url);
    if (!id) return null;
    return (
      <div className="relative w-full rounded-2xl overflow-hidden bg-black aspect-video">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}`}
          title="Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl overflow-hidden bg-black">
      <video
        src={url}
        controls
        className="w-full max-h-[540px] object-contain"
      />
    </div>
  );
};

export default VideoPlayer;
