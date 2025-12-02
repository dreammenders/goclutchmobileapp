import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import { Spacing } from '../constants/Spacing';
import { useCart } from '../context/CartContext';

const SmartCartNudges = ({ onAddSuggestion, currentOrderValue = 0 }) => {
  const { cartItems, addToCart } = useCart();

  // Mock cart items for demonstration
  const mockCartItems = [
    { id: '1', name: 'AC Service', category: 'maintenance', price: 999 },
    { id: '2', name: 'Oil Change', category: 'maintenance', price: 650 },
  ];

  const cartServices = mockCartItems; // In real app, get from cart context

  // Smart suggestions based on cart contents and order value
  const suggestions = useMemo(() => {
    const suggestions = [];

    // Complementary service suggestions
    if (cartServices.some(service => service.category === 'maintenance')) {
      suggestions.push({
        id: 'complement_1',
        type: 'complementary',
        title: 'Add Car Wash & Wax',
        subtitle: 'Complete your maintenance with professional detailing',
        price: 399,
        originalPrice: 500,
        discount: 20,
        image: 'https://via.placeholder.com/80x80/6366F1/FFFFFF?text=WASH',
        reason: 'Often booked with maintenance services',
        urgency: 'Popular combo',
      });
    }

    // Upsell suggestions based on order value
    if (currentOrderValue < 2000) {
      suggestions.push({
        id: 'upsell_1',
        type: 'upsell',
        title: 'Upgrade to Premium Oil Filter',
        subtitle: 'Better filtration and longer life',
        price: 150,
        image: 'https://via.placeholder.com/80x80/10B981/FFFFFF?text=FILTER',
        reason: 'Add ₹150 for premium quality',
        urgency: 'Limited time offer',
      });
    }

    // Bundle suggestions
    if (cartServices.length >= 2) {
      suggestions.push({
        id: 'bundle_1',
        type: 'bundle',
        title: 'Complete Car Care Package',
        subtitle: 'Save 15% on bundled services',
        price: Math.round((currentOrderValue * 0.85) - currentOrderValue),
        savings: Math.round(currentOrderValue * 0.15),
        image: 'https://via.placeholder.com/80x80/FE5110/FFFFFF?text=PACKAGE',
        reason: 'Bundle discount applied',
        urgency: 'Save ₹' + Math.round(currentOrderValue * 0.15),
      });
    }

    // Frequently bought together
    suggestions.push({
      id: 'fbt_1',
      type: 'frequently_bought',
      title: 'Air Filter Replacement',
      subtitle: 'Essential for engine health',
      price: 280,
      image: 'https://via.placeholder.com/80x80/EF4444/FFFFFF?text=AIR',
      reason: '92% of customers also buy this',
      urgency: 'Essential service',
    });

    return suggestions.slice(0, 3); // Show max 3 suggestions
  }, [cartServices, currentOrderValue]);

  const handleAddSuggestion = (suggestion) => {
    // In real app, this would add the suggested item to cart
    addToCart({
      id: suggestion.id,
      name: suggestion.title,
      price: suggestion.price,
      discountPrice: suggestion.price,
    });

    if (onAddSuggestion) {
      onAddSuggestion(suggestion);
    }
  };

  const getSuggestionIcon = (type) => {
    switch (type) {
      case 'complementary': return 'lightbulb-on';
      case 'upsell': return 'trending-up';
      case 'bundle': return 'package-variant';
      case 'frequently_bought': return 'cart-plus';
      default: return 'star';
    }
  };

  const getSuggestionColor = (type) => {
    switch (type) {
      case 'complementary': return '#6366F1';
      case 'upsell': return '#10B981';
      case 'bundle': return '#FE5110';
      case 'frequently_bought': return '#F59E0B';
      default: return Colors.PRIMARY;
    }
  };

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="lightbulb-on" size={20} color={Colors.PRIMARY} />
        <Text style={styles.headerTitle}>Smart Suggestions</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.suggestionsContainer}
      >
        {suggestions.map((suggestion) => (
          <TouchableOpacity
            key={suggestion.id}
            style={styles.suggestionCard}
            onPress={() => handleAddSuggestion(suggestion)}
          >
            <View style={styles.suggestionImageContainer}>
              <Image source={{ uri: suggestion.image }} style={styles.suggestionImage} />
              <View style={[styles.suggestionTypeBadge, { backgroundColor: getSuggestionColor(suggestion.type) }]}>
                <MaterialCommunityIcons
                  name={getSuggestionIcon(suggestion.type)}
                  size={12}
                  color={Colors.LIGHT_BACKGROUND}
                />
              </View>
            </View>

            <View style={styles.suggestionContent}>
              <Text style={styles.suggestionTitle} numberOfLines={2}>
                {suggestion.title}
              </Text>
              <Text style={styles.suggestionSubtitle} numberOfLines={2}>
                {suggestion.subtitle}
              </Text>

              <View style={styles.suggestionFooter}>
                <View style={styles.priceContainer}>
                  {suggestion.originalPrice && (
                    <Text style={styles.originalPrice}>₹{suggestion.originalPrice}</Text>
                  )}
                  <Text style={styles.suggestionPrice}>
                    {suggestion.savings ? `Save ₹${suggestion.savings}` : `₹${suggestion.price}`}
                  </Text>
                </View>

                <View style={styles.reasonContainer}>
                  <Text style={styles.reasonText}>{suggestion.reason}</Text>
                  {suggestion.urgency && (
                    <Text style={[styles.urgencyText, { color: getSuggestionColor(suggestion.type) }]}>
                      {suggestion.urgency}
                    </Text>
                  )}
                </View>
              </View>

              <TouchableOpacity
                style={[styles.addButton, { backgroundColor: getSuggestionColor(suggestion.type) }]}
                onPress={() => handleAddSuggestion(suggestion)}
              >
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.CARD_BACKGROUND,
    margin: Spacing.M,
    borderRadius: Spacing.BORDER_RADIUS_M,
    padding: Spacing.M,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.M,
  },
  headerTitle: {
    fontSize: Typography.BODY_L,
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
    marginLeft: Spacing.S,
  },
  suggestionsContainer: {
    paddingRight: Spacing.M,
  },
  suggestionCard: {
    backgroundColor: Colors.LIGHT_BACKGROUND,
    borderRadius: Spacing.BORDER_RADIUS_M,
    width: 200,
    marginRight: Spacing.M,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  suggestionImageContainer: {
    position: 'relative',
  },
  suggestionImage: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
  },
  suggestionTypeBadge: {
    position: 'absolute',
    top: Spacing.S,
    right: Spacing.S,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggestionContent: {
    padding: Spacing.M,
  },
  suggestionTitle: {
    fontSize: Typography.BODY_M,
    fontWeight: '600',
    color: Colors.TEXT_PRIMARY,
    marginBottom: Spacing.XS,
  },
  suggestionSubtitle: {
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_SECONDARY,
    marginBottom: Spacing.M,
  },
  suggestionFooter: {
    marginBottom: Spacing.M,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.XS,
  },
  suggestionPrice: {
    fontSize: Typography.BODY_M,
    fontWeight: '700',
    color: Colors.PRIMARY,
  },
  originalPrice: {
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_MUTED,
    textDecorationLine: 'line-through',
    marginRight: Spacing.S,
  },
  reasonContainer: {
    marginBottom: Spacing.S,
  },
  reasonText: {
    fontSize: Typography.BODY_XS,
    color: Colors.TEXT_SECONDARY,
    marginBottom: Spacing.XS,
  },
  urgencyText: {
    fontSize: Typography.BODY_XS,
    fontWeight: '600',
  },
  addButton: {
    borderRadius: Spacing.BORDER_RADIUS_S,
    paddingHorizontal: Spacing.M,
    paddingVertical: Spacing.S,
    alignSelf: 'flex-start',
  },
  addButtonText: {
    fontSize: Typography.BODY_S,
    color: Colors.LIGHT_BACKGROUND,
    fontWeight: '600',
  },
});

export default SmartCartNudges;