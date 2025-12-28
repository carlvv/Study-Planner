type TextInputProps = {
  label: string;
  value: string;
  onChange: (e: string) => void;
  placeholder?: string;
  type?: string;
  name?: string;
};

function TextInput({
  label,
  value,
  onChange,
  placeholder,
  name,
}: TextInputProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-sm font-medium text-gray-900 w-full">
        {label}
      </label>

      <input
        type="text"
        name={name}
        value={value}
        onChange={(e) => onChange(e.currentTarget.value)}
        placeholder={placeholder}
        className="
          w-full
          rounded-lg
          bg-gray-300
          px-4
          py-1
          text-gray-900
          placeholder-gray-600
          focus:outline-none
          focus:ring-2
          focus:ring-gray-500
        "
      />
    </div>
  );
}

export default TextInput;
