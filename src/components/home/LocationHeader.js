import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

/**
 * Location header component showing current location
 * @param {string} location - Current location string
 * @param {boolean} isLoading - Loading state
 */
const LocationHeader = ({ location, isLoading }) => {
    return (
        <View style={styles.locationRow}>
            <Ionicons name="location-sharp" size={16} color={Colors.PRIMARY} />
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color={Colors.PRIMARY} />
                    <Text style={styles.loadingText}>Getting location...</Text>
                </View>
            ) : (
                <Text style={styles.locationText} numberOfLines={1}>
                    {location}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 8,
    },
    loadingText: {
        marginLeft: 8,
        fontSize: 14,
        color: Colors.TEXT_SECONDARY,
    },
    locationText: {
        marginLeft: 8,
        fontSize: 14,
        fontWeight: '500',
        color: Colors.TEXT_PRIMARY,
        flex: 1,
    },
});

export default LocationHeader;
