import React from "react";

type FormInputGroupProps = {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  type?: "text" | "textarea";
  rows?: number;
};

export default function FormInputGroup({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  rows = 2,
}: FormInputGroupProps) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {type === "textarea" ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          rows={rows}
          className="w-full mt-1 rounded-md border-gray-300 focus:border-rose-500 focus:ring-rose-500"
          placeholder={placeholder}
        />
      ) : (
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          className="w-full mt-1 rounded-md border-gray-300 focus:border-rose-500 focus:ring-rose-500"
          placeholder={placeholder}
        />
      )}
    </div>
  );
}