import axios from "axios";
import { baseURL } from "~/lib/constants";
import { getJWT } from "~/lib/storage/tokenStorage";

export const isServerOnline = (domainVerification = false, domain = "") => {
  return new Promise(async (resolve, reject) => {
    try {
      if (domainVerification) {
        //When the user selects the domain mode and provide the serial number we create domain and we will do the domain verification.
        const response = await axios.get(
          `https://${domain}/api/v1/server-status`,
          {
            timeout: 5000,
          }
        );

        if (response.error) {
          return reject(response.error);
        }

        if (
          response.data &&
          response.data.status &&
          response.data.status === "online"
        ) {
          return resolve(true);
        }

        return resolve(false);
      }

      const response = await axios.get(`${baseURL()}/server-status`, {
        timeout: 5000,
      });

      if (response.error) {
        return reject(response.error);
      }

      if (
        response.data &&
        response.data.status &&
        response.data.status === "online"
      ) {
        return resolve(true);
      }

      return resolve(false);
    } catch (error) {
      return reject(error);
    }
  });
};

export const getFileList = (path) => {
  return new Promise(async (resolve, reject) => {
    try {
      //android - 10.0.2.2
      const token = await getJWT();
      const response = await axios.get(`${baseURL()}/files/?path=${path}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        validateStatus: (status) => {
          return status < 500;
        },
      });

      if (response.status === 401) {
        return resolve("auth_needed");
      }

      if (response.error) {
        return reject(response.error);
      }

      if (response.data && response.data.files && response.data.files.length) {
        let sortedData = {
          ...response.data,
          files: response.data.files.sort((a, b) => {
            if (a.is_directory && !b.is_directory) {
              return -1;
            }

            if (!a.is_directory && b.is_directory) {
              return 1;
            }

            return a.name.localeCompare(b.name);
          }),
        };

        return resolve(sortedData);
      }

      return resolve(response.data);
    } catch (error) {
      return reject(error);
    }
  });
};

export const deleteItem = (path) => {
  // We need to send the path for the file with extension or the folder name which will delete the entire folder.
  return new Promise(async (resolve, reject) => {
    try {
      const token = await getJWT();
      const response = await axios.delete(`${baseURL()}/files/?path=${path}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.error) {
        return reject(response.error);
      }

      return resolve(response.data);
    } catch (error) {
      return reject(error);
    }
  });
};

export const downloadFile = (path) => {
  return new Promise(async (resolve, reject) => {
    try {
      const token = await getJWT();
      const response = await axios.post(
        `${baseURL()}/files/download?path=${path}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.error) {
        return reject(response.error);
      }

      return resolve(response.data);
    } catch (error) {
      return reject(error);
    }
  });
};

export const getFileExplorerMetrics = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const token = await getJWT();
      const response = await axios.get(`${baseURL()}/files/metrics`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.error) {
        return reject(response.error);
      }

      return resolve(response.data);
    } catch (error) {
      return reject(error);
    }
  });
};

export const createFolder = (path, folderName) => {
  return new Promise(async (resolve, reject) => {
    try {
      const token = await getJWT();
      const response = await axios.post(
        `${baseURL()}/files/folder`,
        {
          path: path,
          folder_name: folderName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.error) {
        return reject(response.error);
      }

      return resolve(response.data);
    } catch (error) {
      return reject(error);
    }
  });
};

export const compressFolder = (path) => {
  return new Promise(async (resolve, reject) => {
    try {
      const token = await getJWT();
      const response = await axios.post(
        `${baseURL()}/files/compress?path=${path}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.error) {
        return reject(response.error);
      }

      return resolve(response.data);
    } catch (error) {
      return reject(error);
    }
  });
};

export const getCompressStatus = (task_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const token = await getJWT();
      const response = await axios.get(
        `${baseURL()}/files/compress-progress?task_id=${task_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.error) {
        return reject(response.error);
      }

      return resolve(response.data);
    } catch (error) {
      return reject(error);
    }
  });
};

export const getSystemMetrics = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const token = await getJWT();
      const response = await axios.get(`${baseURL()}/system/system-metrics`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.error) {
        return reject(response.error);
      }

      return resolve(response.data);
    } catch (error) {
      return reject(error);
    }
  });
};

export const getFileSystemInfo = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const token = await getJWT();
      const response = await axios.get(`${baseURL()}/system/filesystem`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.error) {
        return reject(response.error);
      }

      return resolve(response.data?.data);
    } catch (error) {
      return reject(error);
    }
  });
};

export const getDisksInfo = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const token = await getJWT();
      const response = await axios.get(`${baseURL()}/system/harddisks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.error) {
        return reject(response.error);
      }

      return resolve(response.data.data);
    } catch (error) {
      return reject(error);
    }
  });
};

export const getSmartInfo = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const token = await getJWT();
      const response = await axios.get(`${baseURL()}/system/smart-info`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.error) {
        return reject(response.error);
      }

      return resolve(response.data.data);
    } catch (error) {
      return reject(error);
    }
  });
};

export const getRecentActivity = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const token = await getJWT();
      const response = await axios.get(`${baseURL()}/files/recent-activity`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.error) {
        return reject(response.error);
      }

      return resolve(response.data);
    } catch (error) {
      return reject(error);
    }
  });
};

export const renameItem = (path, is_directory, name) => {
  return new Promise(async (resolve, reject) => {
    try {
      const token = await getJWT();
      const response = await axios.patch(
        `${baseURL()}/files/rename`,
        {
          path: path,
          is_directory: is_directory,
          new_name: name,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.error) {
        return reject(response.error);
      }

      return resolve(response.data);
    } catch (error) {
      return reject(error);
    }
  });
};

export const searchItem = (query) => {
  return new Promise(async (resolve, reject) => {
    try {
      const token = await getJWT();
      const response = await axios.get(
        `${baseURL()}/files/search`, 
        {
          params: {
            query: query
          }
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.error) {
        return reject(response.error);
      }

      return resolve(response.data);
    } catch (error) {
      return reject(error);
    }
  });
};
