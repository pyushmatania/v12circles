import React from 'react';

interface TrailerFallbackProps {
  projectTitle: string;
  platformName: string;
  platformUrl: string;
  message: string;
}

export const TrailerFallback: React.FC<TrailerFallbackProps> = ({
  projectTitle,
  platformName,
  platformUrl,
  message
}) => {
  return (
    <div className="trailer-fallback bg-gray-100 dark:bg-gray-800 rounded-lg p-6 text-center">
      <div className="mb-4">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {projectTitle} Trailer
      </h3>
      
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        Trailer temporarily unavailable on YouTube
      </p>
      
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        {message}
      </p>
      
      <a
        href={platformUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
        Watch on {platformName}
      </a>
    </div>
  );
};

export default TrailerFallback;