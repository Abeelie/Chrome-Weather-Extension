import React, {useEffect, useState} from 'react';
import { fetchOpenWeatherData, getWeatherIconSrc, OpenWeatherData, OpenWeatherTempScale } from '../../utils/api';
import './WeatherCard.css';
import {Box, Card, CardContent, CardActions, Typography, Button, Grid} from "@material-ui/core";



const WeatherCardContainer: React.FC<{
    children: React.ReactNode
    onDelete?: () => void
}> = ({children, onDelete}) => {
    return (
        <Box mx={"4px"} my={"16px"}>
            <Card>
                <CardContent>
                    {children}
                    <CardActions>
                        {onDelete && (
                            <Button 
                                color="secondary" 
                                onClick={onDelete}>
                                    <Typography className='weatherCard-body'> Delete</Typography>
                            </Button>
                        )}
                    </CardActions>
                </CardContent>
            </Card>
        </Box>
    )
}

type WeatherCardState = "loading" | "error" | "ready";

const WeatherCard: React.FC<{
    city: string, 
    tempScale: OpenWeatherTempScale
    onDelete?: () => void
}> = ({city, tempScale, onDelete}) => {
    const [weatherData, setWeatherData] = useState<OpenWeatherData | null>(null);
    const [cardState, setCardState] = useState<WeatherCardState>("loading");

    useEffect(() => {
        fetchOpenWeatherData(city, tempScale)
            .then(data => {
              setWeatherData(data);
              setCardState("ready");
            })
            .catch(err => {
                setCardState("error");
            });
    },[city, tempScale]);

    if(cardState === "loading" || cardState === "error"){
        return (
            <WeatherCardContainer onDelete={onDelete}>
                <Typography className='weatherCard-title'>{city}</Typography>
                <Typography className='weatherCard-body'>
                    {
                        cardState === "loading" ?
                        "loading..." :
                        "Error can not retrieve weather data for that city"
                    }
                </Typography>
            </WeatherCardContainer>
        )
    }

    

    return (
        <WeatherCardContainer onDelete={onDelete}>
            <Grid container justifyContent='space-around'>
                <Grid item>
                    <Typography className='weatherCard-title'>
                        {weatherData.name}
                    </Typography>
                    <Typography className='weatherCard-temp'>
                        {Math.round(weatherData.main.temp)}
                    </Typography>
                    <Typography className='weatherCard-body'>
                        Feels like: {Math.round(weatherData.main.feels_like)}
                    </Typography>
                </Grid>
                <Grid item>
                {
                    weatherData.weather.length > 0 && (
                        <React.Fragment>
                            <img src={getWeatherIconSrc(weatherData.weather[0].icon)}/>
                            <Typography className='weatherCard-body'>{weatherData.weather[0].main}</Typography>
                        </React.Fragment>
                    )
                }
                </Grid>
            </Grid>
        </WeatherCardContainer>
    )
}

export default WeatherCard;