'use client';

import { useState } from 'react';
import { Slideshow } from './slideshow';
import { Chatbot } from './chatbot';
import { type Lesson } from '@/lib/lessons';
import { SummaryModal } from './summary-modal';
import { Button } from '@/components/ui/button';
import { FileText, MessageSquare, Loader2 } from 'lucide-react';
import { PixelatedLogo } from './pixelated-logo';

interface AppLayoutProps {
  userGoal: string;
  lessons: Lesson[];
  isLoading: boolean;
}

export function AppLayout({ userGoal, lessons, isLoading }: AppLayoutProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [summary, setSummary] = useState('');

  const generateSummary = () => {
    const allKeyPoints = lessons.flatMap(lesson => lesson.keyPoints);
    const summaryText = `Summary for your goal: ${userGoal}\n\n` + allKeyPoints.map(point => `- ${point}`).join('\n');
    setSummary(summaryText);
    setIsSummaryOpen(true);
  };

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center p-4 md:p-8 lg:p-12 animate-fade-in">
      <header className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <PixelatedLogo />
          <h1 className="font-headline text-2xl text-primary">Credit Score 101</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={generateSummary}>
            <FileText className="w-6 h-6 text-primary" />
            <span className="sr-only">Generate Summary</span>
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setIsChatOpen(!isChatOpen)}>
            <MessageSquare className="w-6 h-6 text-primary" />
            <span className="sr-only">Toggle Chat</span>
          </Button>
        </div>
      </header>

      {isLoading ? (
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="font-headline text-xl">Personalizing your lessons...</p>
        </div>
      ) : (
        <Slideshow lessons={lessons} />
      )}

      <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      <SummaryModal isOpen={isSummaryOpen} onClose={() => setIsSummaryOpen(false)} summary={summary} />

      <footer className="absolute bottom-4 text-center text-xs text-muted-foreground">
        Your goal: <span className="text-accent font-bold">{userGoal}</span>
      </footer>
    </div>
  );
}
