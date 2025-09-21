'use client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Download } from 'lucide-react';

interface SummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: string;
}

export function SummaryModal({ isOpen, onClose, summary }: SummaryModalProps) {
  const handleDownload = () => {
    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'credit-score-101-summary.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline text-primary">Lesson Summary</DialogTitle>
          <DialogDescription>
            Here are the key takeaways from your personalized lesson plan.
          </DialogDescription>
        </DialogHeader>
        <Textarea value={summary} readOnly rows={15} className="bg-background/50" />
        <DialogFooter>
          <Button onClick={handleDownload} className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Download .txt
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
