import { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { Button } from "../ui/button";

type FileUploaderPropsType = {
  fieldChange: (files: File[]) => void;
  mediaUrl: string;
};

function FileUploader({ fieldChange, mediaUrl }: FileUploaderPropsType) {
  const [file, setFile] = useState<File[]>([]);
  const [isFileUrl, setIsFileUrl] = useState<string>(mediaUrl);

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      setIsFileUrl(URL.createObjectURL(acceptedFiles[0]));
      setFile(acceptedFiles);
      fieldChange(acceptedFiles);
    },
    [fieldChange],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".svg", ".jpeg"],
    },
  });

  return (
    <div
      {...getRootProps()}
      className="flex-center flex cursor-pointer flex-col rounded-xl bg-dark-3"
    >
      <input {...getInputProps()} className="cursor-pointer" />
      {isFileUrl ? (
        <>
          <div className="flex w-full flex-1 justify-center p-5 lg:p-10">
            <img
              src={isFileUrl}
              alt="image"
              className="file-uploader-img"
            />
          </div>
          <p className="file_uploader-label">Click or drag photo to replace</p>
        </>
      ) : (
        <div className="file_uploader-box">
          <img
            src="/assets/icons/file-upload.svg"
            alt="file-uploader"
            width={96}
            height={77}
          />
          <h3 className="base-medium mb-2 mt-6 text-light-2">
            Drag photo here
          </h3>
          <p className="small-regular mb-6 text-light-4">SVG, PNG, JPG</p>
          <Button className="shad-button_dark_4">Select from computer</Button>
        </div>
      )}
    </div>
  );
}
export default FileUploader;
