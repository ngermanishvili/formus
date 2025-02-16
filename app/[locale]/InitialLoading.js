import Image from 'next/image';
import { useEffect, useState } from 'react';

export const InitialLoading = () => {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsExiting(true);
        }, 2500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-white transition-all duration-1000 ease-in-out
            ${isExiting ? 'opacity-0 scale-110' : 'opacity-100 scale-100'}`}>
            <div className="relative flex flex-col items-center">
                {/* Logo Container */}
                <div className={`relative z-20 transition-transform duration-1000 ease-in-out
                    ${isExiting ? 'scale-150 opacity-0' : 'scale-100 opacity-100'}`}>
                    <Image
                        width={128}
                        height={128}
                        src="/assets/imgs/ortachala/formus.svg"
                        alt="Formus Logo"
                        className="w-32 h-32 object-contain animate-pulse"
                    />
                </div>

                {/* Animated Circles */}
                <div className="absolute -z-10 w-[300px] h-[300px]">
                    <div className="absolute inset-0 animate-[spin_8s_linear_infinite]">
                        <div className="w-full h-full border-2 border-blue-500/20 rounded-full" />
                    </div>
                    <div className="absolute inset-0 animate-[spin_6s_linear_infinite_reverse]">
                        <div className="w-full h-full border-2 border-blue-400/30 rounded-full" />
                    </div>
                    <div className="absolute inset-0 animate-[spin_4s_linear_infinite]">
                        <div className="w-full h-full border-2 border-blue-300/40 rounded-full" />
                    </div>
                </div>

                {/* Loading Progress Bar */}
                <div className="mt-8 w-32 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full animate-loading-progress" />
                </div>
            </div>

            {/* Add keyframes for loading progress animation */}
            <style jsx global>{`
                @keyframes loading-progress {
                    0% {
                        width: 0%;
                        transform: translateX(-100%);
                    }
                    50% {
                        width: 100%;
                    }
                    100% {
                        width: 0%;
                        transform: translateX(100%);
                    }
                }
                .animate-loading-progress {
                    animation: loading-progress 2s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default InitialLoading;