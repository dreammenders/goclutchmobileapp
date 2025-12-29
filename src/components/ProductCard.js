import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Colors } from '../constants/Colors';
import { Spacing } from '../constants/Spacing';
import { Typography } from '../constants/Typography';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { responsiveSize } from '../constants/Responsive';
import { useCart } from '../context/CartContext';

const getStyles = () => {
  return StyleSheet.create({
    cardContainer: {
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      marginHorizontal: Spacing.S,
      marginBottom: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 6,
      borderWidth: 1,
      borderColor: '#F3F4F6',
      overflow: 'hidden',
    },
    mainContent: {
      padding: 16,
      paddingBottom: 12,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 16,
    },
    titleColumn: {
      flex: 1,
      paddingRight: 10,
    },
    productTitle: {
      fontSize: 16,
      fontWeight: '800',
      color: '#1F2937',
      letterSpacing: -0.3,
      marginBottom: 6,
    },
    ratingTag: {
      backgroundColor: '#FEF3C7',
      alignSelf: 'flex-start',
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 4,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    ratingTagText: {
      fontSize: 10,
      fontWeight: '800',
      color: '#D97706',
      letterSpacing: 0.5,
    },
    discountBadge: {
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 6,
    },
    discountText: {
      color: '#FFFFFF',
      fontWeight: '700',
      fontSize: 11,
      letterSpacing: 0.5,
    },
    body: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    imageSection: {
      width: '30%',
      justifyContent: 'center',
    },
    imageFrame: {
      width: 76,
      height: 76,
      borderRadius: 12,
      backgroundColor: '#F9FAFB',
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: '#F3F4F6',
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      width: '100%',
      height: '100%',
    },
    icon: {
      fontSize: 36,
    },
    featureSection: {
      width: '70%',
      paddingLeft: 12,
      justifyContent: 'center',
    },
    featureRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 6,
    },
    featureIcon: {
      width: 16,
      height: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    featureText: {
      fontSize: 13,
      color: '#4B5563',
      fontWeight: '500',
      marginLeft: 8,
      flex: 1,
    },
    divider: {
      height: 1,
      backgroundColor: '#F3F4F6',
      marginBottom: 12,
    },
    pricingRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    originalPrice: {
      fontSize: 12,
      color: '#9CA3AF',
      textDecorationLine: 'line-through',
      marginBottom: 0,
    },
    finalPriceWrapper: {
      flexDirection: 'row',
      alignItems: 'baseline',
    },
    currency: {
      fontSize: 14,
      fontWeight: '600',
      color: '#111827',
      marginRight: 2,
    },
    finalPrice: {
      fontSize: 22,
      fontWeight: '900',
      color: '#111827',
      letterSpacing: -0.5,
    },
    addButton: {
      width: 100,
      borderRadius: 8,
      overflow: 'hidden',
    },
    addBtnGradient: {
      paddingVertical: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    addButtonText: {
      color: '#FFFFFF',
      fontSize: 13,
      fontWeight: '700',
      letterSpacing: 1,
    },
    disabledBtn: {
      opacity: 0.7,
    },
  });
};

let styles = null;

if (!styles) {
  styles = getStyles();
}

const ProductCard = ({ id, name, icon, price, rating, onPress, imageUrl, discount, originalPrice }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const { addToCart } = useCart();
  
  const iconMap = {
    vacuum: '🧹',
    holder: '📱',
    freshener: '🌸',
    cloth: '🧽',
    wax: '✨',
    foam: '🫧',
  };

  const displayIcon = icon || iconMap[name?.toLowerCase()?.split(' ')[0]] || '🚗';

  const effectiveOriginalPrice = originalPrice || (Number(discount) > 0 
    ? Math.round(Number(price) / (1 - Number(discount) / 100)) 
    : Math.round(Number(price) * 1.25));

  const effectiveDiscount = Number(discount) > 0 
    ? Number(discount) 
    : Math.round(((effectiveOriginalPrice - price) / effectiveOriginalPrice) * 100);

  const formatPrice = (price) => {
    try {
      const num = Number(price) || 0;
      return isNaN(num) ? '0' : num.toLocaleString();
    } catch (err) {
      return '0';
    }
  };

  const handleAddToCart = () => {
    if (!name || !price) return;
    setIsAdding(true);
    const productData = {
      id: id,
      name: name,
      price: Number(price),
      originalPrice: effectiveOriginalPrice,
      type: 'product',
      image: imageUrl ? (typeof imageUrl === 'string' ? { uri: imageUrl } : imageUrl) : null,
      description: `Premium product - ${name}`,
    };
    addToCart(productData);
    setTimeout(() => {
      setIsAdding(false);
      setIsAdded(true);
    }, 500);
  };

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={onPress}
      activeOpacity={0.95}
    >
      <View style={styles.mainContent}>
        <View style={styles.header}>
          <View style={styles.titleColumn}>
            <Text style={styles.productTitle}>{name}</Text>
          </View>
          {effectiveDiscount > 0 ? (
            <LinearGradient
              colors={['#EF4444', '#DC2626']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.discountBadge}
            >
              <Text style={styles.discountText}>{effectiveDiscount}% OFF</Text>
            </LinearGradient>
          ) : null}
        </View>
        <View style={styles.body}>
          <View style={styles.imageSection}>
            <View style={styles.imageFrame}>
              {imageUrl ? (
                <Image 
                  source={typeof imageUrl === 'string' ? { uri: imageUrl } : imageUrl} 
                  style={styles.image} 
                  resizeMode="cover" 
                />
              ) : (
                <Text style={styles.icon}>{displayIcon}</Text>
              )}
            </View>
          </View>
          <View style={styles.featureSection}>
            <View style={styles.featureRow}>
              <View style={styles.featureIcon}>
                <MaterialCommunityIcons name="package-variant" size={14} color={Colors.PRIMARY} />
              </View>
              <Text style={styles.featureText} numberOfLines={1}>Premium Quality</Text>
            </View>
            <View style={styles.featureRow}>
              <View style={styles.featureIcon}>
                <MaterialCommunityIcons name="shield-check" size={14} color={Colors.PRIMARY} />
              </View>
              <Text style={styles.featureText} numberOfLines={1}>Warranty Covered</Text>
            </View>
            <View style={styles.featureRow}>
              <View style={styles.featureIcon}>
                <MaterialCommunityIcons name="truck-fast" size={14} color={Colors.PRIMARY} />
              </View>
              <Text style={styles.featureText} numberOfLines={1}>Fast Delivery</Text>
            </View>
            <View style={styles.featureRow}>
              <View style={styles.featureIcon}>
                <MaterialCommunityIcons name="cash-multiple" size={14} color={Colors.PRIMARY} />
              </View>
              <Text style={styles.featureText} numberOfLines={1}>Best Price</Text>
            </View>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.pricingRow}>
          <View style={styles.priceInfo}>
            <Text style={styles.originalPrice}>
              ₹{formatPrice(effectiveOriginalPrice)}
            </Text>
            <View style={styles.finalPriceWrapper}>
              <Text style={styles.currency}>₹</Text>
              <Text style={styles.finalPrice}>{formatPrice(price)}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.addButton, (isAdding || isAdded) && styles.disabledBtn]}
            onPress={handleAddToCart}
            disabled={isAdding || isAdded}
          >
            <LinearGradient
              colors={['#111827', '#374151']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.addBtnGradient}
            >
              {isAdding ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : isAdded ? (
                <Text style={styles.addButtonText}>✓ ADDED</Text>
              ) : (
                <Text style={styles.addButtonText}>ADD</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;