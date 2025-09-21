'use client';

import { useState, useEffect } from 'react';
import { recommendNextSteps } from '@/ai/flows/next-steps-recommendation';
import { getFullCourseContentAsString } from '@/lib/lessons';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Forward } from 'lucide-react';

export default function NextSteps() {
  const [recommendations, setRecommendations] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function getRecommendations() {
      try {
        const lessonSummary = getFullCourseContentAsString();
        const res = await recommendNextSteps({ lessonSummary });
        setRecommendations(res.nextSteps);
      } catch (error) {
        console.error('Error fetching next steps:', error);
        toast({
          variant: 'destructive',
          title: 'Recommendation Error',
          description: 'Could not get next steps. Please try again later.',
        });
        setRecommendations(
          'Could not load recommendations at this time. Try exploring topics like "saving for retirement" or "understanding credit scores".'
        );
      } finally {
        setIsLoading(false);
      }
    }
    getRecommendations();
  }, [toast]);

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">
        You've completed the Budgeting 101 lesson. Here are some recommended
        next steps to continue your financial journey.
      </p>
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-4">Generating your path forward...</p>
        </div>
      ) : (
        <div className="prose prose-lg max-w-none">
          <ul className="space-y-2">
            {recommendations.split('\n').map((step, index) => {
              const cleanedStep = step.replace(/^-|^\*|\d+\.\s*/, '').trim();
              if (!cleanedStep) return null;
              return (
                <li key={index} className="flex items-start">
                  <Forward className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-accent" />
                  <span>{cleanedStep}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
