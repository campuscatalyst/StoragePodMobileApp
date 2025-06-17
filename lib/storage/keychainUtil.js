import * as Keychain from 'react-native-keychain';

const KEYCHAIN_SERVICE = 'mmkv_encryption_key';

const generateRandomKey = (length = 32) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return result;
};

export const getOrCreateEncryptionKey = async () => {
    const credentials = Keychain.getGenericPassword({ service: KEYCHAIN_SERVICE});

    if(credentials) {
        return credentials.password;
    }

    const newKey = generateRandomKey(32);

    await Keychain.setGenericPassword("mmkv", newKey, { service: KEYCHAIN_SERVICE });
}