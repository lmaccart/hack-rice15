'use client';
import { useState, useMemo } from 'react';
import { LessonSlide } from './lesson-slide';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { type Lesson } from '@/lib/lessons';

export function Slideshow({ lessons }: SlideshowProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < lessons.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const progress = useMemo(() => ((currentSlide + 1) / lessons.length) * 100, [currentSlide, lessons.length]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="relative w-full max-w-4xl min-h-[300px] h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
        <LessonSlide
          key={currentSlide}
          lesson={lessons[currentSlide]}
        />
      </div>
      <div className="flex items-center gap-4 mt-8 w-full max-w-4xl">
        <Button variant="outline" size="icon" onClick={handlePrev} disabled={currentSlide === 0}>
          <ArrowLeft />
        </Button>
        <div className="flex-grow flex items-center gap-4">
            <Progress value={progress} className="h-2 [&>div]:bg-primary"/>
            <span className="text-sm font-mono text-muted-foreground w-20 text-right">{currentSlide + 1} / {lessons.length}</span>
        </div>
        <Button variant="outline" size="icon" onClick={handleNext} disabled={currentSlide === lessons.length - 1}>
          <ArrowRight />
        </Button>
      </div>
    </div>
  );
}
