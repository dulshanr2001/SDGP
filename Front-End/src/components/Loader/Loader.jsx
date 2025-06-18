import React from 'react';
import { useLoaderStore } from '../../store/use-loader-store';
import './Loader.css';

const Loader = () => {
  const { isLoading } = useLoaderStore();
  
  if (!isLoading) return null;
  
  return (
    <div className="loader-overlay">
        <div className="loader-spinner"></div>
    </div>
  );
};

export default Loader;