import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { Spacing } from '../constants/Spacing';
import { Typography } from '../constants/Typography';

const SearchBar = ({ placeholder = 'Search accessories…', onChangeText, value }) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={Colors.TEXT_SECONDARY}
        onChangeText={onChangeText}
        value={value}
        returnKeyType="search"
      />
      <View style={styles.searchIcon}>
        <Ionicons name="search" size={20} color={Colors.PRIMARY} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.SCREEN_HORIZONTAL,
    marginTop: Spacing.XS,
    marginBottom: -Spacing.XS,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  input: {
    height: Spacing.INPUT_HEIGHT,
    backgroundColor: Colors.LIGHT_BACKGROUND,
    borderRadius: Spacing.BORDER_RADIUS_L,
    paddingHorizontal: Spacing.M,
    paddingRight: 50,
    fontSize: Typography.BODY_M,
    fontFamily: Typography.FONT_REGULAR,
    color: Colors.TEXT_PRIMARY,
    borderWidth: 2,
    borderColor: Colors.PRIMARY,
  },
  searchIcon: {
    position: 'absolute',
    right: Spacing.M,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SearchBar;