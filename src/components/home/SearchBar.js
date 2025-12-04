import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

/**
 * Search bar component for home screen
 * @param {string} placeholder - Placeholder text
 * @param {function} onSearch - Search callback function
 */
const SearchBar = ({ placeholder = 'Search services...', onSearch }) => {
    return (
        <View style={styles.container}>
            <Ionicons name="search-outline" size={18} color={Colors.TEXT_SECONDARY} />
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor={Colors.TEXT_SECONDARY}
                onChangeText={onSearch}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    input: {
        flex: 1,
        marginLeft: 10,
        fontSize: 15,
        color: Colors.TEXT_PRIMARY,
    },
});

export default SearchBar;
