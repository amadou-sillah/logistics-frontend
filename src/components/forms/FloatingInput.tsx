import { forwardRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { useController, Control, FieldValues, Path } from 'react-hook-form';

interface FloatingInputProps<T extends FieldValues>
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: Path<T>;
  control: Control<T>;
  error?: string;
}

const FloatingInput = forwardRef<HTMLInputElement, FloatingInputProps<any>>(
  <T extends FieldValues>(
    { label, name, control, error, className, ...props }: FloatingInputProps<T>,
    ref
  ) => {
    const [focused, setFocused] = useState(false);
    const { field } = useController({ name, control });
    const hasValue = field.value !== undefined && field.value !== '';

    return (
      <div className="relative">
        <input
          ref={ref}
          {...field}
          className={twMerge(
            'peer block w-full rounded-lg border border-secondary-300 bg-transparent px-4 py-3 text-sm placeholder-transparent focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-secondary-700 dark:text-white',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            className
          )}
          placeholder=" "
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
        <label
          className={twMerge(
            'absolute left-3 top-3 text-sm text-secondary-500 transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-secondary-400 peer-focus:-translate-y-3 peer-focus:text-xs peer-focus:text-primary-500 dark:text-secondary-400',
            (focused || hasValue) && '-translate-y-3 text-xs text-primary-500',
            error && 'text-red-500'
          )}
        >
          {label}
        </label>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

FloatingInput.displayName = 'FloatingInput';
export default FloatingInput;