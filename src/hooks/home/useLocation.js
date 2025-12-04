import { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

/**  
 * Custom hook to manage location tracking and permissions
 * Handles foreground location permissions, tracking, and geocoding
 * 
 * @returns {Object} { location, isLoading, requestPermission, subscription }
 */
export const useLocation = () => {
    const [currentLocation, setCurrentLocation] = useState('Getting location...');
    const [isLoadingLocation, setIsLoadingLocation] = useState(true);
    const [locationSubscription, setLocationSubscription] = useState(null);

    // Persist address data for checkout
    const persistCheckoutAddress = async ({ street, city, district, region, postalCode, fallback }) => {
        try {
            const addressLine = [street, region].filter(Boolean).join(', ') || fallback || '';
            const cityValue = city || district || region || '';
            const pincodeValue = postalCode || '';
            const operations = [];
            if (addressLine) operations.push(['@checkout_address', addressLine]);
            if (cityValue) operations.push(['@checkout_city', cityValue]);
            if (pincodeValue) operations.push(['@checkout_pincode', pincodeValue]);
            if (operations.length > 0) {
                await AsyncStorage.multiSet(operations);
            }
        } catch (error) {
            console.error('Error persisting address:', error);
        }
    };

    // Convert coordinates to address
    const reverseGeocode = async (latitude, longitude) => {
        try {
            const addresses = await Location.reverseGeocodeAsync({ latitude, longitude });

            if (addresses && addresses.length > 0) {
                const address = addresses[0];
                const locationString = [
                    address.street || address.name,
                    address.city || address.district,
                ]
                    .filter(Boolean)
                    .join(', ');

                setCurrentLocation(locationString || 'Unknown location');
                await persistCheckoutAddress({
                    street: address.street || address.name,
                    city: address.city,
                    district: address.district,
                    region: address.region,
                    postalCode: address.postalCode,
                    fallback: locationString,
                });
            } else {
                setCurrentLocation('Unknown location');
            }
        } catch (error) {
            setCurrentLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        } finally {
            setIsLoadingLocation(false);
        }
    };

    // Get current location once
    const getCurrentLocation = async () => {
        try {
            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });
            await reverseGeocode(location.coords.latitude, location.coords.longitude);
        } catch (error) {
            setCurrentLocation('Unable to get location');
            setIsLoadingLocation(false);
        }
    };

    // Start watching location changes
    const startLocationTracking = async () => {
        try {
            const subscription = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.Balanced,
                    distanceInterval: 100,
                    timeInterval: 30000,
                },
                (location) => {
                    reverseGeocode(location.coords.latitude, location.coords.longitude);
                }
            );
            setLocationSubscription(subscription);
        } catch (error) {
            // Silent error handling
        }
    };

    // Request location permission and start tracking
    const requestLocationPermission = async () => {
        try {
            setIsLoadingLocation(true);

            const { status: existingStatus } = await Location.getForegroundPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const { status } = await Location.requestForegroundPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                setCurrentLocation('Location permission denied');
                setIsLoadingLocation(false);
                Alert.alert(
                    'Location Permission',
                    'Please enable location access to see your current location and get better service recommendations.',
                    [{ text: 'OK' }]
                );
                return;
            }

            await getCurrentLocation();
            startLocationTracking();
        } catch (error) {
            setCurrentLocation('Unable to get location');
            setIsLoadingLocation(false);
        }
    };

    // Request permission on mount
    useEffect(() => {
        requestLocationPermission();

        // Cleanup subscription on unmount
        return () => {
            if (locationSubscription) {
                locationSubscription.remove();
            }
        };
    }, []);

    return {
        location: currentLocation,
        isLoading: isLoadingLocation,
        requestPermission: requestLocationPermission,
        subscription: locationSubscription,
    };
};

export default useLocation;
