import { MouseEvent } from "react";
import axios from "axios";
import { ButtonWarning } from "../../atoms/Button";
import { ADDRESS_SERVER } from "../../App";

type Props = {
  files: any;
  isPrivate: boolean;
  csrfToken: string;
  sessionID: string;
  setShowCaseFilesShouldUpdate: React.Dispatch<React.SetStateAction<boolean>>;
};

const ShowCaseFiles = ({
  files,
  isPrivate,
  csrfToken,
  setShowCaseFilesShouldUpdate,
  sessionID,
}: Props) => {
  const downloadFile = async (file: string) => {
    const COMMON = `${ADDRESS_SERVER}/dashcommon/${file}`;
    const PRIVATE = `${ADDRESS_SERVER}/dash/${file}`;
    const serverPath = isPrivate ? PRIVATE : COMMON;

    try {
      const response = await fetch(serverPath, {
        method: "GET",
        mode: "cors",
        credentials: "include",

        headers: {
          "Content-Type": "application/json",
          session: sessionID,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteFile = async (
    file: any,
    event: MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();
    const COMMON = `${ADDRESS_SERVER}/dashcommon/${file}`;
    const PRIVATE = `${ADDRESS_SERVER}/dash/${file}`;
    const serverPath = isPrivate ? PRIVATE : COMMON;

    try {
      await axios.delete(serverPath, {
        withCredentials: true,
        headers: {
          "X-CSRF-Token": csrfToken,
          session: sessionID,
        },
      });
      setShowCaseFilesShouldUpdate(true);
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  return (
    <div>
      <ul className="space-y-1">
        {files.map((file: any) => (
          <li
            className=" hover:bg-blue-100 cursor-pointer py-1 px-2 rounded transition flex flex-row items-center"
            onClick={() => downloadFile(file)}
            key={file}
          >
            <span className="mr-2 ">
              {/*  <button  onClick={( event) => deleteFile(file, event)}>X</button> */}
              <ButtonWarning
                text="X"
                onClick={(event) => deleteFile(file, event)}
              />
            </span>
            <p>{file} </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShowCaseFiles;
