import { ButtonHTMLAttributes } from "react";

type Props = {
  onClickHandle?: () => void;
  text: string;
  isSubmitType: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ onClickHandle, text, isSubmitType, ...rest }: Props) {
  return (
    <button
      type={isSubmitType ? "submit" : "button"}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
      onClick={onClickHandle}
      {...rest}
    >
      {text}
    </button>
  );
}

type PropsWarning = {
  text: string;
  ref?: React.RefObject<HTMLButtonElement> | undefined;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function ButtonWarning({ ref, text, ...rest }: PropsWarning) {
  return (
    <button
      ref={ref}
      className="bg-red-400 hover:bg-red-600 text-white font-bold py-1 px-4 rounded-md"
      {...rest}
    >
      {text}
    </button>
  );
}
