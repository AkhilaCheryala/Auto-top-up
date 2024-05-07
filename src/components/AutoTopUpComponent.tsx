import React, { useState, useEffect } from 'react';
import { Slider, Switch, Button, Typography, createTheme, ThemeProvider } from '@mui/material';
import { styled } from '@mui/system';
import './Auto.css'; 

// Define options for credit purchase.
const creditOptions = [
  { credits: 500, price: 5 },
  { credits: 1200, price: 10 },
  { credits: 1700, price: 15 },
  { credits: 2500, price: 20 },
  { credits: 3900, price: 25 },
  { credits: 5000, price: 30 }
];

// Define a styled switch component.
const IOSSwitch = styled(Switch)(({ theme }) => ({
  width: 36,
  height: 20,
  padding: 0,
  margin: theme.spacing(1),
  '& .MuiSwitch-switchBase': {
    padding: 1,
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: theme.palette.common.white,
      '& + .MuiSwitch-track': {
        backgroundColor: '#00cc99',
        opacity: 1,
        border: 'none',
      },
    },
    '&.Mui-focusVisible .MuiThumb-root': {
      color: '#00cc99',
      border: '6px solid #fff',
    },
  },
  '& .MuiSwitch-thumb': {
    width: 18,
    height: 18,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: '#bdbdbd',
    opacity: 1,
    transition: 'background-color 0.3s ease-out',
  },
}));

// Defining the theme.
const theme = createTheme({
  palette: {
    primary: {
      main: '#8A2BE2',
    },
  },
});

// Defining the AutoTopUpComponent functional component.
const AutoTopUpComponent: React.FC = () => {
  // State to manage auto top-up feature.
  const [autoTopUp, setAutoTopUp] = useState<boolean>(true);

  // Setting default slider value based on stored value or default option.
  const defaultSliderValue = creditOptions.findIndex(option => option.credits === 1200) / (creditOptions.length - 1);
  const [sliderValue, setSliderValue] = useState<number>(() => {
    const storedValue = localStorage.getItem('sliderValue');
    return storedValue ? parseFloat(storedValue) : defaultSliderValue;
  });

  // Reset slider value whenever autoTopUp setting changes or component mounts.
  useEffect(() => {
    setSliderValue(defaultSliderValue);
  }, [autoTopUp, defaultSliderValue]);

  // Calculate step size for equally distributed marks.
  const stepSize = 1 / (creditOptions.length - 1);

  // Generate marks for the slider.
  const marks = creditOptions.map((option, index) => ({
    value: index * stepSize,
    label: (
      <div className='mark-label'>
        <div className='one'>${option.price}</div>
        <div className='two'>{option.credits} credits</div>
      </div>
    )
  }));

  // Style for the slider.
  const sliderStyle = {
    height: '8px',
    width: '95%',
  };

  // Function to handle slider change.
  const handleSliderChange = (_: Event, value: number | number[]) => {
    setSliderValue(value as number);
    localStorage.setItem('sliderValue', value.toString());
  };

  // Function to handle purchase confirmation.
  const handleConfirmPurchase = () => {
    const selectedOption = creditOptions[Math.round(sliderValue * (creditOptions.length - 1))];
    console.log(`Confirm auto-purchase: ${selectedOption.credits} credits for $${selectedOption.price}`);
  };

  // JSX structure for the component.
  return (
    <ThemeProvider theme={theme}>
      <div className='autotop'>
        <div className='switch-container'>
          <Typography variant="h6" style={{ fontWeight: 'bold', fontSize: '22px' }}>
            Auto Top-up: {autoTopUp ? 'On' : 'Off'}
          </Typography>
          <IOSSwitch
            checked={autoTopUp}
            onChange={(event) => setAutoTopUp(event.target.checked)}
            color="success"
          />
        </div>
        <div>
          <p>When your credits drop below <span className='xyz'>50</span>, we'll automatically purchase <span className='xyz'>1200</span> credits and add them to your account. <a href="#" className="learn-more-link">Learn more</a></p>
        </div>
        {autoTopUp && (
          <div className='slider'>
            <Slider
              value={sliderValue}
              onChange={handleSliderChange}
              min={0}
              max={1}
              step={stepSize}
              marks={marks}
              style={sliderStyle}
            />
            <Typography variant="body1" style={{ margin: '2rem 0 1rem 0', fontFamily: '"Poppins", sans-serif' }}>
              Credits: <span style={{ color: '#8A2BE2' }}>{creditOptions.length > 0 && sliderValue >= 0 && sliderValue <= 1 && creditOptions[Math.round(sliderValue * (creditOptions.length - 1))]?.credits}</span>,
              Price: $<span style={{ color: '#8A2BE2' }}>{creditOptions.length > 0 && sliderValue >= 0 && sliderValue <= 1 && creditOptions[Math.round(sliderValue * (creditOptions.length - 1))]?.price.toFixed(2)}</span>
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleConfirmPurchase}
            >
              Confirm auto-purchase
            </Button>
          </div>
        )}
      </div>
    </ThemeProvider>
  );
};

export default AutoTopUpComponent;
