import React from 'react';
import './App.css';
import { Container } from '@mui/system';
import { ThemeProvider, createTheme, Typography, Divider, CircularProgress } from '@mui/material';
import { EACTransaction, IndividualTransaction } from './calculator';
import { Results } from './Results';
import { ECBConverter } from './ecbRates';
import { CalculationSettings, InputPanel } from './InputPanel/InputPanel';

const theme = createTheme();

// Arbitary delay to make the calculations feel more significant
const CALCULATION_DELAY = 2500;

function App() {
  const [individualHistory, setIndividualHistory] = React.useState<IndividualTransaction[]>();
  const [eacHistory, setEACHistory] = React.useState<EACTransaction[]>();
  const [ecbConverter, setECBConverter] = React.useState<ECBConverter>();
  const [calculating, setCalculating] = React.useState(false);

  React.useEffect(() => {
    ECBConverter.loadECBData().then(converter => {
      setECBConverter(converter);
    });
  }, []);

  const onCalculate = (settings: CalculationSettings) => {
    setCalculating(true);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setIndividualHistory(settings.individualHistory);
        setEACHistory(settings.eacHistory);

        setCalculating(false);
        resolve();
      }, CALCULATION_DELAY)
    }) 
  }

  return (
    <ThemeProvider theme={theme}>
      <div className="App" style={{background: '#AED6F1'}}>
        <Container maxWidth="lg" sx={{bgcolor: 'background.default', minHeight: '100vh'}}>
          <Typography textAlign={'center'} variant={'h2'} gutterBottom>RSU Tax Calculator
            <Typography component='span' sx={{color: 'text.secondary'}}>v{process.env.REACT_APP_VERSION}</Typography>
          </Typography>
          <Typography gutterBottom>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin non scelerisque diam, ac euismod elit.
            Suspendisse aliquet mi sed tristique dapibus. Nullam facilisis sem nisi, et pretium est malesuada eu.
            Vivamus sed faucibus ligula, ut imperdiet est. Proin venenatis ex orci, et bibendum lorem blandit id.
            Morbi aliquet metus vitae eros consectetur volutpat. Vivamus tempor elementum mauris, eget iaculis odio pretium non.
            Etiam metus dui, posuere a rutrum vel, elementum sit amet est. Aliquam sit amet sapien massa.</Typography>
          <Divider variant='middle' sx={{m: 1}}/>
          
          <InputPanel onCalculate={onCalculate}/>

          <Divider variant='middle' sx={{m: 1}}/>

          { calculating && <CircularProgress size={80}/> }

          { individualHistory && eacHistory && ecbConverter &&
            <Results individualHistory={individualHistory} eacHistory={eacHistory} ecbConverter={ecbConverter}/>
          }
        </Container>
      </div>
    </ThemeProvider>
  );
}

export default App;
