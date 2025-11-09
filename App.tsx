import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUpload } from './components/ImageUpload';
import { MedicationInfo } from './components/MedicationInfo';
import { Chatbot } from './components/Chatbot';
import { Loader } from './components/Loader';
import { identifyMedication } from './services/geminiService';
import { Medication } from './types';
import { Pill3D } from './components/Pill3D';

type View = 'upload' | 'result';

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // remove "data:image/jpeg;base64," prefix
      resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });
}

export default function App() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [medicationInfo, setMedicationInfo] = useState<Medication | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<View>('upload');

  const handleIdentify = useCallback(async () => {
    if (!imageFile) return;
    setIsLoading(true);
    setError(null);
    try {
      const base64Image = await fileToBase64(imageFile);
      const result = await identifyMedication(base64Image);
      if (result && result.name && result.name.toLowerCase() !== 'unknown') {
        setMedicationInfo(result);
        setView('result');
      } else {
        setError("Could not identify the medication. Please try another image.");
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while identifying the medication. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [imageFile]);

  const handleReset = () => {
    setImageFile(null);
    setMedicationInfo(null);
    setError(null);
    setView('upload');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-800 dark:text-slate-200">
      <Header onReset={handleReset} />
      <main className="flex-grow container mx-auto p-4 md:p-8 w-full">
        {isLoading && <Loader message="Analyzing medication..." />}
        {view === 'upload' && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="h-64 w-full cursor-grab active:cursor-grabbing">
              <Pill3D />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 -mt-8">
              Pill Pal AI
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              Take or upload a photo of a medication to identify it and get answers to your questions.
            </p>
            <ImageUpload onImageSelect={setImageFile} />
            {error && (
              <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/50 border border-red-400 text-red-700 dark:text-red-300 rounded-lg">
                {error}
              </div>
            )}
            <div className="mt-8">
              <button
                onClick={handleIdentify}
                disabled={!imageFile || isLoading}
                className="w-full sm:w-auto bg-sky-600 hover:bg-sky-700 disabled:bg-slate-400 dark:disabled:bg-slate-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition-transform duration-200 hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
              >
                Identify Medication
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-8">
              Disclaimer: This tool is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment.
            </p>
          </div>
        )}

        {view === 'result' && medicationInfo && imageFile && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
              <MedicationInfo
                medication={medicationInfo}
                imageUrl={URL.createObjectURL(imageFile)}
                onReset={handleReset}
              />
            </div>
            <div className="h-[80vh] flex flex-col bg-white dark:bg-slate-800 rounded-2xl shadow-lg">
              <Chatbot medicationInfo={medicationInfo} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}