import React from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

/**
 * Vehicle selector button component
 * @param {Object} selectedVehicle - Currently selected vehicle
 * @param {function} onPress - Press handler
 */
const VehicleSelector = ({ selectedVehicle, onPress }) => {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <View style={styles.content}>
                {selectedVehicle ? (
                    <>
                        {selectedVehicle.model?.image_url ? (
                            <Image
                                source={{ uri: selectedVehicle.model.image_url }}
                                style={styles.image}
                                resizeMode="contain"
                            />
                        ) : (
                            <Ionicons name="car-sport" size={40} color={Colors.PRIMARY} />
                        )}
                        <View style={styles.info}>
                            <Text style={styles.modelText} numberOfLines={1}>
                                {selectedVehicle.model?.name}
                            </Text>
                        </View>
                    </>
                ) : (
                    <>
                        <Ionicons name="car-sport-outline" size={40} color={Colors.TEXT_SECONDARY} />
                        <View style={styles.info}>
                            <Text style={styles.placeholder}>Select Vehicle</Text>
                            <Text style={styles.placeholderSub}>Tap to choose</Text>
                        </View>
                    </>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        marginTop: 8,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        width: 50,
        height: 50,
    },
    info: {
        flex: 1,
        marginLeft: 12,
    },
    modelText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.TEXT_PRIMARY,
    },
    placeholder: {
        fontSize: 15,
        fontWeight: '500',
        color: Colors.TEXT_SECONDARY,
    },
    placeholderSub: {
        fontSize: 12,
        color: Colors.TEXT_SECONDARY,
        marginTop: 2,
    },
});

export default VehicleSelector;
