import React from 'react';
import './LoadingScreen.css'; 
import LoadingBars from './LoadingBars';
const LoadingScreen = ({children,isLoading}) => {
  if (!isLoading) return children;
    return (
      <LoadingBars/>
    );
};

export default LoadingScreen;