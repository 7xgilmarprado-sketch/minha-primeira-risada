/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Volume2, VolumeX, Heart, Music, Sparkles } from 'lucide-react';

// Nomes dos arquivos que você deve colocar na pasta "public"
const BABY_IMAGES = [
  "/karla-1.jpeg",
  "/karla-2.jpeg",
  "/karla-3.jpeg",
  "/karla-4.jpeg",
  "/karla-5.jpeg",
];

export default function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const [audioError, setAudioError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleImageError = (index: number) => {
    console.error(`Erro ao carregar imagem: ${BABY_IMAGES[index]}`);
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  const handleAudioError = (e: any) => {
    console.error("Erro ao carregar áudio:", e);
    setAudioError("Não foi possível carregar o arquivo 'risada.mp3'. Verifique se ele está na pasta 'public'.");
  };
  useEffect(() => {
    if (!hasStarted) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % BABY_IMAGES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [hasStarted]);

  const startApp = () => {
    setHasStarted(true);
    setIsPlaying(true);
    
    // Tenta reproduzir o áudio imediatamente após a interação do usuário
    if (audioRef.current) {
      audioRef.current.play().catch((err) => {
        console.error("Erro ao iniciar áudio:", err);
        // Se falhar, tentamos novamente em um pequeno delay
        setTimeout(() => {
          audioRef.current?.play().catch(console.error);
        }, 300);
      });
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(console.error);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF5F7] flex flex-col items-center justify-center font-sans overflow-hidden relative">
      {/* Immersive Background Gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-200/40 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-200/40 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-white/20 rounded-full blur-[80px]" />
      </div>

      <AnimatePresence mode="wait">
        {!hasStarted ? (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="z-50 flex flex-col items-center gap-8 text-center px-6"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-32 h-32 bg-linear-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center shadow-xl shadow-pink-200"
            >
              <Heart size={64} fill="white" className="text-white" />
            </motion.div>
            
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-pink-600 tracking-tight">
                Minha Primeira Risada
              </h1>
              <p className="text-purple-400 text-lg font-medium">
                Um presente especial de Karla Romano
              </p>
            </div>

            <button
              onClick={startApp}
              className="group relative px-10 py-4 bg-pink-500 text-white rounded-full font-bold text-xl shadow-lg shadow-pink-200 hover:bg-pink-600 transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
            >
              Começar <Sparkles size={24} className="group-hover:animate-spin" />
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="z-10 w-full max-w-lg flex flex-col items-center gap-8 px-4"
          >
            {/* Header */}
            <div className="text-center space-y-1">
              <motion.h2 
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                className="text-2xl font-bold text-pink-500 uppercase tracking-widest text-sm"
              >
                Karla Romano
              </motion.h2>
              <h1 className="text-4xl font-serif italic text-purple-700">Minha Primeira Risada</h1>
            </div>

            {/* Main Image Container - Organic Shape */}
            <div className="relative w-full aspect-[4/5] max-w-sm">
              <div className="absolute inset-0 bg-pink-200 rounded-[4rem] rotate-3 scale-105" />
              <div className="absolute inset-0 bg-purple-200 rounded-[4rem] -rotate-3 scale-105" />
              <div className="relative w-full h-full bg-white rounded-[4rem] overflow-hidden border-8 border-white shadow-2xl">
                <AnimatePresence mode="wait">
                  {imageErrors[currentImageIndex] ? (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-pink-50 text-pink-300 p-8 text-center">
                      <Heart size={48} className="mb-4" />
                      <p className="text-sm font-medium">Imagem não encontrada</p>
                      <p className="text-[10px] opacity-60 mt-1">{BABY_IMAGES[currentImageIndex]}</p>
                    </div>
                  ) : (
                    <motion.img
                      key={currentImageIndex}
                      src={BABY_IMAGES[currentImageIndex]}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.8, ease: "circOut" }}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={() => handleImageError(currentImageIndex)}
                    />
                  )}
                </AnimatePresence>
              </div>
              
              {/* Floating Icons */}
              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-6 -right-6 bg-white p-4 rounded-full shadow-lg text-pink-500"
              >
                <Heart size={32} fill="currentColor" />
              </motion.div>
              <motion.div 
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
                className="absolute -bottom-6 -left-6 bg-white p-4 rounded-full shadow-lg text-purple-500"
              >
                <Music size={32} />
              </motion.div>
            </div>

            {/* Controls */}
            <div className="w-full max-w-xs bg-white/40 backdrop-blur-xl rounded-3xl p-6 flex flex-col items-center gap-6 border border-white/50 shadow-xl">
              <div className="flex items-center gap-8">
                <button 
                  onClick={toggleMute}
                  className="p-4 rounded-full bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors"
                >
                  {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                </button>

                <button 
                  onClick={togglePlay}
                  className="w-20 h-20 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-lg shadow-pink-200 hover:bg-pink-600 transition-all hover:scale-110 active:scale-90"
                >
                  {isPlaying ? <Pause size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" className="ml-2" />}
                </button>

                <div className="p-4 rounded-full bg-pink-50 text-pink-500">
                  <Heart size={24} fill={isPlaying ? "currentColor" : "none"} className={isPlaying ? "animate-pulse" : ""} />
                </div>
              </div>

              <div className="w-full space-y-2">
                <div className="h-1.5 w-full bg-pink-100 rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ x: isPlaying ? ["-100%", "100%"] : "0%" }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="h-full w-1/3 bg-pink-400 rounded-full"
                  />
                </div>
                <p className="text-center text-purple-400 text-xs font-medium uppercase tracking-widest">
                  {isPlaying ? "Reproduzindo Risada..." : "Pausado"}
                </p>
              </div>
            </div>

            {audioError && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-red-50 text-red-500 text-[10px] rounded-xl text-center max-w-[200px]"
              >
                {audioError}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Áudio local da risada - Movido para fora para garantir que o ref esteja sempre pronto */}
      <audio 
        ref={audioRef}
        loop
        src="/risada.mp3"
        onError={handleAudioError}
      />

      {/* Global Floating Sparkles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 0.5, 0],
              scale: [0.5, 1, 0.5],
              x: Math.random() * 100 + "vw",
              y: Math.random() * 100 + "vh"
            }}
            transition={{ 
              duration: 3 + Math.random() * 4, 
              repeat: Infinity,
              delay: Math.random() * 5
            }}
            className="absolute text-pink-300"
          >
            <Sparkles size={16 + Math.random() * 16} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
