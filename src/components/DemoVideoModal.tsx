export default function DemoVideoModal() {
  // Replace this with your actual YouTube video link
  const youtubeUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

  return (
    <div className="flex justify-center mt-8 mb-4">
      <a
        href={youtubeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 rounded-full bg-accent px-8 py-4 text-sm font-bold text-white shadow-[0_0_20px_rgba(230,30,37,0.4)] transition-transform hover:scale-105 hover:bg-accent-hover"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
        Click here to see the demo
      </a>
    </div>
  );
}
