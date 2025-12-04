import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';

/**
 * Pagination dots component for carousels
 * @param {number} total - Total number of items
 * @param {number} activeIndex - Currently active item index
 */
const PaginationDots = ({ total, activeIndex }) => {
    return (
        <View style={styles.container}>
            {Array.from({ length: total }).map((_, index) => (
                <View
                    key={index}
                    style={[
                        styles.dot,
                        index === activeIndex && styles.dotActive,
                    ]}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
        gap: 6,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: Colors.TEXT_SECONDARY + '40',
    },
    dotActive: {
        width: 20,
        backgroundColor: Colors.PRIMARY,
    },
});

export default PaginationDots;
