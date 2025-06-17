import { MMKV } from 'react-native-mmkv';
import { getOrCreateEncryptionKey } from './keychainUtil';

let mmkvInstance = null;

export const getMMKVInstance = async () => {
  if (!mmkvInstance) {
    const encryptionKey = await getOrCreateEncryptionKey();
    mmkvInstance = new MMKV({
      id: 'secure',
      encryptionKey,
    });
  }
  return mmkvInstance;
};