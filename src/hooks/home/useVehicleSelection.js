import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
    SELECTED_VEHICLE: '@selected_vehicle',
};

/**
 * Custom hook to manage vehicle selection state
 * Loads and manages the selected vehicle from AsyncStorage
 * 
 * @returns {Object} { selectedVehicle, loadVehicle, setSelectedVehicle }
 */
export const useVehicleSelection = () => {
    const [selectedVehicle, setSelectedVehicle] = useState(null);

    // Load selected vehicle from AsyncStorage
    const loadVehicle = async () => {
        try {
            const storedVehicle = await AsyncStorage.getItem(STORAGE_KEYS.SELECTED_VEHICLE);
            if (storedVehicle) {
                const vehicleData = JSON.parse(storedVehicle);
                setSelectedVehicle(vehicleData);
            }
        } catch (error) {
            console.error('Error loading selected vehicle:', error);
        }
    };

    useEffect(() => {
        loadVehicle();
    }, []);

    return {
        selectedVehicle,
        setSelectedVehicle,
        loadVehicle,
    };
};

export default useVehicleSelection;
