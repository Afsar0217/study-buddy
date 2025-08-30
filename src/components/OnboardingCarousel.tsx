import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight, Users, MessageSquare, Calendar, Target } from 'lucide-react';

interface OnboardingSlide {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const slides: OnboardingSlide[] = [
  {
    icon: <Users className="w-16 h-16 text-blue-500" />,
    title: "Find Your Study Match",
    description: "Connect with like-minded students who share your courses and academic goals. Swipe to discover your perfect study buddy."
  },
  {
    icon: <MessageSquare className="w-16 h-16 text-green-500" />,
    title: "Chat & Collaborate",
    description: "Engage in secure conversations, share resources, and discuss challenging topics with your study partners."
  },
  {
    icon: <Calendar className="w-16 h-16 text-purple-500" />,
    title: "Schedule Sessions",
    description: "Easily coordinate virtual or in-person study sessions that fit both your schedules. Never miss a productive study opportunity."
  },
  {
    icon: <Target className="w-16 h-16 text-orange-500" />,
    title: "Stay Accountable",
    description: "Set goals together, track progress, and motivate each other to achieve academic success through collaborative learning."
  }
];

interface OnboardingCarouselProps {
  onComplete: () => void;
}

export function OnboardingCarousel({ onComplete }: OnboardingCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex justify-between items-center p-6">
        <button
          onClick={prevSlide}
          className={`p-2 rounded-full ${
            currentSlide === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <ChevronLeft className="w-6 h-6 text-muted-foreground" />
        </button>
        
        <div className="flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-blue-500 w-8' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        <button
          onClick={onComplete}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Skip
        </button>
      </div>

      {/* Slide Content */}
      <div className="flex-1 flex items-center justify-center px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="text-center max-w-sm"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mb-8"
            >
              {slides[currentSlide].icon}
            </motion.div>
            
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="text-2xl font-bold mb-4 text-foreground"
            >
              {slides[currentSlide].title}
            </motion.h2>
            
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="text-muted-foreground leading-relaxed"
            >
              {slides[currentSlide].description}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <div className="p-6">
        <Button
          onClick={nextSlide}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl"
        >
          {currentSlide === slides.length - 1 ? 'Get Started' : 'Continue'}
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}