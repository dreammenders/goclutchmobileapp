import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/Colors';
import { useCart } from '../context/CartContext';
import { Spacing } from '../constants/Spacing';

const { width: screenWidth } = Dimensions.get('window');

const ServicePackageCard = ({
  isRecommended = false,
  serviceTitle = 'Service Plan',
  features = [],
  originalPrice = 0,
  discountedPrice = 0,
  discountPercentage = 0,
  imageUrl = '',
  sessionalOffIcon = null,
  sessionalOffPrice = 0,
  sessionalOffText = '',
  sessionalOffProduct = null,
  sessionalOffProductIcon = null,
  onPress,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const { addToCart } = useCart();

  const formatPrice = (price) => {
    try {
      const num = Number(price) || 0;
      return isNaN(num) ? '0' : num.toLocaleString();
    } catch (err) {
      return '0';
    }
  };

  const getFinalPrice = () => {
    try {
      const discounted = Number(discountedPrice) || 0;
      const sessionalOff = Number(sessionalOffPrice) || 0;
      const finalPrice = Math.max(0, discounted - sessionalOff);
      return isNaN(finalPrice) ? 0 : finalPrice;
    } catch (err) {
      return 0;
    }
  };

  const featureIcons = {
    'inspection': 'magnify',
    'service': 'wrench',
    'maintenance': 'tools',
    'check': 'check-circle',
    'free': 'gift',
    'warranty': 'shield-check',
    'support': 'headset',
    'delivery': 'truck',
    'pickup': 'car-estate',
    'certified': 'check-decagram',
    'expert': 'account-star',
    'quality': 'star-check',
    'genuine': 'certificate',
    'speedometer': 'speedometer',
    'clock': 'clock',
  };

  const getFeatureIcon = (feature, index) => {
    if (index === 0) return 'speedometer';
    if (index === 1) return 'clock';
    const featureLower = String(feature || '').toLowerCase();
    for (const [key, icon] of Object.entries(featureIcons)) {
      if (featureLower.includes(key)) return icon;
    }
    return 'check-circle-outline';
  };

  const handleAddToCart = () => {
    if (!serviceTitle || !discountedPrice) return;
    setIsAdding(true);
    const serviceData = {
      id: `service_${Date.now()}`,
      name: serviceTitle,
      price: discountedPrice,
      originalPrice: originalPrice,
      type: 'service',
      image: imageUrl ? { uri: imageUrl } : null,
      description: features.join(', '),
    };
    addToCart(serviceData);
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
      {/* 1. Main Content Block */}
      <View style={styles.mainContent}>

        {/* Header: Title & Badges */}
        <View style={styles.header}>
          <View style={styles.titleColumn}>
            <Text style={styles.serviceTitle}>{serviceTitle}</Text>
            {isRecommended && (
              <View style={styles.recommendedTag}>
                <Text style={styles.recommendedText}>MOST POPULAR</Text>
              </View>
            )}
          </View>
          {Number(discountPercentage) > 0 && (
            <LinearGradient
              colors={['#EF4444', '#DC2626']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.discountBadge}
            >
              <Text style={styles.discountText}>{Number(discountPercentage)}% OFF</Text>
            </LinearGradient>
          )}
        </View>

        {/* Body: Image & Features */}
        <View style={styles.body}>
          {/* Left: Enhanced Image */}
          <View style={styles.imageSection}>
            <View style={styles.imageFrame}>
              <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
            </View>
          </View>

          {/* Right: Feature List (Strict Vertical) */}
          <View style={styles.featureSection}>
            {features.slice(0, 4).map((feature, index) => (
              <View key={index} style={styles.featureRow}>
                <MaterialCommunityIcons
                  name={getFeatureIcon(feature, index)}
                  size={14}
                  color={Colors.PRIMARY}
                />
                <Text style={styles.featureText} numberOfLines={1}>{feature}</Text>
              </View>
            ))}
            {features.length > 4 && (
              <Text style={styles.moreText}>+ {features.length - 4} more benefits</Text>
            )}
          </View>
        </View>

        <View style={styles.divider} />

        {/* Pricing & Add Action */}
        <View style={styles.pricingRow}>
          <View style={styles.priceInfo}>
            <Text style={styles.originalPrice}>₹{formatPrice(originalPrice)}</Text>
            <View style={styles.finalPriceWrapper}>
              <Text style={styles.currency}>₹</Text>
              <Text style={styles.finalPrice}>{formatPrice(getFinalPrice())}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.addButton, (isAdding || isAdded) && styles.disabledBtn]}
            onPress={handleAddToCart}
            disabled={isAdding || isAdded}
          >
            <LinearGradient
              colors={['#111827', '#374151']} // Elegant Dark Button
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

      {/* 2. Full Width Footer - Seasonal Offers */}
      {(!!sessionalOffText || !!sessionalOffProduct) && (
        <LinearGradient
          colors={['#F0FDF4', '#DCFCE7']} // Fresh Green Gradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.footer}
        >
          <View style={styles.footerContent}>
            {/* Seasonal Text */}
            {!!sessionalOffText && (
              <View style={styles.footerItem}>
                <View style={styles.iconCircle}>
                  <MaterialCommunityIcons name={sessionalOffIcon || "party-popper"} size={12} color="#059669" />
                </View>
                <Text style={styles.footerText}>
                  <Text style={styles.footerTextLabel}>{sessionalOffText}</Text>
                  {Number(sessionalOffPrice) > 0 && (
                    <Text style={styles.footerPrice}> ₹{sessionalOffPrice}</Text>
                  )}
                </Text>
              </View>
            )}

            {/* Spacer if both exist */}
            {(!!sessionalOffText && !!sessionalOffProduct) && <View style={styles.footerDivider} />}

            {/* Free Product */}
            {!!sessionalOffProduct && (
              <View style={styles.footerItem}>
                <View style={[styles.iconCircle, styles.purpleCircle]}>
                  <MaterialCommunityIcons name={sessionalOffProductIcon || "gift"} size={12} color="#7C3AED" />
                </View>
                <Text style={styles.footerText}>
                  <Text style={[styles.footerTextLabel, { color: '#6D28D9' }]}>{sessionalOffProduct}</Text>
                </Text>
              </View>
            )}
          </View>
        </LinearGradient>
      )}

      {/* 3. Final Price Bar */}
      <View style={styles.finalPriceBar}>
        <View style={styles.finalPriceLabelContainer}>
          <MaterialCommunityIcons name="ticket-percent-outline" size={18} color="#B91C1C" />
          <Text style={styles.finalPriceLabel}>Final Price Get at</Text>
        </View>
        <Text style={styles.finalPriceValue}>₹{formatPrice(getFinalPrice())}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: Spacing.SCREEN_HORIZONTAL,
    marginBottom: 20,
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
  serviceTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F2937',
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  recommendedTag: {
    backgroundColor: '#FEF3C7',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  recommendedText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#D97706',
    letterSpacing: 0.5,
  },
  discountBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    // Gradient handles background
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
  },
  image: {
    width: '100%',
    height: '100%',
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
  featureText: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '500',
    marginLeft: 8,
    flex: 1,
  },
  moreText: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '600',
    marginLeft: 22, // aligned with text
    marginTop: 2,
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
  footer: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#A7F3D0',
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  iconCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
    shadowColor: "#059669",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  purpleCircle: {
    shadowColor: "#7C3AED",
  },
  footerText: {
    fontSize: 12,
    color: '#065F46',
    fontWeight: '500',
  },
  footerTextLabel: {
    fontWeight: '700',
    color: '#047857',
  },
  footerPrice: {
    fontWeight: '800',
    color: '#059669',
  },
  footerDivider: {
    width: 1,
    height: 14,
    backgroundColor: '#34D399',
    marginRight: 16,
  },
  finalPriceBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#FEF2F2',
    borderTopWidth: 1,
    borderTopColor: '#FECACA',
  },
  finalPriceLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  finalPriceLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#B91C1C',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  finalPriceValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#B91C1C',
    letterSpacing: -0.5,
  },
});

export default ServicePackageCard;