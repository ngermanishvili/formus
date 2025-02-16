import React from 'react';

const LoadingComponent = () => {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-lg text-gray-600">იტვირთება...</p>
            </div>
        </div>
    );
};

export default LoadingComponent;