import type { CategoryId } from '../types';
import { CATEGORIES } from '../data/categories';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

interface Props {
  onSelect: (categoryId: CategoryId) => void;
  onBack: () => void;
}

export function CategorySelect({ onSelect, onBack }: Props) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose a Category</h2>
      <p className="text-gray-600 mb-8">Pick the buzzwords you'll hear in your meeting</p>

      <div className="grid gap-4 w-full max-w-md">
        {CATEGORIES.map(cat => (
          <Card
            key={cat.id}
            className="cursor-pointer hover:border-blue-400 hover:shadow-md transition-all duration-150"
            onClick={() => onSelect(cat.id)}
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl">{cat.icon}</span>
              <div>
                <h3 className="font-semibold text-gray-900">{cat.name}</h3>
                <p className="text-sm text-gray-500">{cat.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Button variant="ghost" onClick={onBack} className="mt-6">
        Back
      </Button>
    </div>
  );
}
