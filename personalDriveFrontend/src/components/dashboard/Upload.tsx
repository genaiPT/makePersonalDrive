import { ChangeEvent } from "react";
import InputC from "../../atoms/InputC";
import { Button } from "../../atoms/Button";

type Props = {
  title: string;
  onUpload: () => void;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  progress: number;
  isFileSelected: boolean;
};

const Upload = ({
  title,
  onUpload,
  onFileChange,
  progress,
  isFileSelected,
}: Props) => {
  return (
    <>
      <div>
        <h2 className="text-lg font-bold">{title}</h2>
        <div className="flex flex-row ml-3 gap-3 items-center">
          <InputC type="file" onChange={onFileChange} />
          {isFileSelected && (
            <Button isSubmitType={false} onClick={onUpload} text={"Upload"} />
          )}
          {progress > 0 && (
            <p className="">
              Upload progress: {" "}
              {progress <= 99 ? progress + "%" : "Completo"}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default Upload;
