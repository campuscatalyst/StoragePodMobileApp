import axios from "axios";
import { baseURl } from "~/lib/constants";

export const getFileList = (path) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(`${baseURl}/files?path=${path}`);

      //android - 10.0.2.2

      if (response.error) {
        return reject(response.error);
      }

      if(response.data && response.data.files && response.data.files.length) {
        let sortedData = {
          ...response.data,
          files: response.data.files.sort((a, b) => {
            if(a.is_directory && !b.is_directory) {
              return -1;
            } 
            
            if(!a.is_directory && b.is_directory) {
              return 1;
            } 

            return a.name.localeCompare(b.name);
          })
        };

        return resolve(sortedData);
      }

      return resolve(response.data);
    } catch (error) {
      return reject(error);
    }
  });
};
