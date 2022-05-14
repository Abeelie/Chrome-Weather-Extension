import React, {useEffect, useState} from "react";
import ReactDom from "react-dom";
import {Card} from "@material-ui/core";
import WeatherCard from "../Components/WeatherCard";
import { getStorageOptions, LocalStorageOptions } from "../utils/storage";
import { Messages } from "../utils/messages";
import "./contentScript.css";


const App: React.FC<{}> = () => {
    const [options, setOptions] = useState<LocalStorageOptions | null>(null);
    const [isActive, setIsActive] = useState<boolean>(false);

    useEffect(() => {
        getStorageOptions().then(options => {
            setOptions(options);
            setIsActive(options.hasAutoOverlay);
        });
    }, []);

    useEffect(() => {
        chrome.runtime.onMessage.addListener((msg) => {
            if(msg === Messages.TOGGLE_OVERLAY){
                setIsActive(!isActive);
            }
        });
    }, [isActive]);

    if(!options) return null;
    
    return(
        <React.Fragment>
        {
            isActive && (
                <Card className="overlayCard">
                    <WeatherCard
                        city={options.homeCity}
                        tempScale={options.tempScale} 
                        onDelete={() => setIsActive(false)}
                    />
                </Card>
            )
        }
        </React.Fragment>
    )
}


const root = document.createElement("div");
document.body.appendChild(root);
ReactDom.render(<App />, root);
