import { useState } from 'react';
import { Step, StepLabel, Stepper } from '@mui/material';

// please sent data with  the name 'stepsData'
// make an array of stepsData and pass that to customHook as a stepsData props, handleSteps will take 'prev' and 'next' inside callback function
export const useStepWizard = ({ stepsData }) => {
  const [activeSteps, setActiveSteps] = useState(0);
  const [dataLenght, setDtaLenth] = useState(stepsData.length - 1);

  // step wizard component
  const StepsWizard = () => {
    return (
      <Stepper
        className="custom-steps-bar"
        activeStep={activeSteps}
        alternativeLabel
      >
        {stepsData.map((step) => (
          <Step key={step} className="single-step">
            <StepLabel className="step-label">{step}</StepLabel>
          </Step>
        ))}
      </Stepper>
    );
  };
  const handleSteps = (posi) => {
    if (posi === 'next') {
      if (activeSteps === stepsData.length - 1) return;
      setActiveSteps((prev) => prev + 1);
    } else if (posi === 'prev') {
      if (activeSteps === 0) return;
      setActiveSteps((prev) => prev - 1);
    }else if(posi === 'reset'){
      setActiveSteps(0)
    }
  };

  return { handleSteps, activeSteps, dataLenght, StepsWizard };
};
