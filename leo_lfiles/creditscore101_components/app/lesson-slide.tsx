'use client';

import { useState } from 'react';
import { type Lesson } from '@/lib/lessons';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface LessonSlideProps {
  lesson: Lesson;
}

export function LessonSlide({ lesson }: LessonSlideProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const { toast } = useToast();

  const handleCheckAnswer = () => {
    if (!selectedAnswer || !lesson.question) return;
    setIsAnswered(true);
    if (selectedAnswer === lesson.question.correctAnswer) {
      toast({
        title: "Correct!",
        description: "Great job!",
        className: 'bg-success text-success-foreground border-success'
      });
    } else {
      toast({
        variant: "destructive",
        title: "Not quite!",
        description: `The correct answer is: ${lesson.question.correctAnswer}`,
      });
    }
  };

  const getOptionClass = (option: string) => {
    if (!isAnswered || !lesson.question) return '';
    if (option === lesson.question.correctAnswer) return 'text-success';
    if (option === selectedAnswer) return 'text-destructive';
    return '';
  };
  
  return (
    <Card className="w-full h-full border-primary/50 shadow-lg shadow-primary/10 animate-fade-in-up flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline text-3xl md:text-4xl text-primary">{lesson.title}</CardTitle>
        <CardDescription>Lesson {lesson.id}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto">
        <p className="text-base md:text-lg leading-relaxed whitespace-pre-wrap">{lesson.content}</p>
        {lesson.question && (
          <div className="mt-8 pt-6 border-t border-border">
            <h3 className="font-headline text-xl mb-4">Knowledge Check</h3>
            <p className="mb-4">{lesson.question.text}</p>
            <RadioGroup
              value={selectedAnswer ?? ''}
              onValueChange={setSelectedAnswer}
              disabled={isAnswered}
            >
              {lesson.question.options.map((option) => (
                <div key={option} className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value={option} id={option} />
                  <Label htmlFor={option} className={`flex items-center gap-2 transition-colors ${getOptionClass(option)}`}>
                    {option}
                    {isAnswered && lesson.question && option === lesson.question.correctAnswer && <CheckCircle className="w-4 h-4 text-success" />}
                    {isAnswered && lesson.question && option === selectedAnswer && option !== lesson.question.correctAnswer && <XCircle className="w-4 h-4 text-destructive" />}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {!isAnswered && (
              <Button onClick={handleCheckAnswer} disabled={!selectedAnswer} className="mt-4">Check Answer</Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
