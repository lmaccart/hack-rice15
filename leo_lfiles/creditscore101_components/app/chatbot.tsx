'use client';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Bot, User, Loader2, ArrowRight } from 'lucide-react';
import { answerFinancialQuestion } from '@/ai/flows/answer-financial-questions';

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  role: 'user' | 'bot';
  content: string;
}

export function Chatbot({ isOpen, onClose }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div');
        if (viewport) {
          viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
        }
    }
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const response = await answerFinancialQuestion({ question: currentInput });
      const botMessage: Message = { role: 'bot', content: response.answer };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = { role: 'bot', content: 'Sorry, I encountered an error. Please try again.' };
      setMessages(prev => [...prev, errorMessage]);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Card className="fixed bottom-4 left-4 w-full max-w-sm h-[60vh] flex flex-col shadow-2xl shadow-black/50 z-50 animate-fade-in-up border-accent">
      <CardHeader className="flex flex-row items-center justify-between py-3 px-4 border-b border-accent/50">
        <CardTitle className="font-headline text-lg text-accent flex items-center gap-2"><Bot /> AI Assistant</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex-grow p-0">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="space-y-4 p-4">
            <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-accent/20"><Bot className="w-5 h-5 text-accent"/></div>
                <div className="bg-muted p-3 rounded-lg max-w-[80%]">
                    <p className="text-sm">Hi! Ask me any question about credit scores and financial literacy.</p>
                </div>
            </div>
            {messages.map((message, index) => (
              <div key={index} className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
                {message.role === 'bot' && <div className="p-2 rounded-full bg-accent/20"><Bot className="w-5 h-5 text-accent"/></div>}
                <div className={`p-3 rounded-lg max-w-[80%] ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
                {message.role === 'user' && <div className="p-2 rounded-full bg-primary/20"><User className="w-5 h-5 text-primary"/></div>}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-accent/20"><Bot className="w-5 h-5 text-accent"/></div>
                <div className="bg-muted p-3 rounded-lg">
                  <Loader2 className="w-5 h-5 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-2 border-t">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex w-full items-center gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            disabled={isLoading}
            className="bg-background/50"
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
