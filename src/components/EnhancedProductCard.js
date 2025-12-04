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
import { Responsive, responsiveSize } from '../constants/Responsive';

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
  const accentColor = '#FF7A3B';
  
  const calculateDiscount = () => {
    const original = originalPrice || Math.round(price * 1.2);
    const discount = Math.round(((original - price) / original) * 100);
    return discount;
  };

  return (
    <View style={styles.card}>
      {/* Left: Product Image */}
      <View style={styles.imageColumn}>
        <View style={[styles.imageGlow, { backgroundColor: `rgba(255, 122, 59, 0.08)` }]} />
        <Image source={image} style={styles.productImage} resizeMode="contain" />
        <View style={styles.imagePriceSection}>
          <Text style={styles.imagePriceOriginal}>₹{originalPrice || Math.round(price * 1.2)}</Text>
          <Text style={[styles.imagePrice, { color: '#1a1a1a' }]}>₹{price}</Text>
          <View style={[styles.offerBadge, { backgroundColor: '#10B981' }]}>
            <Text style={styles.offerText}>{calculateDiscount()}% OFF</Text>
          </View>
        </View>
      </View>

      {/* Right: Details Column */}
      <View style={styles.detailsColumn}>
        {/* Top: Title */}
        <View style={styles.titleRow}>
          <Text style={styles.productName} numberOfLines={2}>
            {name}
          </Text>
        </View>

        {/* Description */}
        <Text style={styles.productDescription} numberOfLines={2}>
          {description}
        </Text>

        {/* Benefits Badges */}
        {benefits && benefits.length > 0 && (
          <View style={styles.benefitsSection}>
            {benefits.map((benefit) => (
              <View
                key={benefit}
                style={styles.benefitBadge}
              >
                <Ionicons name="checkmark-circle" size={12} color="#10B981" />
                <Text style={[styles.benefitText, { color: Colors.TEXT_PRIMARY }]}>
                  {benefit}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Rating & Offer Badge Row */}
        <View style={styles.ratingRow}>
          <View style={[styles.ratingBadge, { backgroundColor: `rgba(255, 122, 59, 0.15)` }]}>
            <Ionicons name="star" size={12} color={accentColor} />
            <Text style={[styles.rating, { color: accentColor }]}>{rating}</Text>
          </View>
          {benefits && benefits.length > 1 && (
            <View style={[styles.ratingBadge, { backgroundColor: `rgba(16, 185, 129, 0.15)` }]}>
              <Ionicons name="checkmark-circle" size={12} color="#10B981" />
              <Text style={[styles.rating, { color: '#10B981' }]} numberOfLines={1}>{benefits[1]}</Text>
            </View>
          )}
        </View>

        {/* Membership Benefit Line */}
        {membershipBenefit && (
          <View style={[styles.membershipBenefitRow, { borderLeftColor: '#10B981' }]}>
            <Ionicons name="star" size={12} color="#10B981" />
            <Text style={[styles.membershipBenefitText, { color: '#10B981' }]}>
              {membershipBenefit}
            </Text>
          </View>
        )}

        {/* Action Button */}
        <View style={styles.buttonSection}>
          {cartItems && cartItems[id] ? (
            <View style={[styles.quantityControl, { borderColor: accentColor }]}>
              <TouchableOpacity
                style={[
                  styles.quantityBtn,
                  { backgroundColor: `rgba(255, 122, 59, 0.1)` },
                ]}
                onPress={() => onRemoveFromCart(id)}
              >
                <Ionicons name="remove" size={14} color={accentColor} />
              </TouchableOpacity>
              <Text style={styles.quantityValue}>{cartItems[id]}</Text>
              <TouchableOpacity
                style={[
                  styles.quantityBtn,
                  { backgroundColor: `rgba(255, 122, 59, 0.1)` },
                ]}
                onPress={() => onIncrement(id)}
              >
                <Ionicons name="add" size={14} color={accentColor} />
              </TouchableOpacity>
            </View>
          ) : (
            <LinearGradient
              colors={['#FF9966', '#FF7A3B']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.addToCartBtn}
            >
              <TouchableOpacity
                style={styles.addToCartBtnContent}
                onPress={() =>
                  onAddToCart({
                    id,
                    name,
                    price,
                    image,
                    description,
                  })
                }
                activeOpacity={0.85}
              >
                <Ionicons name="cart" size={16} color="#FFFFFF" />
                <Text style={[styles.addToCartLabel, { color: '#FFFFFF' }]}>Add to Cart</Text>
              </TouchableOpacity>
            </LinearGradient>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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

export default EnhancedProductCard;