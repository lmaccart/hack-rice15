'use client';

import Image from 'next/image';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import { useLesson } from '@/app/contexts/LessonContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import NeedsVsWantsGame from './NeedsVsWantsGame';
import PersonalReflection from './PersonalReflection';
import LessonSummary from './LessonSummary';
import NextSteps from './NextSteps';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function LessonSlideshow() {
  const {
    currentLesson,
    currentSlide,
    setCurrentSlide,
    totalSlides,
    progress,
  } = useLesson();
  const direction = 1; // Assuming always moving forward for this simple example

  const variants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? 1000 : -1000,
        opacity: 0,
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0,
      };
    },
  };

  const handleNext = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const renderSlideContent = () => {
    const image = currentLesson.imageKey
      ? PlaceHolderImages.find((img) => img.id === currentLesson.imageKey)
      : undefined;

    const contentSection = (
      <>
        {image && (
          <div className="relative mb-6 h-60 w-full overflow-hidden rounded-lg">
            <Image
              src={image.imageUrl}
              alt={image.description}
              fill
              className="object-cover"
              data-ai-hint={image.imageHint}
            />
          </div>
        )}
        {typeof currentLesson.content === 'string' ? (
          <p>{currentLesson.content}</p>
        ) : (
          currentLesson.content?.map((paragraph, index) => (
            <p key={index} className="mb-4">
              {paragraph}
            </p>
          ))
        )}
      </>
    );

    switch (currentLesson.type) {
      case 'intro':
      case 'content':
        return contentSection;
      case 'game':
        return <NeedsVsWantsGame lesson={currentLesson} />;
      case 'reflection':
        return <PersonalReflection lesson={currentLesson} />;
      case 'summary':
        return <LessonSummary lesson={currentLesson} />;
      case 'next-steps':
        return <NextSteps />;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-3xl overflow-hidden shadow-2xl">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
        >
          <CardHeader>
            <Progress value={progress} className="mb-4" />
            <CardTitle className="text-3xl font-bold font-headline tracking-widest">
              {currentLesson.title}
            </CardTitle>
            <CardDescription>
              Step {currentSlide + 1} of {totalSlides}
            </CardDescription>
          </CardHeader>
          <CardContent className="min-h-[20rem] text-lg">
            {renderSlideContent()}
          </CardContent>
        </motion.div>
      </AnimatePresence>
      <CardFooter className="flex justify-between border-t pt-6">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={currentSlide === 0}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <Button
          onClick={handleNext}
          disabled={currentSlide === totalSlides - 1}
          className="bg-accent text-accent-foreground hover:bg-accent/90"
        >
          Next
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
