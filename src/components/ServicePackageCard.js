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
import { Colors } from '../constants/Colors';
import { useCart } from '../context/CartContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Responsive sizing based on screen width - iOS optimized
const responsiveSize = (size) => {
  const baseWidth = 375; // iPhone 6/7/8 width as base
  const isIOS = Platform.OS === 'ios';

  if (isIOS) {
    // iOS specific scaling for better text and spacing
    const scaledSize = (size * screenWidth) / baseWidth;
    // Slightly reduce sizes on smaller iPhones for better fit
    return screenWidth <= 375 ? Math.round(scaledSize * 0.95) : Math.round(scaledSize);
  } else {
    // Android and other platforms - use standard scaling
    return Math.round((size * screenWidth) / baseWidth);
  }
};

// Dynamic flex ratios and image sizes based on screen size - iOS optimized
const getColumnFlex = () => {
  const isIOS = Platform.OS === 'ios';

  if (!isIOS) {
    // Android and other platforms - use original sizing
    if (screenWidth < 360) {
      return { imageFlex: 0.35, contentFlex: 0.65, imageSize: 75 };
    } else if (screenWidth < 390) {
      return { imageFlex: 0.38, contentFlex: 0.62, imageSize: 85 };
    } else if (screenWidth < 430) {
      return { imageFlex: 0.4, contentFlex: 0.6, imageSize: 95 };
    } else {
      return { imageFlex: 0.42, contentFlex: 0.58, imageSize: 105 };
    }
  }

  // iOS specific responsive sizing for all iPhone series
  if (screenWidth <= 375) {
    // iPhone SE (1st/2nd/3rd gen), iPhone 6/7/8, iPhone X/XS/11 Pro
    return { imageFlex: 0.36, contentFlex: 0.64, imageSize: 78 };
  } else if (screenWidth <= 390) {
    // iPhone 12/13/14 mini, iPhone X/XS/11 Pro Max, iPhone XR/XS Max/11
    return { imageFlex: 0.38, contentFlex: 0.62, imageSize: 82 };
  } else if (screenWidth <= 428) {
    // iPhone 12/13/14, iPhone 12/13/14 Pro Max, iPhone 15/15 Pro
    return { imageFlex: 0.39, contentFlex: 0.61, imageSize: 86 };
  } else {
    // iPhone 15 Pro Max, iPhone 15 Plus, future larger iPhones
    return { imageFlex: 0.4, contentFlex: 0.6, imageSize: 90 };
  }
};

const ServicePackageCard = ({
  isRecommended,
  serviceTitle,
  features,
  originalPrice,
  discountedPrice,
  discountPercentage,
  imageUrl,
  promoOffer,
  onPress,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();

  // Calculate discount amount (30% of original price)
  const getDiscountAmount = () => {
    return Math.round(originalPrice * 0.3);
  };

  // Calculate final price after all discounts
  const getFinalPrice = () => {
    const discountAmount = getDiscountAmount();
    const winterOffer = 300;
    return originalPrice - discountAmount - winterOffer;
  };

  const handleAddToCart = () => {
    if (!serviceTitle || !discountedPrice) {
      return;
    }

    setIsAdding(true);

    // Add service to cart
    const serviceData = {
      id: `service_${Date.now()}`, // Unique ID for services
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
    }, 500);
  };
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* RECOMMENDED Badge */}
      {isRecommended && !serviceTitle.toLowerCase().includes('premium') && (
        <View style={styles.recommendedBadge}>
          <Text style={styles.recommendedText}>RECOMMENDED</Text>
        </View>
      )}

      {/* Main Content */}
      <View style={styles.contentWrapper}>
        {/* Image Column - Left Side */}
        <View style={styles.imageColumn}>
          {/* Image */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: imageUrl }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>

          {/* Add to Cart Button */}
          <TouchableOpacity
            style={[styles.addToCartButton, isAdding && styles.addToCartButtonDisabled]}
            onPress={handleAddToCart}
            disabled={isAdding}
            activeOpacity={0.8}
          >
            {isAdding ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <MaterialCommunityIcons name="cart-plus" size={14} color="#FFFFFF" />
                <Text style={styles.addToCartButtonText}>Add</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Content Column - Right Side */}
        <View style={styles.contentColumn}>
          {/* Service Title */}
          <Text style={styles.serviceTitle}>{serviceTitle}</Text>

          {/* Bullet Points */}
          <View style={styles.bulletContainer}>
            {features.map((feature, index) => (
              <View key={index} style={styles.bulletPoint}>
                <Text style={styles.bulletDot}>•</Text>
                <Text style={styles.bulletText}>{feature}</Text>
              </View>
            ))}
          </View>

          {/* Clean Pricing Section */}
          <View style={styles.cleanPricingSection}>
            {/* Price Display */}
            <View style={styles.priceDisplay}>
              <View style={styles.pricesContainer}>
                <Text style={styles.originalPrice}>₹{originalPrice.toLocaleString()}</Text>
                <Text style={styles.discountedPrice}>₹{discountedPrice.toLocaleString()}</Text>
              </View>
              <Text style={styles.discountInline}>{discountPercentage}% OFF</Text>
            </View>

            {/* Benefits */}
            <View style={styles.benefitsSection}>
            </View>
          </View>
        </View>
      </View>

      {/* Full Width Separator Line under pricing */}
      <View style={styles.pricingSeparator} />

      {/* Offers Row - Winter OFF and Go Clutch Coins side by side */}
      <View style={styles.offersRow}>
        <View style={styles.savingsText}>
          <MaterialCommunityIcons name="snowflake" size={responsiveSize(14)} color="#FFFFFF" />
          <Text style={styles.savingsTextContent}>Winter OFF - 200</Text>
        </View>

        <View style={styles.coinsBadge}>
          <View style={styles.coinIconContainer}>
            <MaterialCommunityIcons name="water" size={responsiveSize(14)} color="#FFFFFF" />
          </View>
          <Text style={styles.coinsText}>FREE Coolant - 1L</Text>
        </View>
      </View>

      {/* Full Width Separator Line */}
      <View style={styles.fullWidthSeparatorLine} />

      {/* Final Discounted Price */}
      <View style={styles.finalPriceContainer}>
        <Text style={styles.finalPriceText}>Final Discounted Price - 3199</Text>
      </View>

    </TouchableOpacity>
  );
};

ServicePackageCard.defaultProps = {
  isRecommended: false,
  promoOffer: null,
  onPress: () => {},
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.LIGHT_BACKGROUND,
    borderRadius: responsiveSize(16),
    borderWidth: 1,
    borderColor: '#FFA500',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: Platform.OS === 'ios' ? 0 : 5, // Remove elevation on iOS for better shadow
    marginTop: 0,
    marginBottom: responsiveSize(14),
    marginHorizontal: responsiveSize(16),
    overflow: 'hidden',
    // iOS specific shadow
    ...(Platform.OS === 'ios' && {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
    }),
  },
  recommendedBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#2ECC71',
    borderTopLeftRadius: 16,
    borderBottomRightRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 8,
    zIndex: 10,
  },
  recommendedText: {
    color: Colors.LIGHT_BACKGROUND,
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  contentWrapper: {
    flexDirection: 'row',
    padding: Platform.OS === 'ios' ? responsiveSize(12) : responsiveSize(14), // Slightly less padding on iOS
    paddingTop: Platform.OS === 'ios' ? responsiveSize(42) : responsiveSize(44), // Adjust for badge
  },
  imageColumn: {
    flex: getColumnFlex().imageFlex,
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: responsiveSize(10),
    paddingTop: responsiveSize(2), // Minimal top padding to move image up slightly
  },
  contentColumn: {
    flex: getColumnFlex().contentFlex,
    paddingLeft: responsiveSize(10),
  },
  serviceTitle: {
    fontSize: Platform.OS === 'ios' ? responsiveSize(15) : responsiveSize(16), // Slightly smaller on iOS for better fit
    fontWeight: 'bold',
    color: Colors.TEXT_PRIMARY,
    marginBottom: responsiveSize(10),
    numberOfLines: screenWidth < 390 ? 3 : 2,
    ellipsizeMode: 'tail',
  },
  bulletContainer: {
    gap: responsiveSize(8),
    marginBottom: responsiveSize(12),
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bulletDot: {
    fontSize: responsiveSize(18),
    color: Colors.TEXT_MUTED,
    marginRight: responsiveSize(8),
    lineHeight: responsiveSize(22),
  },
  bulletText: {
    fontSize: Platform.OS === 'ios' ? responsiveSize(11.5) : responsiveSize(12), // Slightly smaller on iOS
    color: Colors.TEXT_MUTED,
    flex: 1,
    lineHeight: Platform.OS === 'ios' ? responsiveSize(15) : responsiveSize(16),
    numberOfLines: screenWidth < 390 ? 3 : 2,
    ellipsizeMode: 'tail',
  },
  cleanPricingSection: {
    marginTop: responsiveSize(8),
  },
  priceDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: responsiveSize(12),
  },
  pricesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveSize(8),
  },
  originalPrice: {
    fontSize: Platform.OS === 'ios' ? responsiveSize(13) : responsiveSize(14),
    color: Colors.TEXT_MUTED,
    textDecorationLine: 'line-through',
  },
  discountedPrice: {
    fontSize: Platform.OS === 'ios' ? responsiveSize(18) : responsiveSize(20),
    fontWeight: 'bold',
    color: '#FF4500',
  },
  benefitsSection: {
    gap: responsiveSize(8),
  },

  savingsText: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2ECC71',
    paddingHorizontal: responsiveSize(12),
    paddingVertical: responsiveSize(6),
    borderRadius: responsiveSize(6),
    borderWidth: 1,
    borderColor: '#2ECC71',
    width: responsiveSize(150),
    height: responsiveSize(36),
    gap: responsiveSize(4),
    marginTop: 0,
  },
  savingsTextContent: {
    fontSize: responsiveSize(14),
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  discountInline: {
    fontSize: responsiveSize(12),
    fontWeight: 'bold',
    color: '#2ECC71',
    backgroundColor: '#E8F8F0',
    paddingHorizontal: responsiveSize(6),
    paddingVertical: responsiveSize(3),
    borderRadius: responsiveSize(4),
    borderWidth: 1,
    borderColor: '#2ECC71',
  },
  coinsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F57C00',
    paddingHorizontal: responsiveSize(12),
    paddingVertical: responsiveSize(6),
    borderRadius: responsiveSize(6),
    alignSelf: 'center',
    marginTop: 0,
    gap: responsiveSize(4),
    borderWidth: 1,
    borderColor: '#F57C00',
    width: responsiveSize(150),
    height: responsiveSize(36),
    justifyContent: 'center',
    alignItems: 'center',
  },
  coinsText: {
    fontSize: responsiveSize(11),
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  imageContainer: {
    width: getColumnFlex().imageSize,
    height: getColumnFlex().imageSize,
    borderRadius: responsiveSize(12),
    overflow: 'hidden',
    marginBottom: responsiveSize(4), // Further reduced margin for tighter spacing
  },
  image: {
    width: '100%',
    height: '100%',
  },
  addToCartButton: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: responsiveSize(6),
    paddingVertical: responsiveSize(8),
    paddingHorizontal: responsiveSize(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: responsiveSize(3),
    marginTop: responsiveSize(4),
  },
  addToCartButtonDisabled: {
    opacity: 0.7,
  },
  addToCartButtonText: {
    color: '#FFFFFF',
    fontSize: responsiveSize(11),
    fontWeight: '600',
  },
  pricingSeparator: {
    height: 2,
    backgroundColor: '#E0E0E0',
    marginVertical: responsiveSize(4),
    marginHorizontal: 0, // Full width separator
  },
  offersRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: responsiveSize(16),
    paddingVertical: responsiveSize(10),
    gap: responsiveSize(16),
  },

  finalPriceContainer: {
    backgroundColor: '#FFE4B5',
    paddingVertical: responsiveSize(6),
    paddingHorizontal: responsiveSize(10),
    borderWidth: 2,
    borderColor: '#FFA500',
    borderRadius: responsiveSize(4),
    alignItems: 'center',
  },
  finalPriceText: {
    fontSize: responsiveSize(16),
    fontWeight: '900',
    color: '#856404',
    textAlign: 'center',
  },
  coinIconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rupeeSymbol: {
    position: 'absolute',
    fontSize: responsiveSize(8),
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    top: responsiveSize(2),
  },
  fullWidthSeparatorLine: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: responsiveSize(12),
  },

});

export default ServicePackageCard;