import { InputHTMLAttributes } from "react";

type Props = {} & InputHTMLAttributes<HTMLInputElement>;

const InputC = ({ ...rest }: Props) => {
  return (
    <div className="mb-0">
      <input className="w-full p-2 border rounded-md" {...rest} />
    </div>
  );
};

export default InputC;
