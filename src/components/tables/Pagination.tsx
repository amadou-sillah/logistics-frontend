import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../ui/Button';
import { twMerge } from 'tailwind-merge';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  showTotal?: boolean;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
  showTotal = false,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className={twMerge('flex items-center justify-between', className)}>
      <Button
        variant="ghost"
        size="sm"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft className="h-4 w-4" /> Previous
      </Button>
      <span className="text-sm">
        Page {currentPage} of {totalPages}
        {showTotal && ` (${totalPages * 10}+ items)`}
      </span>
      <Button
        variant="ghost"
        size="sm"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
