"use client";
const LoadingOverlay = () => {
  const text = "FORMUS";

  return (
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-black/40 backdrop-blur-md rounded-2xl px-8 py-6 border border-blue-500/20 shadow-2xl">
        <div className="flex space-x-3">
          {text.split("").map((letter, index) => (
            <span
              key={index}
              className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 animate-fade-in-delayed opacity-0"
              style={{
                animationDelay: `${index * 200}ms`,
                animationFillMode: "forwards",
              }}
            >
              {letter}
            </span>
          ))}
        </div>
        <div className="mt-4 flex justify-center">
          <div className="animate-loading-bar h-0.5 w-32 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
        </div>
      </div>
      <style jsx>{`
        @keyframes fadeInDelayed {
          0% {
            opacity: 0;
            transform: translateY(15px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes loadingBar {
          0% {
            opacity: 0.3;
            transform: scaleX(0.5);
          }
          50% {
            opacity: 1;
            transform: scaleX(1);
          }
          100% {
            opacity: 0.3;
            transform: scaleX(0.5);
          }
        }

        .animate-fade-in-delayed {
          animation: fadeInDelayed 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .animate-loading-bar {
          animation: loadingBar 2s ease-in-out infinite;
          transform-origin: center;
        }

        .opacity-0 {
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default LoadingOverlay;
