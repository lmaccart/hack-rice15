'use client';

import { useState, useEffect, useRef } from 'react';
import { Sparkles, Bot, Send } from 'lucide-react';
import { getWizardGuidance } from '@/ai/flows/ai-wizard-guidance';
import { useLesson } from '@/app/contexts/LessonContext';
import { getLessonContentAsString } from '@/lib/lessons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

export default function AIWizard() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState<
    { type: 'user' | 'wizard'; text: string }[]
  >([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { currentLesson } = useLesson();
  const { toast } = useToast();
  const contentRef = useRef<HTMLDivElement>(null);
  const wizardImage = '/wizard.png';

  useEffect(() => {
    async function getInitialGuidance() {
      try {
        setIsLoading(true);
        const lessonContent = getLessonContentAsString(currentLesson);
        const res = await getWizardGuidance({ lessonContent });
        setMessage(res.guidance);
        setHistory([]);
        setUserInput('');
      } catch (error) {
        console.error('Error fetching initial guidance:', error);
        toast({
          variant: 'destructive',
          title: 'Oh no!',
          description:
            'The wizard seems to be sleeping. Could not get guidance.',
        });
      } finally {
        setIsLoading(false);
      }
    }
    getInitialGuidance();
  }, [currentLesson, toast]);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [history]);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const newHistory = [...history, { type: 'user' as const, text: userInput }];
    setHistory(newHistory);
    setUserInput('');
    setIsLoading(true);

    try {
      const lessonContent = getLessonContentAsString(currentLesson);
      const res = await getWizardGuidance({
        lessonContent,
        userQuestion: userInput,
      });
      setHistory([
        ...newHistory,
        { type: 'wizard' as const, text: res.guidance },
      ]);
    } catch (error) {
      console.error('Error fetching wizard guidance:', error);
      setHistory([
        ...newHistory,
        {
          type: 'wizard' as const,
          text: 'Sorry, my crystal ball is a bit cloudy. Please try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={handleToggle}
          className="h-auto rounded-full bg-transparent p-0 shadow-lg hover:bg-transparent"
          size="lg"
          aria-label="Open AI Wizard"
        >
          <Image
            src={wizardImage}
            alt="Pixel art wizard"
            width={80}
            height={80}
            className="transform"
            style={{ imageRendering: 'pixelated' }}
          />
        </Button>
      </div>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-full max-w-sm shadow-2xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={wizardImage}
              alt="Pixel art wizard"
              className="transform"
              style={{ imageRendering: 'pixelated' }}
            />
            <AvatarFallback>
              <Bot />
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg font-headline">AI Wizard</CardTitle>
            <CardDescription>Your guide to financial literacy</CardDescription>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={handleToggle}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="m18 18-6-6-6 6" />
            <path d="m6 6 6 6 6-6" />
          </svg>
          <span className="sr-only">Close</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div
          ref={contentRef}
          className="prose-sm prose-p:my-2 h-64 space-y-4 overflow-y-auto rounded-md border bg-muted/50 p-4"
        >
          {isLoading && history.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <Sparkles className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8 border">
                  <AvatarImage
                    src={wizardImage}
                    alt="Wizard"
                    style={{ imageRendering: 'pixelated' }}
                  />
                  <AvatarFallback>W</AvatarFallback>
                </Avatar>
                <div className="rounded-lg bg-background p-3">
                  <p>{message}</p>
                </div>
              </div>

              {history.map((chat, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 ${
                    chat.type === 'user' ? 'justify-end' : ''
                  }`}
                >
                  {chat.type === 'wizard' && (
                    <Avatar className="h-8 w-8 border">
                      <AvatarImage
                        src={wizardImage}
                        alt="Wizard"
                        style={{ imageRendering: 'pixelated' }}
                      />
                      <AvatarFallback>W</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      chat.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-background'
                    }`}
                  >
                    <p>{chat.text}</p>
                  </div>
                </div>
              ))}
              {isLoading && history.length > 0 && (
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8 border">
                    <AvatarImage
                      src={wizardImage}
                      alt="Wizard"
                      style={{ imageRendering: 'pixelated' }}
                    />
                    <AvatarFallback>W</AvatarFallback>
                  </Avatar>
                  <div className="rounded-lg bg-background p-3">
                    <Sparkles className="h-5 w-5 animate-pulse text-primary" />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        <form onSubmit={handleSubmit} className="mt-4 flex items-center gap-2">
          <Input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Ask a question..."
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
