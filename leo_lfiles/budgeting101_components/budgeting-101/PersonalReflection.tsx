import { Textarea } from '@/components/ui/textarea';
import type { Lesson } from '@/lib/lessons';

export default function PersonalReflection({ lesson }: { lesson: Lesson }) {
  return (
    <div className="space-y-4">
      {lesson.prompt && <p className="text-muted-foreground">{lesson.prompt}</p>}
      <Textarea
        placeholder="Your thoughts here..."
        className="min-h-[10rem] text-base"
        aria-label="Personal reflection input"
      />
    </div>
  );
}
