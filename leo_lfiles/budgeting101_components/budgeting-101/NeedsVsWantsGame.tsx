'use client';

import { useState } from 'react';
import {
  needsVsWantsGame,
  type NeedsVsWantsGameOutput,
} from '@/ai/flows/needs-vs-wants-game';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Sparkles, HelpCircle, CheckCircle2 } from 'lucide-react';
import type { Lesson } from '@/lib/lessons';

export default function NeedsVsWantsGame({ lesson }: { lesson: Lesson }) {
  const [item, setItem] = useState('');
  const [result, setResult] = useState<NeedsVsWantsGameOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item.trim()) {
      toast({
        variant: 'destructive',
        title: 'Empty Item',
        description: 'Please enter an item to categorize.',
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const res = await needsVsWantsGame({ item });
      setResult(res);
    } catch (error) {
      console.error('Error in Needs vs. Wants game:', error);
      toast({
        variant: 'destructive',
        title: 'Game Error',
        description: 'Could not categorize the item. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {lesson.content && <p className="text-muted-foreground">{lesson.content}</p>}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <Input
          value={item}
          onChange={(e) => setItem(e.target.value)}
          placeholder="e.g., A new video game"
          disabled={isLoading}
          className="text-base"
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <Sparkles className="h-4 w-4 animate-pulse" />
          ) : (
            'Categorize'
          )}
        </Button>
      </form>

      {result && (
        <Alert
          className={`border-2 ${
            result.category === 'need'
              ? 'border-green-500'
              : 'border-amber-500'
          }`}
        >
          {result.category === 'need' ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <HelpCircle className="h-4 w-4" />
          )}
          <AlertTitle className="text-xl font-bold capitalize">
            It's a "{result.category}"
          </AlertTitle>
          <AlertDescription>{result.explanation}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
