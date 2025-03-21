const InputField = ({ label, type = "text", placeholder, value, onChange, onEnter }: { 
  label?: string, 
  type?: string, 
  placeholder?: string,
  value?: string,
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void 
  onEnter?: () => void 
}) => {


  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      if(onEnter){ onEnter() }
    }
  };

  return (
    <div className="w-full">
      {label && <label className="text-gray-700 font-medium">{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onKeyDown={handleKeyDown}
        onChange={onChange}
        className="w-full h-[50px] px-6 py-2 rounded-[25px] bg-[#3F4454] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
      />
    </div>
  );
};

export default InputField;

