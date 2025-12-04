import React, { useRef } from 'react';
import { View, FlatList, Image, Text, StyleSheet } from 'react-native';
import PaginationDots from './PaginationDots';

const BANNER_WIDTH = 400;
const BANNER_SPACING = 0;

/**
 * Offers carousel component for special offers
 * @param {Array} offers - Array of offer objects
 * @param {number} activeIndex - Current active offer index
 * @param {function} onScroll - Scroll handler
 */
const OffersCarousel = ({ offers = [], activeIndex = 0, onScroll }) => {
    const flatListRef = useRef(null);

    if (offers.length === 0) return null;

    const renderOffer = ({ item }) => (
        <View style={styles.offerCard}>
            {item.image_url && typeof item.image_url === 'string' ? (
                <Image
                    source={{ uri: item.image_url }}
                    style={styles.offerImage}
                    resizeMode="contain"
                />
            ) : (
                <View style={styles.offerTextContent}>
                    <Text style={styles.offerTitle}>{item.title}</Text>
                    {item.discount && <Text style={styles.offerDiscount}>{item.discount}</Text>}
                    <Text style={styles.offerSubtitle}>{item.subtitle}</Text>
                </View>
            )}
        </View>
    );

    return (
        <View style={styles.section}>
            <FlatList
                ref={flatListRef}
                data={offers}
                renderItem={renderOffer}
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
            <PaginationDots total={offers.length} activeIndex={activeIndex} />
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
    offerCard: {
        width: BANNER_WIDTH - 40,
        height: 140,
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
    offerImage: {
        width: '100%',
        height: '100%',
    },
    offerTextContent: {
        padding: 20,
        justifyContent: 'center',
    },
    offerTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 6,
        color: '#1A1A1A',
    },
    offerDiscount: {
        fontSize: 24,
        fontWeight: '800',
        color: '#FF6B35',
        marginBottom: 4,
    },
    offerSubtitle: {
        fontSize: 13,
        color: '#666',
    },
});

export default OffersCarousel;
