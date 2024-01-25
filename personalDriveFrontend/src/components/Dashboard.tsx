import { ChangeEvent, useEffect, useRef, useState } from "react";
import ShowCaseFiles from "./dashboard/ShowCaseFiles";
import Upload from "./dashboard/Upload";
import axios from "axios";
import { ADDRESS_SERVER } from "../App";

type Props = {
  csrfToken: string;
  login: string;
  setSessionID: React.Dispatch<React.SetStateAction<string>>;
  sessionID: string;
};

const Dashboard = (props: Props) => {
  const [files, setFiles] = useState([]);
  const [showPersonalUpload, setShowPersonalUpload] = useState(false);
  const [showSharedUpload, setShowSharedUpload] = useState(false);
  const personalFocus = useRef<HTMLDivElement>(null);
  const sharedFocus = useRef<HTMLDivElement>(null);
  const [showPersonalFiles, setShowPersonalFiles] = useState(false);
  const [showSharedFiles, setShowSharedFiles] = useState(false);

  //Refresh fetch when file is deleted
  const [showCaseFilesShouldUpdate, setShowCaseFilesShouldUpdate] =
    useState(false);

  const fetchFilesPersonal = async () => {
    setShowSharedUpload(false);
    setShowPersonalUpload(true);

    personalFocus.current?.classList.remove("bg-zinc-200");
    personalFocus.current?.classList.add("bg-blue-200");
    sharedFocus.current?.classList.remove("bg-blue-200");
    sharedFocus.current?.classList.add("bg-zinc-200");
    try {
      const response = await fetch(`${ADDRESS_SERVER}/dash`, {
        method: "GET",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          session: props.sessionID,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setFiles(data.files);
      } else {
        console.log("failed to get files");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [filesCommon, setFilesCommon] = useState([]);
  const fetchFilesCommon = async () => {
    setShowSharedUpload(true);
    setShowPersonalUpload(false);
    personalFocus.current?.classList.add("bg-zinc-200");
    personalFocus.current?.classList.remove("bg-blue-200");
    sharedFocus.current?.classList.add("bg-blue-200");
    sharedFocus.current?.classList.remove("bg-zinc-200");

    try {
      const response = await fetch(`${ADDRESS_SERVER}/dashcommon`, {
        method: "GET",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          session: props.sessionID,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setFilesCommon(data.files);
      } else {
        console.log("failed to get files");
      }
    } catch (error) {
      console.error(error);
    }
  };

  //Display drive files
  const handleShowSharedFiles = () => {
    fetchFilesCommon();

    setShowPersonalFiles(false);
    setShowSharedFiles(true);
  };

  const handleShowPersonalFiles = () => {
    fetchFilesPersonal();
    setShowPersonalFiles(true);
    setShowSharedFiles(false);
  };

  //UPLOAD

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [whereToUpload, setWhereToUpload] = useState("");
  const [progress, setProgress] = useState<number>(0);

  const onFileChangePrivate = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setWhereToUpload("uploads");
      setSelectedFile(file);
    }
  };

  const onFileChangeCommon = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setWhereToUpload("uploadscommon");
      setSelectedFile(file);
    }
  };

  const onUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("csrfToken", props.csrfToken);

      try {
        const response = await axios.post(
          `${ADDRESS_SERVER}/${whereToUpload}`,
          formData,
          {
            onUploadProgress: (progressEvent) => {
              const percentage = Math.round(
                //@ts-ignore
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setProgress(percentage);
            },
            withCredentials: true,
            headers: {
              "X-CSRF-Token": props.csrfToken,
              session: props.sessionID,
            },
          }
        );
        if (response) {
          setShowCaseFilesShouldUpdate(true);
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  useEffect(() => {
    if (showCaseFilesShouldUpdate) {
      if (showPersonalFiles) {
        fetchFilesPersonal();

        setShowCaseFilesShouldUpdate(false);
      }
      if (showSharedFiles) {
        fetchFilesCommon();
        setShowCaseFilesShouldUpdate(false);
      }
    }
  }, [showCaseFilesShouldUpdate]);

  useEffect(() => {
    if (progress == 100) {
      if (showPersonalFiles) {
        fetchFilesPersonal();

        setShowCaseFilesShouldUpdate(false);
      }
      if (showSharedFiles) {
        fetchFilesCommon();
        setShowCaseFilesShouldUpdate(false);
      }
    }
  }, [progress]);

  return (
    <>
      <div className="flex flex-1 flex-col mx-5 mt-5 mb-5 ">
        <div className="flex  flex-row mb-4   ">
          <div className="flex  flex-row border-2 border-slate-400   ">
            <div
              ref={personalFocus}
              className=" border-slate-300  bg-zinc-200 hover:bg-blue-200 active:bg-blue-400 "
            >
              <button
                onClick={handleShowPersonalFiles}
                className="text-base fw-full h-full p-3"
              >
                Personal Files
              </button>
            </div>
            {props.login !== "loginGuest" ? (
              <div
                ref={sharedFocus}
                className="border-l-2 border-slate-400 flex items-center  bg-zinc-200 hover:bg-blue-200  active:bg-blue-400 "
              >
                <button
                  onClick={handleShowSharedFiles}
                  className="text-base w-full h-full p-3"
                >
                  Shared Files
                </button>
              </div>
            ) : null}
          </div>
        </div>
        {showPersonalUpload && props.login !== "loginGuest" ? (
          <Upload
            title="Upload para Utilizador"
            onUpload={onUpload}
            onFileChange={onFileChangePrivate}
            progress={progress}
            isFileSelected={selectedFile ? true : false}
          />
        ) : null}
        {showSharedUpload && (
          <Upload
            title="Upload para Partilhados"
            onUpload={onUpload}
            onFileChange={onFileChangeCommon}
            progress={progress}
            isFileSelected={selectedFile ? true : false}
          />
        )}
        <div className="mt-4">
          {showPersonalFiles && (
            <ShowCaseFiles
              setShowCaseFilesShouldUpdate={setShowCaseFilesShouldUpdate}
              csrfToken={props.csrfToken}
              files={files}
              isPrivate={true}
              sessionID={props.sessionID}
            />
          )}

          {showSharedFiles && (
            <ShowCaseFiles
              setShowCaseFilesShouldUpdate={setShowCaseFilesShouldUpdate}
              csrfToken={props.csrfToken}
              files={filesCommon}
              isPrivate={false}
              sessionID={props.sessionID}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
