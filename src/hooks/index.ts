import { useState } from 'react';

interface InputProps {
  value: any;
  onChange(event: React.ChangeEvent<HTMLInputElement>): void
}

/**
 * Input onChange and useState
 * @param initialValue
 */
export function useFormInput(initialValue: any): InputProps {
  const [value, setValue] = useState(initialValue);
  function handleChange(event: React.ChangeEvent<HTMLInputElement & HTMLTextAreaElement>): void {
    setValue(event.target.value);
  };
  return {
    value,
    onChange: handleChange
  };
}

