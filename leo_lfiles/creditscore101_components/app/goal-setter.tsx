'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { PixelatedLogo } from './pixelated-logo';

interface GoalSetterProps {
  onGoalSet: (goal: string) => void;
}

export function GoalSetter({ onGoalSet }: GoalSetterProps) {
  const [goal, setGoal] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (goal.trim()) {
      setIsLoading(true);
      onGoalSet(goal.trim());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full p-4 animate-fade-in">
      <Card className="w-full max-w-md animate-fade-in-up">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <PixelatedLogo />
          </div>
          <CardTitle className="font-headline text-3xl text-primary">Credit Score 101</CardTitle>
          <CardDescription className="text-muted-foreground">Master your financial future. Personalize your learning experience.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <label htmlFor="goal" className="block text-sm font-medium mb-2">What is your primary financial goal?</label>
            <Input
              id="goal"
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g., Buy a new car, get a mortgage, etc."
              className="bg-background/50"
              disabled={isLoading}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={!goal.trim() || isLoading}>
              {isLoading ? <Loader2 className="animate-spin" /> : 'Start Learning'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
