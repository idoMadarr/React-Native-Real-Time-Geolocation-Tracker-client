import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveToStorage = async (name: string, payload: unknown) => {
  const data = JSON.stringify(payload);
  await AsyncStorage.setItem(name, data);
};

export const getFromStorage = async (name: string) => {
  const data: string | null = await AsyncStorage.getItem(name);
  if (data) return JSON.parse(data);
};

export const removeFromStorage = async (key: string) => {
  await AsyncStorage.removeItem(key);
};
