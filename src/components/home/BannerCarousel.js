import React, { useRef } from 'react';
import { View, FlatList, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import PaginationDots from './PaginationDots';

const BANNER_WIDTH = 400;
const BANNER_SPACING = 0;

/**
 * Banner carousel component for promotional banners
 * @param {Array} banners - Array of banner objects
 * @param {number} activeIndex - Current active banner index
 * @param {function} onScroll - Scroll handler
 */
const BannerCarousel = ({ banners = [], activeIndex = 0, onScroll }) => {
    const flatListRef = useRef(null);

    if (banners.length === 0) return null;

    const renderBanner = ({ item }) => (
        <View style={styles.bannerCard}>
            {item.image_url && typeof item.image_url === 'string' ? (
                <Image
                    source={{ uri: item.image_url }}
                    style={styles.bannerImage}
                    resizeMode="contain"
                />
            ) : (
                <View style={styles.bannerTextContent}>
                    <Text style={styles.bannerTitle}>{item.title}</Text>
                    <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
                    <TouchableOpacity style={styles.bannerButton}>
                        <Text style={styles.bannerButtonText}>Book Now</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );

    return (
        <View style={styles.section}>
            <FlatList
                ref={flatListRef}
                data={banners}
                renderItem={renderBanner}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.container}
                snapToInterval={BANNER_WIDTH + BANNER_SPACING}
                decelerationRate="fast"
                pagingEnabled={false}
                snapToAlignment="start"
                onScroll={onScroll}
                scrollEventThrottle={16}
                getItemLayout={(data, index) => ({
                    length: BANNER_WIDTH + BANNER_SPACING,
                    offset: (BANNER_WIDTH + BANNER_SPACING) * index,
                    index,
                })}
            />
            <PaginationDots total={banners.length} activeIndex={activeIndex} />
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        marginBottom: 24,
    },
    container: {
        paddingHorizontal: 20,
    },
    bannerCard: {
        width: BANNER_WIDTH - 40,
        height: 160,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        marginRight: BANNER_SPACING,
    },
    bannerImage: {
        width: '100%',
        height: '100%',
    },
    bannerTextContent: {
        padding: 20,
        justifyContent: 'center',
    },
    bannerTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 8,
        color: '#1A1A1A',
    },
    bannerSubtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
    },
    bannerButton: {
        backgroundColor: '#FF6B35',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    bannerButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 14,
    },
});

export default BannerCarousel;
