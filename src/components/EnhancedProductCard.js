import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
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

  return (
    <View style={styles.card}>
      {/* Left: Product Image */}
      <View style={styles.imageColumn}>
        <View style={[styles.imageGlow, { backgroundColor: `rgba(255, 122, 59, 0.08)` }]} />
        <Image source={image} style={styles.productImage} resizeMode="contain" />
      </View>

      {/* Right: Details Column */}
      <View style={styles.detailsColumn}>
        {/* Top: Title and Price */}
        <View style={styles.titleRow}>
          <Text style={styles.productName} numberOfLines={2}>
            {name}
          </Text>
          <View style={styles.priceColumn}>
            <Text style={[styles.price, { color: accentColor }]}>₹{price}</Text>
            {originalPrice && (
              <Text style={styles.originalPrice}>₹{originalPrice}</Text>
            )}
          </View>
        </View>

        {/* Rating & Offer Badge Row */}
        <View style={styles.ratingRow}>
          <View style={[styles.ratingBadge, { backgroundColor: `rgba(255, 122, 59, 0.15)` }]}>
            <Ionicons name="star" size={12} color={accentColor} />
            <Text style={[styles.rating, { color: accentColor }]}>{rating}</Text>
          </View>
          {offer && (
            <View style={[styles.offerBadge, { backgroundColor: accentColor }]}>
              <Text style={styles.offerText}>{offer}</Text>
            </View>
          )}
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
                style={[
                  styles.benefitBadge,
                  { backgroundColor: `rgba(255, 122, 59, 0.2)` },
                ]}
              >
                <Ionicons name="checkmark-circle" size={12} color={accentColor} />
                <Text style={[styles.benefitText, { color: accentColor }]}>
                  {benefit}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Membership Benefit Line */}
        {membershipBenefit && (
          <View style={[styles.membershipBenefitRow, { borderLeftColor: accentColor }]}>
            <Ionicons name="star" size={12} color={accentColor} />
            <Text style={[styles.membershipBenefitText, { color: accentColor }]}>
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
            <TouchableOpacity
              style={[styles.addToCartBtn, { backgroundColor: accentColor }]}
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
              <Ionicons name="cart" size={16} color={Colors.LIGHT_BACKGROUND} />
              <Text style={styles.addToCartLabel}>Add to Cart</Text>
            </TouchableOpacity>
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
    height: responsiveSize(130),
    marginRight: Spacing.L,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderRadius: responsiveSize(12),
    backgroundColor: 'rgba(255, 122, 59, 0.08)',
    overflow: 'hidden',
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
  detailsColumn: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: Spacing.XS,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.XS,
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
  price: {
    fontSize: Typography.BODY_L,
    fontWeight: '800',
    minWidth: 70,
    textAlign: 'right',
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
    marginBottom: Spacing.S,
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
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 122, 59, 0.5)',
  },
  offerText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.LIGHT_BACKGROUND,
    letterSpacing: 0.2,
  },
  productDescription: {
    fontSize: Typography.CAPTION,
    color: Colors.TEXT_SECONDARY,
    marginBottom: Spacing.S,
    lineHeight: 18,
    maxHeight: 36,
  },
  benefitsSection: {
    flexDirection: 'row',
    gap: Spacing.XS,
    marginBottom: Spacing.M,
    flexWrap: 'wrap',
  },
  benefitBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 122, 59, 0.4)',
  },
  benefitText: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  membershipBenefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(255, 122, 59, 0.08)',
    borderRadius: 8,
    borderLeftWidth: 3,
    marginVertical: 6,
    gap: 6,
  },
  membershipBenefitText: {
    fontSize: 11,
    fontWeight: '600',
    flex: 1,
  },
  buttonSection: {
    marginTop: 'auto',
    paddingTop: Spacing.S,
  },
  addToCartBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: Spacing.L,
    borderRadius: 10,
    gap: 6,
    shadowColor: '#FF7A3B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
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