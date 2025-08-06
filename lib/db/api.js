import { getDB } from ".";

export const getDevices = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const db = getDB();
      if (!db) reject("No db connection");
      const allDevices = await db.getAllAsync("SELECT * FROM devices");
      return resolve(allDevices);
    } catch (error) {
      resolve(error);
    }
  });
};

export const getDevicebyId = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const db = getDB();
      if (!db) reject("No db connection");
      const device = await db.getFirstAsync("SELECT * FROM devices where id=?", [id]);
      return resolve(device);
    } catch (error) {
      resolve(error);
    }
  });
}

export const getDevice = (ip) => {
  return new Promise(async (resolve, reject) => {
    try {
      const db = getDB();
      if (!db) reject("No db connection");
      const device = await db.getFirstAsync("SELECT * FROM devices where ip=?", [ip]);
      return resolve(device);
    } catch (error) {
      resolve(error);
    }
  });
}

export const deleteDevice = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const db = getDB();
      if (!db) reject("No db connection");
      const result = await db.runAsync("DELETE FROM devices WHERE id = ?", [id]);
      return resolve(result);
    } catch (error) {
      resolve(error);
    }
  });
}

export const addDevice = (data) => {
  /*
        {
            "ip": "192.168.0.200",
            "port": "8200",
            "givenName": "sample",
            "domainName": "storagepod.local",
            "status": "online",
            "discoveredAt": "2020-04-07T09:00:00",
            "lastAccessedAt": "2020-04-07T09:00:00"
        }
    */

  return new Promise(async (resolve, reject) => {
    try {
      const db = getDB();
      if (!db) reject("No db connection");

      const result = await db.runAsync("INSERT INTO devices (ip, port, domainName, givenName, status, discoveredAt, lastAccessedAt) VALUES (?, ?, ?, ?, ?, ?, ?)", [
        data.ip,
        data.port,
        data.domainName,
        data.givenName,
        data.status,
        data.discoveredAt,
        data.lastAccessedAt,
      ]);

      return resolve(result);
    } catch (error) {
      reject(error);
    }
  });
};

export const renameDevice = (name, id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const db = getDB();
      if (!db) reject("No db connection");
      const result = await db.runAsync("UPDATE devices SET givenname = ? WHERE id = ?", [name, id]);
      return resolve(result);
    } catch (error) {
      resolve(error);
    }
  });
}
