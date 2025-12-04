import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import ServiceCard from './ServiceCard';
import { Colors } from '../../constants/Colors';

/**
 * Services section component with featured and compact service cards
 * @param {Array} services - Array of service objects
 * @param {function} onServicePress - Service press handler (WITH smart navigation logic)
 */
const ServicesSection = ({ services = [], onServicePress }) => {
    const featuredServices = services.slice(0, 2);
    const compactServices = services.slice(2);

    const renderCompactService = ({ item, index }) => (
        <ServiceCard
            service={item}
            gradientIndex={index + featuredServices.length}
            variant="compact"
            onPress={onServicePress}
        />
    );

    return (
        <View style={styles.container}>
            {/* Section Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Our Services</Text>
                <Text style={styles.subtitle}>Premium care for your vehicle</Text>
            </View>

            {/* Featured Services (2 cards in a row) */}
            {featuredServices.length > 0 && (
                <View style={styles.featuredContainer}>
                    {featuredServices.map((service, index) => (
                        <ServiceCard
                            key={service.id}
                            service={service}
                            gradientIndex={index}
                            variant="featured"
                            onPress={onServicePress}
                        />
                    ))}
                </View>
            )}

            {/* Compact Services (3 cards in a row) */}
            {compactServices.length > 0 && (
                <FlatList
                    data={compactServices}
                    renderItem={renderCompactService}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={3}
                    columnWrapperStyle={styles.compactRow}
                    scrollEnabled={false}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    header: {
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.TEXT_PRIMARY,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: Colors.TEXT_SECONDARY,
    },
    featuredContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    compactRow: {
        justifyContent: 'space-between',
        marginBottom: 12,
    },
});

export default ServicesSection;
