import { getMMKVInstance } from './mmkvInstance';

const JWT_KEY = 'jwt_token';
const STORAGE_FOLDER_KEY = "storagepod_downloads_folder_uri";
const THEME_KEY = "theme";

export const saveJWT = async (token) => {
  const storage = await getMMKVInstance();
  storage.set(JWT_KEY, token);
};

export const getJWT = async () => {
  const storage = await getMMKVInstance();
  return storage.getString(JWT_KEY);
};

export const removeJWT = async () => {
  const storage = await getMMKVInstance();
  storage.delete(JWT_KEY);
};

export const saveStorageFolderUri = async (uri) => {
  const storage = await getMMKVInstance();
  storage.set(STORAGE_FOLDER_KEY, uri);
}

export const getStorageFolderUri = async (uri) => {
  const storage = await getMMKVInstance();
  return storage.getString(STORAGE_FOLDER_KEY);
}

export const removeStorageFolderUri = async () => {
  const storage = await getMMKVInstance();
  storage.delete(STORAGE_FOLDER_KEY);
};

export const getTheme = async () => {
  const storage = await getMMKVInstance();
  return storage.getString(THEME_KEY);
};

export const setTheme = async (theme) => {
  const storage = await getMMKVInstance();
  storage.set(THEME_KEY, theme);
};
