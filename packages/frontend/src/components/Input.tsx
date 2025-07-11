import React from "react";

type Option = {
  label: string;
  value: string;
  description?: string;
  disabled?: boolean;
};

type InputProps = {
  type:
    | "upload"
    | "text"
    | "input"
    | "dropdown"
    | "slider-token"
    | "radio-group";
  value?: string;
  label?: string;
  placeholder?: string;
  note?: string;
  options?: Option[];
  tokenAmount?: string;
  idrAmount?: string;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (val: string) => void;
  onUpload?: (file: File) => void;
};

export const Input: React.FC<InputProps> = ({
  type,
  value,
  label,
  placeholder,
  note,
  options = [],
  tokenAmount,
  idrAmount,
  min = 1,
  max = 100,
  step = 1,
  onChange,
  onUpload,
}) => {
  const inputId = "upload-file";
  const inputClass =
    "flex p-4 items-center gap-4 self-stretch rounded-2xl border bg-white focus:outline-none focus:ring-2 focus:ring-skpurple";

  return (
    <div className="flex flex-col items-start w-full gap-2.5 self-stretch p-2.5">
      {label && (
        <label className="text-base font-bold text-black text-left">
          {label}
        </label>
      )}

      {/* UPLOAD */}
      {type === "upload" && (
        <label
          htmlFor={inputId}
          className="flex flex-col justify-center items-center gap-4 text-center w-full cursor-pointer"
        >
          <img src="/icons/upload-cloud.svg" alt="upload-cloud-icon" />
          <h2 className="font-bold">Upload proof</h2>
          <p className="text-xs text-gray-600">
            Any receipts, screenshots, or assignments that show your milestone
            is done.
          </p>
          <input
            id={inputId}
            type="file"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                onUpload?.(e.target.files[0]);
              }
            }}
          />
        </label>
      )}

      {/* TEXTAREA */}
      {type === "text" && (
        <textarea
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-400"
          placeholder={placeholder}
          rows={3}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
        />
      )}

      {/* INPUT TEXT */}
      {type === "input" && (
        <input
          type="text"
          className={inputClass}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
        />
      )}

      {/* DROPDOWN */}
      {type === "dropdown" && (
        <select
          className={inputClass}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
        >
          <option value="" disabled>
            {placeholder || "Select an option"}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}

      {/* SLIDER with Token + IDR Conversion */}
      {type === "slider-token" && (
        <div className="flex flex-col gap-4 w-full">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            className="w-full accent-skpurple"
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-black text-base font-medium">
              <span>{value}</span>
              <span className="text-sm text-gray-500">Students</span>
            </div>
            {/* <div className="text-sm text-right text-skpurple">
              Not just funding education. You're giving <strong>{value}</strong>{" "}
              students a chance to change their lives.
            </div> */}
          </div>

          {/* <div className="flex items-center gap-4">
            <div className="flex items-center border rounded-xl px-4 py-2 bg-white text-base">
              <input
                type="text"
                value={tokenAmount}
                placeholder="e.g., 45000 MON"
                onChange={(e) => onChange?.(e.target.value)}
                className="w-full focus:outline-none"
              />
              <span className="ml-2 font-semibold">MON</span>
            </div>
            <span className="text-sm">equals to</span>
            <div className="flex items-center border rounded-xl px-4 py-2 bg-gray-100 text-base text-gray-500">
              {idrAmount || "0"} IDR
            </div>
          </div> */}
        </div>
      )}

      {/* RADIO GROUP */}
      {type === "radio-group" && options.length > 0 && (
        <div className="flex flex-col gap-3 w-full">
          {options.map((opt) => (
            <label
              key={opt.value}
              className={`flex items-start gap-2 cursor-pointer ${
                opt.disabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <input
                type="radio"
                value={opt.value}
                checked={value === opt.value}
                onChange={(e) => !opt.disabled && onChange?.(e.target.value)}
                disabled={opt.disabled}
                className="mt-1 accent-skpurple"
              />
              <div className="flex flex-col">
                <span className="font-semibold text-black">{opt.label}</span>
                {opt.description && (
                  <span className="text-sm text-gray-500">
                    {opt.description}
                  </span>
                )}
              </div>
            </label>
          ))}
        </div>
      )}

      {/* NOTE */}
      {note && (
        <div className="flex justify-end items-center gap-2.5 self-stretch">
          <p className="text-sm text-skpurple font-medium text-right">{note}</p>
          <img src="/icons/information-circle.svg" alt="info" />
        </div>
      )}
    </div>
  );
};
