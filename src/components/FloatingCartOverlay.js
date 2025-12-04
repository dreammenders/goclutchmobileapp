import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { Colors } from '../constants/Colors';
import { Spacing } from '../constants/Spacing';

const FloatingCartOverlay = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();
  const [currentRoute, setCurrentRoute] = useState('');

  const slideAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const unsubscribe = navigation.addListener('state', () => {
      try {
        const state = navigation.getState?.();
        if (state?.routes?.[state.index]) {
          setCurrentRoute(state.routes[state.index].name);
        }
      } catch (error) {
        setCurrentRoute('');
      }
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (totalItems > 0) {
      // Slide up animation
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();

      // Subtle pulse animation
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.02,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();

      return () => pulseAnimation.stop();
    } else {
      // Slide down animation
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();
    }
  }, [totalItems, slideAnim, pulseAnim]);

  const handleCartPress = () => {
    navigation.navigate('Cart');
  };

  // Don't render on cart screen itself and auth screens
  const hideOnScreens = ['Cart', 'Auth', 'PayNow'];

  if (hideOnScreens.includes(currentRoute) || totalItems === 0) {
    return null;
  }



  return (
    <Animated.View
      style={[
        styles.floatingIcon,
        {
          bottom: 80 + insets.bottom,
          right: Spacing.M,
          transform: [{ translateX: slideAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [100, 0],
          })}, { scale: pulseAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.cartIcon}
        onPress={handleCartPress}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons
          name="cart"
          size={28}
          color={Colors.LIGHT_BACKGROUND}
        />
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {totalItems > 99 ? '99+' : totalItems}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  floatingIcon: {
    position: 'absolute',
    zIndex: 1000,
  },
  cartIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 2,
    borderColor: Colors.LIGHT_BACKGROUND,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    minWidth: 22,
    height: 22,
    paddingHorizontal: 6,
    borderRadius: 11,
    backgroundColor: '#FF6B35',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.LIGHT_BACKGROUND,
  },
  badgeText: {
    color: Colors.LIGHT_BACKGROUND,
    fontSize: 10,
    fontWeight: '800',
  },
});

export default FloatingCartOverlay;