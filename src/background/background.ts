import {getStorageCities, getStorageOptions, setStoredCities, setStoredOptions } from "../utils/storage"
import {fetchOpenWeatherData, OpenWeatherData} from "../utils/api";
import { ChromeReaderModeSharp } from "@material-ui/icons";

chrome.runtime.onInstalled.addListener(() => {
  setStoredCities([]);
  setStoredOptions({
    hasAutoOverlay: false,
    homeCity: "",
    tempScale: "metric"
  });

  chrome.contextMenus.create({
    contexts: ["selection"],
    title: "Add city to weather extension",
    id: "weatherExtension"
  });

  chrome.alarms.create({
    periodInMinutes: 1 / 6
  });
});



chrome.contextMenus.onClicked.addListener((e) => {
  getStorageCities().then((cities)=> {
    setStoredCities([...cities, e.selectionText]);
  });
});




chrome.alarms.onAlarm.addListener(() => {

  getStorageOptions().then((options) => {
    if(options.homeCity === "") return;

    fetchOpenWeatherData(options.homeCity, options.tempScale).then((data: OpenWeatherData) => {
      const temp = Math.round(data.main.temp);
      const symbol = options.tempScale === "metric" ? "\u2103" : "\u2109";
      chrome.action.setBadgeText({
        text: `${temp}${symbol}`
      });
    });
  });
});



