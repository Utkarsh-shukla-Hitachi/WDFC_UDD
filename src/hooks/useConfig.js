import { useState, useEffect } from 'react';
const configFile = './config.json';

export default function useConfig() {
    const [config, setConfig] = useState(null);
    
    useEffect(() => {
    (
        async function fetchConfig() {
            try{
                const response = await fetch(configFile);
                const data = await response.json();
                setConfig(data);
                console.log('Config file loaded');
            }
            catch(err){
                console.error('Error fetching config file', err);
            }
        }());
    }, []);
    
    return config;
    }