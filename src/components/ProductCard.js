import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Colors } from '../constants/Colors';
import { Spacing } from '../constants/Spacing';
import { Typography } from '../constants/Typography';
import { Ionicons } from '@expo/vector-icons';
import { responsiveSize } from '../constants/Responsive';

const ProductCard = ({ id, name, icon, price, rating, onPress, imageUrl, discount }) => {
  const [windowWidth, setWindowWidth] = React.useState(400);
  const cardWidth = ((windowWidth || 400) - Spacing.SCREEN_HORIZONTAL * 2 - Spacing.M) / 2;

  React.useEffect(() => {
    try {
      const dims = Dimensions.get('window');
      setWindowWidth(dims && typeof dims === 'object' && dims.width ? dims.width : 400);
    } catch (error) {
      console.warn('Error getting dimensions:', error);
      setWindowWidth(400);
    }

    const subscription = Dimensions.addEventListener('change', (event) => {
      try {
        const window = event && event.window ? event.window : event;
        setWindowWidth(window && typeof window === 'object' && window.width ? window.width : 400);
      } catch (error) {
        console.warn('Error in dimensions change listener:', error);
        setWindowWidth(400);
      }
    });

    return () => subscription?.remove();
  }, []);

  const iconMap = {
    vacuum: '🧹',
    holder: '📱',
    freshener: '🌸',
    cloth: '🧽',
    wax: '✨',
    foam: '🫧',
  };

  const displayIcon = icon || iconMap[name?.toLowerCase()?.split(' ')[0]] || '🚗';

  return (
    <TouchableOpacity
      style={[styles.card, { width: cardWidth }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Image/Icon Container */}
      <View style={styles.imageContainer}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <Text style={styles.icon}>{displayIcon}</Text>
        )}
        
        {discount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{discount}%</Text>
          </View>
        )}
      </View>

      {/* Content Container */}
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {name}
        </Text>

        {/* Rating */}
        {rating && (
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={12} color={Colors.WARNING} />
            <Text style={styles.rating}>{rating}</Text>
          </View>
        )}

        {/* Price */}
        {price && (
          <Text style={styles.price}>₹{price}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.CARD_BACKGROUND,
    borderRadius: Spacing.BORDER_RADIUS_M,
    overflow: 'hidden',
    marginBottom: Spacing.M,
    marginRight: Spacing.M,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  imageContainer: {
    height: responsiveSize(140),
    backgroundColor: Colors.SECTION_BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.BORDER_LIGHT,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  icon: {
    fontSize: responsiveSize(48),
  },
  discountBadge: {
    position: 'absolute',
    top: Spacing.S,
    right: Spacing.S,
    backgroundColor: Colors.ERROR,
    borderRadius: 20,
    paddingHorizontal: Spacing.S,
    paddingVertical: Spacing.XS,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  discountText: {
    fontSize: Typography.CAPTION,
    fontWeight: '700',
    color: Colors.LIGHT_BACKGROUND,
  },
  content: {
    padding: Spacing.M,
  },
  name: {
    fontSize: Typography.BODY_S,
    fontWeight: '600',
    color: Colors.TEXT_PRIMARY,
    marginBottom: Spacing.XS,
    lineHeight: Typography.LINE_HEIGHT_NORMAL * Typography.BODY_S,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.S,
    gap: Spacing.XS,
  },
  rating: {
    fontSize: Typography.CAPTION,
    color: Colors.TEXT_SECONDARY,
    fontWeight: '500',
  },
  price: {
    fontSize: Typography.BODY_M,
    fontWeight: '700',
    color: Colors.PRIMARY,
  },
});

export default ProductCard;