import {OpenWeatherTempScale} from "./api";

export interface LocalStorage {
    cities?: string[],
    options?: LocalStorageOptions
}

export interface LocalStorageOptions {
    hasAutoOverlay: boolean
    homeCity: string
    tempScale: OpenWeatherTempScale
}

export type LocalStorageKeys = keyof LocalStorage;

export function setStoredCities(cities: string[]): Promise<void>{
    const vals: LocalStorage = {
        cities
    }
    return new Promise((resolve) => {
        chrome.storage.local.set(vals, () => {
            resolve()
        });
    });
}



export function getStorageCities(): Promise<string[]> {
    const keys: LocalStorageKeys[] = ["cities"];
    return new Promise((resolve) => {
        chrome.storage.local.get(keys, (res: LocalStorage) => {
            resolve(res.cities ?? []);
        });
    });
}




export function setStoredOptions(options: LocalStorageOptions): Promise<void>{
    const vals: LocalStorage = {
        options
    }
    return new Promise((resolve) => {
        chrome.storage.local.set(vals, () => {
            resolve();
        });
    });
}



export function getStorageOptions(): Promise<LocalStorageOptions> {
    const keys: LocalStorageKeys[] = ["options"];
    return new Promise((resolve) => {
        chrome.storage.local.get(keys, (res: LocalStorage) => {
            resolve(res.options);
        });
    });
}

