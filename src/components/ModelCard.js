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
import { responsiveSize } from '../constants/Responsive';

const ModelCard = ({ 
  model, 
  isSelected, 
  onPress, 
  style 
}) => {
  const modelInitial = model.name ? model.name.charAt(0).toUpperCase() : '?';
  
  return (
    <TouchableOpacity
      style={[
        styles.container,
        isSelected && styles.containerSelected,
        style
      ]}
      onPress={() => onPress(model)}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        {/* Model Image or Initial */}
        <View style={styles.logoContainer}>
          {model.image_url ? (
            <Image
              source={{ uri: model.image_url }}
              style={styles.logo}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoInitial}>
                {modelInitial}
              </Text>
            </View>
          )}
        </View>
        
        {/* Model Information */}
        <View style={styles.modelInfo}>
          <Text style={styles.modelName} numberOfLines={2}>
            {model.name}
          </Text>
          {model.brand_name && (
            <Text style={styles.brandName}>
              {model.brand_name}
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

const styles = StyleSheet.create({
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
    width: responsiveSize(65),
    height: responsiveSize(55),
    borderRadius: responsiveSize(8),
    backgroundColor: '#F5F5F5',
    resizeMode: 'contain',
  },
  logoPlaceholder: {
    width: responsiveSize(65),
    height: responsiveSize(55),
    borderRadius: responsiveSize(8),
    backgroundColor: Colors.SECONDARY || '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoInitial: {
    fontSize: responsiveSize(22),
    fontWeight: '600',
    color: Colors.TEXT_PRIMARY,
  },
  modelInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  modelName: {
    fontSize: responsiveSize(18),
    fontWeight: '600',
    color: Colors.TEXT_PRIMARY,
    marginBottom: 2,
  },
  brandName: {
    fontSize: responsiveSize(14),
    color: Colors.TEXT_SECONDARY,
    fontWeight: '400',
  },
  rightSection: {
    marginLeft: responsiveSize(8),
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

export default ModelCard;