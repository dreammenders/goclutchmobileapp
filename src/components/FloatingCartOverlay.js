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
  const hideOnScreens = ['Cart', 'Auth'];

  if (hideOnScreens.includes(currentRoute) || totalItems === 0) {
    return null;
  }



  return (
    <Animated.View
      style={[
        styles.ribbon,
        {
          bottom: 56 + insets.bottom, // Above tab bar (56 is TAB_BAR_HEIGHT)
          transform: [{ translateY: slideAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [100, 0],
          })}, { scale: pulseAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.cartRibbon}
        onPress={handleCartPress}
        activeOpacity={0.9}
      >
        <View style={styles.leftSection}>
          <View style={styles.cartIconContainer}>
            <MaterialCommunityIcons
              name="cart-outline"
              size={24}
              color={Colors.LIGHT_BACKGROUND}
            />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {totalItems > 99 ? '99+' : totalItems}
              </Text>
            </View>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.itemCount}>
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </Text>
          </View>
        </View>

        <View style={styles.rightSection}>
          <Text style={styles.viewAllText}>View All</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  ribbon: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  cartRibbon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.PRIMARY,
    marginHorizontal: Spacing.SCREEN_HORIZONTAL,
    marginVertical: Spacing.S,
    paddingHorizontal: Spacing.M,
    paddingVertical: Spacing.M,
    borderRadius: Spacing.BORDER_RADIUS_L,
    shadowColor: Colors.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: Colors.LIGHT_BACKGROUND,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cartIconContainer: {
    position: 'relative',
    marginRight: Spacing.M,
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    borderRadius: 10,
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
  textContainer: {
    flex: 1,
  },
  itemCount: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.LIGHT_BACKGROUND,
    opacity: 0.9,
  },
  rightSection: {
    marginLeft: Spacing.S,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.LIGHT_BACKGROUND,
  },
});

export default FloatingCartOverlay;