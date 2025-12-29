import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { Spacing } from '../constants/Spacing';
import { Typography } from '../constants/Typography';
import { responsiveSize } from '../constants/Responsive';

const PRODUCT_GRADIENTS = [
  ['#FF6B35', '#FF8C5A'],
  ['#8B4513', '#A0522D'],
  ['#00796B', '#004D40'],
  ['#1E88E5', '#1565C0'],
  ['#EC4899', '#DB2777'],
  ['#10B981', '#059669'],
];

const getStyles = () => {
  return StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: responsiveSize(16),
    padding: Spacing.M,
    marginBottom: Spacing.M,
    overflow: 'hidden',
    backgroundColor: Colors.LIGHT_BACKGROUND,
    borderWidth: 1,
    borderColor: 'rgba(255, 122, 59, 0.12)',
    shadowColor: '#FF7A3B',
    shadowOffset: { width: 0, height: responsiveSize(4) },
    shadowOpacity: 0.1,
    shadowRadius: responsiveSize(12),
    elevation: 5,
  },
  imageColumn: {
    width: responsiveSize(130),
    marginRight: Spacing.L,
    justifyContent: 'flex-start',
    alignItems: 'center',
    position: 'relative',
  },
  imageGlow: {
    position: 'absolute',
    width: responsiveSize(160),
    height: responsiveSize(160),
    borderRadius: responsiveSize(80),
    opacity: 0.4,
  },
  productImage: {
    width: responsiveSize(130),
    height: responsiveSize(130),
  },
  imagePriceSection: {
    marginTop: Spacing.M,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  imagePrice: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1a1a1a',
  },
  imagePriceOriginal: {
    fontSize: 13,
    color: Colors.TEXT_SECONDARY,
    textDecorationLine: 'line-through',
  },
  detailsColumn: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
    gap: Spacing.M,
  },
  productName: {
    flex: 1,
    fontSize: Typography.BODY_M,
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
    lineHeight: 22,
  },
  priceColumn: {
    alignItems: 'flex-end',
  },
  originalPrice: {
    fontSize: 11,
    color: Colors.TEXT_SECONDARY,
    textDecorationLine: 'line-through',
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 4,
    marginTop: 2,
    gap: Spacing.S,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  rating: {
    fontSize: 12,
    fontWeight: '700',
  },
  offerBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: 'rgba(16, 185, 129, 0.5)',
  },
  offerText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.LIGHT_BACKGROUND,
    letterSpacing: 0.2,
  },
  productDescription: {
    fontSize: Typography.CAPTION,
    color: Colors.TEXT_SECONDARY,
    marginBottom: 4,
    lineHeight: 18,
    maxHeight: 36,
  },
  benefitsSection: {
    flexDirection: 'column',
    gap: 4,
    marginBottom: 6,
  },
  benefitBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 0,
    paddingVertical: 2,
  },
  benefitText: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  membershipBenefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderRadius: 8,
    borderLeftWidth: 3,
    marginVertical: 3,
    gap: 6,
  },
  membershipBenefitText: {
    fontSize: 11,
    fontWeight: '600',
    flex: 1,
  },
  buttonSection: {
    marginTop: 'auto',
    paddingTop: 4,
  },
  addToCartBtn: {
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#FF7A3B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  addToCartBtnContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: Spacing.L,
    gap: 6,
  },
  addToCartLabel: {
    color: Colors.LIGHT_BACKGROUND,
    fontSize: Typography.BODY_S,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.LIGHT_BACKGROUND,
    borderRadius: responsiveSize(10),
    paddingHorizontal: Spacing.M,
    paddingVertical: responsiveSize(8),
    borderWidth: 1.5,
    minHeight: responsiveSize(40),
    gap: responsiveSize(8),
  },
  quantityBtn: {
    width: responsiveSize(28),
    height: responsiveSize(28),
    borderRadius: responsiveSize(8),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 122, 59, 0.3)',
  },
  quantityValue: {
    fontSize: Typography.BODY_S,
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
    minWidth: 24,
    textAlign: 'center',
  },
  });
};

let styles = null;

if (!styles) {
  styles = getStyles();
}

const EnhancedProductCard = ({
  id,
  name,
  price,
  originalPrice,
  rating,
  image,
  description,
  benefits,
  offer,
  membershipBenefit,
  cartItems,
  onAddToCart,
  onRemoveFromCart,
  onIncrement,
}) => {
  
  const gradientIndex = id.charCodeAt(0) % PRODUCT_GRADIENTS.length;
  const gradientColors = PRODUCT_GRADIENTS[gradientIndex];
  
  const calculateDiscount = () => {
    const original = originalPrice || Math.round(price * 1.2);
    const discount = Math.round(((original - price) / original) * 100);
    return discount;
  };

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
    >
      <View style={styles.glassLayer} />
      <LinearGradient
        colors={[...gradientColors, 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBg}
      />
      
      <View style={styles.cardContent}>
        {/* Image Container */}
        <View style={styles.imageContainer}>
          <View
            style={[
              styles.imageBackdrop,
              { backgroundColor: `${gradientColors[0]}15` }
            ]}
          />
          <Image source={image} style={styles.productImage} resizeMode="contain" />
        </View>

        {/* Product Name */}
        <Text style={styles.productName} numberOfLines={2}>
          {name}
        </Text>

        {/* Price Section */}
        <View style={styles.priceSection}>
          <Text style={styles.priceOriginal}>₹{originalPrice || Math.round(price * 1.2)}</Text>
          <Text style={styles.price}>₹{price}</Text>
        </View>

        {/* Discount Badge */}
        <View style={[styles.discountBadge, { backgroundColor: gradientColors[0] }]}>
          <Text style={styles.discountText}>{calculateDiscount()}% OFF</Text>
        </View>

        {/* Rating */}
        {rating && (
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={12} color={gradientColors[0]} />
            <Text style={[styles.ratingText, { color: gradientColors[0] }]}>
              {rating}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.shimmerOverlay} />
    </TouchableOpacity>
  );
};

export default EnhancedProductCard;