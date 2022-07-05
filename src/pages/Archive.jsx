import React, { useContext, useEffect, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { FiFilePlus, FiFolderPlus, FiHome } from "react-icons/fi";
import {
  MdChevronRight,
  MdHome,
  MdOutlineHome,
  MdSearch,
} from "react-icons/md";
import api from "../api/api";
import AppFile from "../components/AppFile";
import AppFolder from "../components/AppFolder";
import Loading from "../components/Loading";
import FileAdd from "../components/Modals/FileAdd";
import FileEdit from "../components/Modals/FileEdit";
import FileVersions from "../components/Modals/FileVersions";
import FolderAdd from "../components/Modals/FolderAdd";
import FolderEdit from "../components/Modals/FolderEdit";
import FSEPermissions from "../components/Modals/FSEPermissions";
import UserContext from "../contexts/userContext";
import SearchInput from "../components/SearchInput";
import AppButton from "../components/AppButton";

const Archive = () => {
  const [archive, setArchive] = useState([]);
  const [filteredArchive, setFilteredArchive] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFileAddOpen, setIsFileAddOpen] = useState(false);
  const [isFileEditOpen, setIsFileEditOpen] = useState(false);
  const [isFolderAddOpen, setIsFolderAddOpen] = useState(false);
  const [isFolderEditOpen, setIsFolderEditOpen] = useState(false);
  const [parent, setParent] = useState(1);
  const [selectedFile, setSelectedFile] = useState(0);
  const [selectedFolder, setSelectedFolder] = useState(0);
  const [isDnDOpen, setIsDnDOpen] = useState(false);
  const [isVersionsOpen, setIsVersionsOpen] = useState(false);
  const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);
  const [selectedFSEPermissions, setSelectedFSEPermissions] = useState({});
  const userContext = useContext(UserContext);

  const getDocuments = async (par = 1) => {
    setIsLoading(true);
    try {
      const res = await api.get(`/documents/${par}`);
      setArchive(res.data.documents);
      setFilteredArchive(res.data.documents);
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
    setIsDnDOpen(false);
  };

  const filterArchive = () => {
    if (search === "") {
      setFilteredArchive(archive);
    } else {
      setFilteredArchive(() =>
        archive.filter(
          (a) =>
            a.name.toLowerCase().includes(search) ||
            a?.description?.toLowerCase().includes(search) ||
            a.tags.filter((t) => t.name.toLowerCase().includes(search)).length
        )
      );
    }
  };

  const onSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      filterArchive();
    }
  };

  useEffect(() => {
    filterArchive();
  }, [search]);

  useEffect(() => {
    setFilteredArchive(archive);
  }, [archive]);

  useEffect(() => {
    getDocuments();
  }, []);

  return (
    <div
      onDragOver={() => setIsDnDOpen(true)}
      onDragLeave={() => setIsDnDOpen(false)}
      className="w-full min-h-screen overflow-y-auto pb-20"
    >
      <div className="flex justify-between items-center px-3 lg:px-20 py-3 bg-white border-2 w-full border-lightGray">
        <div className="flex items-center">
          <MdChevronRight
            onClick={() => handleGoBack()}
            className={`transition ${
              parent === 1 ? "text-lightGray" : "text-dark hover:text-dark/90"
            } text-3xl mx-1 md:mx-2 cursor-pointer`}
          />
          <FiHome
            onClick={() => getDocuments(1)}
            className="text-dark text-3xl mx-2 md:mx-4 cursor-pointer transition hover:scale-105"
          />
          <FiFilePlus
            onClick={() => setIsFileAddOpen(true)}
            className="text-dark text-3xl mx-2 md:mx-4 cursor-pointer transition hover:scale-105"
          />{" "}
          <FiFolderPlus
            onClick={() => setIsFolderAddOpen(true)}
            className="text-dark text-3xl mx-2 md:mx-4 cursor-pointer transition hover:scale-105"
          />
        </div>
        <div className="flex w-64 md:w-72 px-1">
          <SearchInput
            onKeyPress={onSearchKeyPress}
            onChange={setSearch}
            placeholder={"بحث"}
            Icon={MdSearch}
          />
        </div>
      </div>
      {/* {isDnDOpen && (
        <div className="flex justify-center items-center pt-5">
          <FileUploader
            multiple={true}
            handleChange={handleFilesUpload}
            name="file"
            label={" زتلي ياهن "}
          />
        </div>
      )} */}
      <div className="flex flex-wrap gap-7 lg:gap-10 px-3 lg:px-20 pt-10 pb-28 md:pb-10">
        {isLoading ? (
          <Loading />
        ) : !filteredArchive.length ? (
          <span className="w-full text-center text-dark">المجلد فارغ</span>
        ) : (
          filteredArchive.map((ar) =>
            ar.is_directory ? (
              <AppFolder
                key={ar.id}
                id={ar.id}
                name={ar.name}
                setFSEs={setArchive}
                setIsEditOpen={setIsFolderEditOpen}
                setSelectedFolder={setSelectedFolder}
                getDocuments={getDocuments}
                setIsPermissionsOpen={setIsPermissionsOpen}
                setSelectedFile={setSelectedFile}
                permissions={
                  !userContext?.user?.is_admin ? ar?.permissions[0] : {}
                }
              />
            ) : (
              <AppFile
                key={ar.id}
                id={ar.id}
                name={ar.name}
                setFSEs={setArchive}
                setSelectedFile={setSelectedFile}
                setIsEditOpen={setIsFileEditOpen}
                setIsVersionsOpen={setIsVersionsOpen}
                setIsPermissionsOpen={setIsPermissionsOpen}
                media={ar?.media}
                permissions={
                  !userContext?.user?.is_admin ? ar?.permissions[0] : {}
                }
                setSelectedFilePermissions={setSelectedFSEPermissions}
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
      <FileVersions
        isOpen={isVersionsOpen}
        setIsOpen={setIsVersionsOpen}
        selectedFile={selectedFile}
        permissions={selectedFSEPermissions}
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
      <FSEPermissions
        isOpen={isPermissionsOpen}
        setIsOpen={setIsPermissionsOpen}
        selectedFile={selectedFile}
      />
    </div>
  );
};

export default Archive;
