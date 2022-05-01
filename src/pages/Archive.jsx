import React, { useEffect, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { FiFilePlus, FiFolderPlus } from "react-icons/fi";
import { MdChevronRight } from "react-icons/md";
import api from "../api/api";
import AppFile from "../components/AppFile";
import AppFolder from "../components/AppFolder";
import Loading from "../components/Loading";
import FileAdd from "../components/Modals/FileAdd";
import FileEdit from "../components/Modals/FileEdit";
import FolderAdd from "../components/Modals/FolderAdd";
import FolderEdit from "../components/Modals/FolderEdit";

const Archive = () => {
  const [archive, setArchive] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFileAddOpen, setIsFileAddOpen] = useState(false);
  const [isFileEditOpen, setIsFileEditOpen] = useState(false);
  const [isFolderAddOpen, setIsFolderAddOpen] = useState(false);
  const [isFolderEditOpen, setIsFolderEditOpen] = useState(false);
  const [parent, setParent] = useState(1);
  const [selectedFile, setSelectedFile] = useState(0);
  const [selectedFolder, setSelectedFolder] = useState(0);
  const [isDnDOpen, setIsDnDOpen] = useState(false);

  const getDocuments = async (par = 1) => {
    setIsLoading(true);
    try {
      const res = await api.get(`/documents/${par}`);
      setArchive(res.data.documents);
      setParent(res.data.parent);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const getParentDocuments = async (par = 1) => {
    setIsLoading(true);
    try {
      const res = await api.get(`/documents/go-back/${par}`);
      setArchive(res.data.documents);
      setParent(res.data.parent);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    if (parent !== 1) {
      getParentDocuments(parent);
    }
  };

  const handleFilesUpload = (files) => {
    console.log("====================================");
    console.log(files);
    console.log("====================================");
    setIsDnDOpen(false);
  };

  useEffect(() => {
    getDocuments();
  }, []);

  return (
    <div
      onDragOver={() => setIsDnDOpen(true)}
      onDragLeave={() => setIsDnDOpen(false)}
      className="w-full min-h-screen overflow-y-auto pb-20"
    >
      <div className="flex items-center px-3 lg:px-20 py-3 bg-white border-2 w-full border-lightGray">
        <MdChevronRight
          onClick={() => handleGoBack()}
          className={`transition ${
            parent === 1 ? "text-lightGray" : "text-dark hover:text-dark/90"
          } text-3xl mx-2 cursor-pointer`}
        />
        <FiFilePlus
          onClick={() => setIsFileAddOpen(true)}
          className="text-dark text-3xl mx-4 cursor-pointer transition hover:scale-105"
        />{" "}
        <FiFolderPlus
          onClick={() => setIsFolderAddOpen(true)}
          className="text-dark text-3xl mx-4 cursor-pointer transition hover:scale-105"
        />
      </div>
      {isDnDOpen && (
        <div className="flex justify-center items-center pt-5">
          <FileUploader
            multiple={true}
            handleChange={handleFilesUpload}
            name="file"
            label={" زتلي ياهن "}
          />
        </div>
      )}
      <div className="flex flex-wrap gap-7 lg:gap-10 px-3 lg:px-20 py-10">
        {isLoading ? (
          <Loading />
        ) : !archive.length ? (
          <span className="w-full text-center text-dark">المجلد فارغ</span>
        ) : (
          archive.map((ar) =>
            ar.is_directory ? (
              <AppFolder
                key={ar.id}
                id={ar.id}
                name={ar.name}
                setFSEs={setArchive}
                setIsEditOpen={setIsFolderEditOpen}
                setSelectedFolder={setSelectedFolder}
                getDocuments={getDocuments}
              />
            ) : (
              <AppFile
                key={ar.id}
                id={ar.id}
                name={ar.name}
                setFSEs={setArchive}
                setSelectedFile={setSelectedFile}
                setIsEditOpen={setIsFileEditOpen}
              />
            )
          )
        )}
      </div>
      <FileAdd
        isOpen={isFileAddOpen}
        setIsOpen={setIsFileAddOpen}
        setFSEs={setArchive}
        parent={parent}
      />
      <FileEdit
        isOpen={isFileEditOpen}
        setIsOpen={setIsFileEditOpen}
        setFSEs={setArchive}
        parent={parent}
        selectedFile={selectedFile}
      />
      <FolderAdd
        isOpen={isFolderAddOpen}
        setIsOpen={setIsFolderAddOpen}
        setFSEs={setArchive}
        parent={parent}
      />
      <FolderEdit
        isOpen={isFolderEditOpen}
        setIsOpen={setIsFolderEditOpen}
        selectedFolder={selectedFolder}
        setFSEs={setArchive}
      />
    </div>
  );
};

export default Archive;
