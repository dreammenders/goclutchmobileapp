import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/Colors';
import { Spacing } from '../constants/Spacing';
import { Typography } from '../constants/Typography';
import { responsiveSize } from '../constants/Responsive';

const getGradientColors = (id) => {
  const gradients = [
    ['#EC4899', '#DB2777'],
    ['#F59E0B', '#EF4444'],
    ['#10B981', '#059669'],
    ['#3B82F6', '#06B6D4'],
    ['#8B5CF6', '#D946EF'],
    ['#14B8A6', '#06B6D4'],
  ];
  const index = (parseInt(id) - 1) % gradients.length;
  return gradients[index];
};

const getStyles = () => {
  return StyleSheet.create({
    card: {
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      borderRadius: 18,
      paddingVertical: Spacing.M,
      paddingHorizontal: Spacing.M,
      marginHorizontal: 2,
      marginBottom: Spacing.S,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
      elevation: 10,
      borderWidth: 0,
      overflow: 'hidden',
      position: 'relative',
    },
    glassLayer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      zIndex: 0,
    },
    gradientBg: {
      position: 'absolute',
      top: -30,
      right: -30,
      width: 100,
      height: 100,
      borderRadius: 50,
      opacity: 0.12,
      zIndex: 1,
    },
    iconContainer: {
      width: responsiveSize(62),
      height: responsiveSize(62),
      borderRadius: Spacing.BORDER_RADIUS_M,
      backgroundColor: Colors.PRIMARY + '08',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 6,
      zIndex: 2,
      position: 'relative',
      borderWidth: 1,
      borderColor: Colors.PRIMARY + '10',
    },
    icon: {
      fontSize: responsiveSize(36),
    },
    categoryImage: {
      width: responsiveSize(58),
      height: responsiveSize(58),
    },
    name: {
      fontSize: Typography.CAPTION,
      fontWeight: '700',
      color: Colors.TEXT_PRIMARY,
      textAlign: 'center',
      lineHeight: Typography.LINE_HEIGHT_NORMAL * Typography.CAPTION,
      zIndex: 2,
      position: 'relative',
      letterSpacing: -0.3,
    },
  });
};

let styles = null;

if (!styles) {
  styles = getStyles();
}

const CategoryCard = ({ id, name, icon, image, onPress }) => {
  
  const scaleValue = new Animated.Value(1);
  const gradientColors = getGradientColors(id);

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={[
          styles.card,
          {
            transform: [{ scale: scaleValue }],
          },
        ]}
      >
        <View style={styles.glassLayer} />
        <LinearGradient
          colors={[...gradientColors, 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBg}
        />
        <View style={styles.iconContainer}>
          {image ? (
            <Image
              source={image}
              style={styles.categoryImage}
              resizeMode="contain"
            />
          ) : (
            <Text style={styles.icon}>{icon}</Text>
          )}
        </View>
        <Text style={styles.name} numberOfLines={2}>
          {name}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default CategoryCard;