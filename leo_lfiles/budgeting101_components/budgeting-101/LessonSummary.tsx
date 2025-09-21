'use client';

import { useState } from 'react';
import { summarizeLesson } from '@/ai/flows/lesson-summaries';
import { getLessonContentAsString } from '@/lib/lessons';
import { useLesson } from '@/app/contexts/LessonContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, BookCheck } from 'lucide-react';
import type { Lesson } from '@/lib/lessons';

export default function LessonSummary({ lesson }: { lesson: Lesson }) {
  const { lessons } = useLesson();
  const [userInfo, setUserInfo] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSummarize = async () => {
    setIsLoading(true);
    setSummary('');

    try {
      const lessonContent = lessons
        .map((l) => getLessonContentAsString(l))
        .join('\n\n');
      const res = await summarizeLesson({ lessonContent, userInfo });
      setSummary(res.summary);
    } catch (error) {
      console.error('Error generating summary:', error);
      toast({
        variant: 'destructive',
        title: 'Summarization Error',
        description:
          'Could not generate the summary. The wizard might be busy.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {lesson.content && (
        <p className="text-muted-foreground">{lesson.content}</p>
      )}

      <Textarea
        value={userInfo}
        onChange={(e) => setUserInfo(e.target.value)}
        placeholder="Add your financial goals, spending habits, or any other personal notes here to make the summary more relevant to you."
        className="min-h-[8rem] text-base"
      />

      <div className="text-center">
        <Button
          onClick={handleSummarize}
          disabled={isLoading}
          size="lg"
          className="bg-accent text-accent-foreground hover:bg-accent/90"
        >
          {isLoading ? (
            <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Generate My Summary
        </Button>
      </div>

      {summary && (
        <Card className="bg-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookCheck />
              Your Personalized Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{summary}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
