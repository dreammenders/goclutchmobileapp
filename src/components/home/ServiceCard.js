import React from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getServiceGradient } from '../../constants/serviceGradients';

/**
 * Service card component with gradient background and smart navigation support
 * @param {Object} service - Service object
 * @param {number} gradientIndex - Index for gradient color selection
 * @param {string} variant - Card variant ('featured' or 'compact')
 * @param {function} onPress - Press handler
 */
const ServiceCard = ({ service, gradientIndex, variant = 'compact', onPress }) => {
    const gradientColors = getServiceGradient(gradientIndex);
    const serviceName = (service?.name || '').trim();
    const isIconEnhanced = serviceName === 'Periodic Service' || serviceName === 'Denting & Painting';
    const iconSize = variant === 'featured' ? (isIconEnhanced ? 64 : 50) : isIconEnhanced ? 52 : 38;

    return (
        <TouchableOpacity
            style={[
                styles.card,
                variant === 'featured' ? styles.cardFeatured : styles.cardCompact,
            ]}
            activeOpacity={0.7}
            onPress={() => onPress(service)}
        >
            <View style={styles.glassLayer} />
            <LinearGradient
                colors={[...gradientColors, 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                    styles.gradientBg,
                    variant === 'featured' && styles.gradientBgFeatured,
                    variant === 'compact' && styles.gradientBgCompact,
                ]}
            />
            <View
                style={[
                    styles.iconWrapper,
                    variant === 'featured' ? styles.iconWrapperFeatured : styles.iconWrapperCompact,
                ]}
            >
                {service.image_url && typeof service.image_url === 'string' ? (
                    <View
                        style={[
                            styles.imageContainer,
                            variant === 'featured' && styles.imageContainerFeatured,
                            variant === 'compact' && styles.imageContainerCompact,
                        ]}
                    >
                        <LinearGradient
                            colors={[...gradientColors.map((c) => c + '15')]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.imageBackdrop}
                        />
                        <Image
                            source={{ uri: service.image_url }}
                            style={[
                                styles.image,
                                variant === 'featured' && styles.imageFeatured,
                                variant === 'compact' && styles.imageCompact,
                            ]}
                            resizeMode="contain"
                        />
                    </View>
                ) : (
                    <LinearGradient
                        colors={gradientColors}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[
                            styles.iconBg,
                            isIconEnhanced && styles.iconBgLarge,
                            variant === 'featured' && styles.iconBgFeatured,
                            variant === 'compact' && styles.iconBgCompact,
                        ]}
                    >
                        <Ionicons name="construct" size={iconSize} color="#FFFFFF" />
                    </LinearGradient>
                )}
            </View>
            <Text
                style={[
                    styles.name,
                    variant === 'featured' ? styles.nameFeatured : styles.nameCompact,
                ]}
                numberOfLines={variant === 'featured' ? 3 : 2}
            >
                {service.name}
            </Text>
            <View style={styles.shimmerOverlay} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    // Base card styles
    card: {
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    cardFeatured: {
        width: '48%',
        aspectRatio: 1,
        marginBottom: 16,
    },
    cardCompact: {
        width: '31%',
        aspectRatio: 0.85,
    },
    glassLayer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
    },
    gradientBg: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.2,
    },
    gradientBgFeatured: {
        opacity: 0.25,
    },
    gradientBgCompact: {
        opacity: 0.2,
    },
    iconWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconWrapperFeatured: {
        marginTop: 24,
        marginBottom: 12,
    },
    iconWrapperCompact: {
        marginTop: 16,
        marginBottom: 8,
    },
    imageContainer: {
        borderRadius: 12,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageContainerFeatured: {
        width: 90,
        height: 90,
    },
    imageContainerCompact: {
        width: 60,
        height: 60,
    },
    imageBackdrop: {
        ...StyleSheet.absoluteFillObject,
    },
    image: {
        width: '80%',
        height: '80%',
    },
    imageFeatured: {
        width: '85%',
        height: '85%',
    },
    imageCompact: {
        width: '75%',
        height: '75%',
    },
    iconBg: {
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconBgLarge: {
        width: 90,
        height: 90,
    },
    iconBgFeatured: {
        width: 80,
        height: 80,
    },
    iconBgCompact: {
        width: 56,
        height: 56,
    },
    name: {
        textAlign: 'center',
        fontWeight: '600',
        paddingHorizontal: 8,
    },
    nameFeatured: {
        fontSize: 16,
        marginBottom: 20,
    },
    nameCompact: {
        fontSize: 13,
        marginBottom: 12,
    },
    shimmerOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'transparent',
    },
});

export default ServiceCard;
