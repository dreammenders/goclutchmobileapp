import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/Colors';
import { Responsive, responsiveSize } from '../constants/Responsive';

const getStyles = () => {
  return StyleSheet.create({
    container: {
      backgroundColor: '#FFFFFF',
      borderRadius: responsiveSize(12),
      marginBottom: responsiveSize(16),
      paddingHorizontal: responsiveSize(20),
      paddingVertical: responsiveSize(18),
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 4,
      elevation: 1,
      position: 'relative',
      overflow: 'hidden',
    },
    containerSelected: {
      borderColor: Colors.PRIMARY,
      borderWidth: 2,
      shadowColor: Colors.PRIMARY,
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    logoContainer: {
      marginRight: responsiveSize(12),
    },
    logo: {
      width: responsiveSize(50),
      height: responsiveSize(50),
      borderRadius: responsiveSize(8),
      backgroundColor: '#F5F5F5',
    },
    logoPlaceholder: {
      width: responsiveSize(50),
      height: responsiveSize(50),
      borderRadius: responsiveSize(25),
      backgroundColor: Colors.PRIMARY,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logoInitial: {
      fontSize: responsiveSize(18),
      fontWeight: '600',
      color: '#FFFFFF',
    },
    brandInfo: {
      flex: 1,
      justifyContent: 'center',
    },
    brandName: {
      fontSize: responsiveSize(18),
      fontWeight: '600',
      color: Colors.TEXT_PRIMARY,
      marginBottom: 2,
    },
    modelsCount: {
      fontSize: responsiveSize(14),
      color: Colors.TEXT_SECONDARY,
      fontWeight: '400',
    },
    rightSection: {
      marginLeft: 8,
      justifyContent: 'center',
    },
    selectedIndicator: {
      position: 'absolute',
      top: responsiveSize(8),
      right: responsiveSize(8),
      width: responsiveSize(24),
      height: responsiveSize(24),
      borderRadius: responsiveSize(12),
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
};

let styles = null;

if (!styles) {
  styles = getStyles();
}

const BrandCard = ({ 
  brand, 
  isSelected, 
  onPress, 
  style 
}) => {
  
  const brandInitial = brand.name ? brand.name.charAt(0).toUpperCase() : '?';
  
  return (
    <TouchableOpacity
      style={[
        styles.container,
        isSelected && styles.containerSelected,
        style
      ]}
      onPress={() => onPress(brand)}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        {/* Brand Logo or Initial */}
        <View style={styles.logoContainer}>
          {brand.logo_url ? (
            <Image
              source={{ uri: brand.logo_url }}
              style={styles.logo}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoInitial}>
                {brandInitial}
              </Text>
            </View>
          )}
        </View>
        
        {/* Brand Information */}
        <View style={styles.brandInfo}>
          <Text style={styles.brandName} numberOfLines={2}>
            {brand.name}
          </Text>
          {brand.models_count && (
            <Text style={styles.modelsCount}>
              {brand.models_count} models
            </Text>
          )}
        </View>
        
        {/* Arrow or Selected Indicator */}
        <View style={styles.rightSection}>
          <Ionicons 
            name="chevron-forward" 
            size={responsiveSize(22)} 
            color={Colors.TEXT_SECONDARY} 
          />
        </View>
      </View>
      
      {/* Selection Indicator */}
      {isSelected && (
        <LinearGradient
          colors={Colors.PRIMARY_GRADIENT}
          style={styles.selectedIndicator}
        >
          <Ionicons name="checkmark" size={16} color="#FFFFFF" />
        </LinearGradient>
      )}
    </TouchableOpacity>
  );
};

export default BrandCard;