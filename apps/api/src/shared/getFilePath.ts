type IFolderName = "image" | "media" | "doc";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getSingleFilePath = (
  files: Record<string, Express.Multer.File[]>,
  folderName: IFolderName
): string | undefined => {
  const fileField = files?.[folderName];
  if (fileField && Array.isArray(fileField) && fileField.length > 0) {
    return `/${folderName}/${fileField[0].filename}`;
  }

  return undefined;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getMultipleFilesPath = (
  files: Record<string, Express.Multer.File[]>,
  folderName: IFolderName
): string[] | undefined => {
  const folderFiles = files?.[folderName];
  if (folderFiles && Array.isArray(folderFiles)) {
    return folderFiles.map((file: Express.Multer.File) => `/${folderName}/${file.filename}`);
  }

  return undefined;
};
