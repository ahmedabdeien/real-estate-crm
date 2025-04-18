// src/AppWrapper.jsx
import { useEffect } from 'react';
import useThemeStore from './store/useThemeStore';
import App from './App';

const AppWrapper = () => {
  const { theme } = useThemeStore();

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);    

  }, [theme]);

  return <App />;
};

export default AppWrapper;
