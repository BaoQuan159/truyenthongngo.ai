
import React, { useState, useCallback } from 'react';
import type { ImageFile } from './types';
import { ImageUploader } from './components/ImageUploader';
import { LoadingSpinner } from './components/LoadingSpinner';
import { generateCharacterProductImage } from './services/geminiService';

const CharacterIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const ProductIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
);


function App() {
  const [characterImage, setCharacterImage] = useState<ImageFile | null>(null);
  const [productImage, setProductImage] = useState<ImageFile | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const canGenerate = characterImage && productImage && !isLoading;

  const handleGenerateClick = useCallback(async () => {
    if (!canGenerate) return;

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const result = await generateCharacterProductImage(characterImage, productImage);
      setGeneratedImage(result);
    } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError('An unexpected error occurred.');
        }
    } finally {
      setIsLoading(false);
    }
  }, [canGenerate, characterImage, productImage]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
            Character Product Mashup
          </h1>
          <p className="mt-2 text-lg text-gray-400">
            Powered by Nano Banana (gemini-2.5-flash-image)
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <ImageUploader 
                title="Character Image" 
                icon={<CharacterIcon />}
                image={characterImage}
                onImageSelect={setCharacterImage}
              />
              <ImageUploader 
                title="Product Image" 
                icon={<ProductIcon />}
                image={productImage}
                onImageSelect={setProductImage}
              />
            </div>
            <div className="mt-6">
              <button
                onClick={handleGenerateClick}
                disabled={!canGenerate}
                className="w-full flex items-center justify-center py-3 px-6 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-all duration-300"
              >
                {isLoading ? <LoadingSpinner /> : null}
                {isLoading ? 'Generating...' : 'Generate Mashup'}
              </button>
            </div>
          </div>

          {/* Output Section */}
          <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-700 flex flex-col justify-center items-center aspect-square">
            {isLoading && (
              <div className="text-center">
                 <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-indigo-500 mx-auto"></div>
                <p className="mt-4 text-gray-400">The model is thinking...</p>
              </div>
            )}
            {error && (
              <div className="text-center text-red-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="font-semibold">Generation Failed</p>
                <p className="text-sm">{error}</p>
              </div>
            )}
            {!isLoading && !error && generatedImage && (
              <div className="w-full h-full flex flex-col group relative">
                <img src={generatedImage} alt="Generated mashup" className="w-full h-full object-contain rounded-lg" />
                 <a
                    href={generatedImage}
                    download="character-product-mashup.png"
                    className="absolute bottom-4 right-4 bg-indigo-600 text-white py-2 px-4 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-indigo-700"
                  >
                    Download
                  </a>
              </div>
            )}
            {!isLoading && !error && !generatedImage && (
              <div className="text-center text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p>Your generated image will appear here.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
