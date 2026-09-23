import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

type FormFieldProps = {
  id: string;
  label: string;
  textarea?: false;
} & InputHTMLAttributes<HTMLInputElement>;

type TextareaFieldProps = {
  id: string;
  label: string;
  textarea: true;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

export default function FormField(props: FormFieldProps | TextareaFieldProps) {
  const { id, label, textarea, ...fieldProps } = props;

  return (
    <label className="form-field" htmlFor={id}>
      <span>{label}</span>
      {textarea ? (
        <textarea id={id} {...(fieldProps as TextareaHTMLAttributes<HTMLTextAreaElement>)} />
      ) : (
        <input id={id} {...(fieldProps as InputHTMLAttributes<HTMLInputElement>)} />
      )}
    </label>
  );
}
