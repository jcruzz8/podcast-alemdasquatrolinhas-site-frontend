import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchSiteSettings, toggleSpotifyLike } from '../services/settingsService';
import { useAuth } from './AuthContext';

const AudioContext = createContext(null);

export function AudioProvider({ children }) {
    const [playerContent, setPlayerContent] = useState(null); // Guarda { iframe, title }
    const [playerLikes, setPlayerLikes] = useState([]); // Guarda SÓ os [likes]
    const [isLoading, setIsLoading] = useState(true);
    const { isLoggedIn } = useAuth();

    // Vai buscar as settings UMA VEZ
    useEffect(() => {
        const loadSettings = async () => {
            setIsLoading(true);
            const data = await fetchSiteSettings();
            if (data) {
                setPlayerContent({
                    iframe: data.spotifyIframe,
                    title: data.spotifyTitle
                });
                setPlayerLikes(data.likes || []);
            }
            setIsLoading(false);
        };
        loadSettings();
    }, []);

    // A função de Like SÓ mexe no estado 'playerLikes'
    const handleLike = async () => {
        if (!isLoggedIn) return;
        const updatedSettings = await toggleSpotifyLike();
        if (updatedSettings) {
            setPlayerLikes(updatedSettings.likes || []);
        }
    };

    const value = {
        playerContent,
        playerLikes,
        isLoading,
        handleLike
    };

    return (
        <AudioContext.Provider value={value}>
            {children}
        </AudioContext.Provider>
    );
}

// O Hook
export const useAudio = () => {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error('useAudio deve ser usado dentro de um AudioProvider');
    }
    return context;
};