import type { ReactNode, SelectHTMLAttributes } from 'react';

type SelectFieldProps = {
  id: string;
  label: string;
  children: ReactNode;
} & SelectHTMLAttributes<HTMLSelectElement>;

export default function SelectField({ id, label, children, ...props }: SelectFieldProps) {
  return (
    <label className="form-field" htmlFor={id}>
      <span>{label}</span>
      <select id={id} {...props}>
        {children}
      </select>
    </label>
  );
}
