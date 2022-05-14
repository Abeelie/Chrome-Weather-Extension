import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import {Box, Button, Card, CardContent, Typography, TextField, Grid, Switch} from "@material-ui/core";
import "fontsource-roboto";
import './options.css';
import {getStorageOptions, LocalStorageOptions, setStoredOptions} from "../utils/storage";

type FormState = "ready" | "saving";

const App: React.FC<{}> = () => {
  const [options, setOptions] = useState<LocalStorageOptions | null>(null);
  const [formState, setFormState] = useState<FormState>("ready");

  useEffect(() => {
    getStorageOptions().then(options => setOptions(options));
  }, []);

  const handleHomeCityChange = (homeCity: string) => {
    setOptions({
      ...options,
      homeCity
    });
  }

  const handleAutoOverlayChange = (hasAutoOverlay: boolean) => {
    setOptions({
      ...options,
      hasAutoOverlay
    });
  }

  const handleSaveButtonClick = () => {
    setFormState("saving");
    setStoredOptions(options).then(() => {
      setTimeout(() => {
        setFormState("ready");
      }, 1000);
    });
  }

  if(!options) return null;


  const isFieldsDisabled = formState === "saving";

  return (
    <Box mx="10%" my="2%">
      <Card>
        <CardContent>
          <Grid container direction='column' spacing={4}>
            <Grid item>
              <Typography variant='h4'>Weather Extension Options</Typography>
            </Grid>
            <Grid item>
              <Typography variant='body1'>Home city name</Typography>
              <TextField 
                onChange={e => handleHomeCityChange(e.target.value)} 
                value={options.homeCity} 
                fullWidth 
                placeholder='Enter a home city' 
                disabled={isFieldsDisabled}
              />
            </Grid>
            <Grid item>
              <Typography variant='body1'>Auto Overlay</Typography>
              <Switch 
                color='primary'
                checked={options.hasAutoOverlay}
                onChange={(e, checked) => handleAutoOverlayChange(checked)}
                disabled={isFieldsDisabled}
              />
            </Grid>
            <Grid item>
              <Button 
                onClick={handleSaveButtonClick} 
                variant='contained' 
                color='primary'
                disabled={isFieldsDisabled}
                >
                  {formState === "ready" ? "Save" : "Saving..."}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  )
}

const root = document.createElement('div')
document.body.appendChild(root)
ReactDOM.render(<App />, root)
