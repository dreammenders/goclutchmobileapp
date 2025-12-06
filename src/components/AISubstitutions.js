import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import { Spacing } from '../constants/Spacing';
import { useCart } from '../context/CartContext';

const AISubstitutions = ({ unavailableService, onAcceptSubstitution, onDeclineSubstitution }) => {
  const { addToCart, removeProductFromCart } = useCart();
  const [selectedSubstitution, setSelectedSubstitution] = useState(null);

  // Mock AI-driven substitution logic
  const substitutions = useMemo(() => {
    if (!unavailableService) return [];

    const serviceType = unavailableService.category || 'maintenance';
    const priceRange = unavailableService.price;

    const baseSubstitutions = {
      maintenance: [
        {
          id: 'sub_1',
          name: 'Premium Oil Change Package',
          originalService: unavailableService.name,
          price: Math.round(priceRange * 1.2),
          discountPrice: Math.round(priceRange * 0.95),
          savings: Math.round(priceRange * 0.25),
          reason: 'Includes premium synthetic oil and advanced filtration',
          confidence: 95,
          features: ['Premium synthetic oil', 'Advanced oil filter', 'Fluid top-up', 'Performance check'],
          estimatedTime: '45 mins',
          aiReasoning: 'Based on your vehicle type and service history, this premium package offers better long-term performance.',
        },
        {
          id: 'sub_2',
          name: 'Basic Oil Change + Filter',
          originalService: unavailableService.name,
          price: Math.round(priceRange * 0.9),
          discountPrice: Math.round(priceRange * 0.8),
          savings: Math.round(priceRange * 0.1),
          reason: 'Essential oil change with basic filtration',
          confidence: 88,
          features: ['Standard oil change', 'Basic oil filter', 'Fluid check'],
          estimatedTime: '30 mins',
          aiReasoning: 'A cost-effective alternative that maintains essential vehicle maintenance.',
        },
      ],
      repair: [
        {
          id: 'sub_3',
          name: 'Comprehensive Brake Service',
          originalService: unavailableService.name,
          price: Math.round(priceRange * 1.3),
          discountPrice: Math.round(priceRange * 1.1),
          savings: Math.round(priceRange * 0.2),
          reason: 'Complete brake system overhaul with premium parts',
          confidence: 92,
          features: ['Brake pad replacement', 'Rotor resurfacing', 'Brake fluid flush', 'Safety inspection'],
          estimatedTime: '2 hours',
          aiReasoning: 'Recommended for safety-critical systems. Includes additional safety checks.',
        },
        {
          id: 'sub_4',
          name: 'Emergency Brake Repair',
          originalService: unavailableService.name,
          price: Math.round(priceRange * 0.8),
          discountPrice: Math.round(priceRange * 0.7),
          savings: Math.round(priceRange * 0.1),
          reason: 'Essential brake repairs only',
          confidence: 85,
          features: ['Brake pad replacement', 'Basic rotor check', 'Emergency repair'],
          estimatedTime: '1.5 hours',
          aiReasoning: 'Prioritizes safety with essential repairs at a reduced scope.',
        },
      ],
      detailing: [
        {
          id: 'sub_5',
          name: 'Complete Car Spa Package',
          originalService: unavailableService.name,
          price: Math.round(priceRange * 1.4),
          discountPrice: Math.round(priceRange * 1.2),
          savings: Math.round(priceRange * 0.2),
          reason: 'Full exterior and interior detailing service',
          confidence: 90,
          features: ['Exterior wash & wax', 'Interior cleaning', 'Dashboard polish', 'Tire shine'],
          estimatedTime: '3 hours',
          aiReasoning: 'Comprehensive service that exceeds the original request with additional detailing.',
        },
      ],
    };

    return baseSubstitutions[serviceType] || baseSubstitutions.maintenance;
  }, [unavailableService]);

  const handleAcceptSubstitution = (substitution) => {
    Alert.alert(
      'Accept Substitution',
      `Replace "${unavailableService.name}" with "${substitution.name}"?\n\nSave ₹${substitution.savings}!`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept',
          onPress: () => {
            // Remove original unavailable service
            removeProductFromCart(unavailableService.id);

            // Add substitution
            addToCart({
              id: substitution.id,
              name: substitution.name,
              price: substitution.discountPrice,
              discountPrice: substitution.discountPrice,
              category: unavailableService.category,
            });

            Alert.alert('Substitution Added', `${substitution.name} has been added to your cart!`);
            onAcceptSubstitution && onAcceptSubstitution(substitution);
          }
        },
      ]
    );
  };

  const handleDeclineAll = () => {
    Alert.alert(
      'Remove Unavailable Service',
      'Would you like to remove the unavailable service from your cart?',
      [
        { text: 'Keep in Cart', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            removeProductFromCart(unavailableService.id);
            onDeclineSubstitution && onDeclineSubstitution();
          }
        },
      ]
    );
  };

  if (!unavailableService || substitutions.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="brain" size={24} color={Colors.PRIMARY} />
        <Text style={styles.headerTitle}>Smart Substitution</Text>
      </View>

      <View style={styles.unavailableNotice}>
        <MaterialCommunityIcons name="alert-circle" size={20} color={Colors.WARNING} />
        <Text style={styles.unavailableText}>
          "{unavailableService.name}" is currently unavailable
        </Text>
      </View>

      <Text style={styles.aiSuggestion}>
        Our AI suggests these alternatives based on your needs:
      </Text>

      {substitutions.map((substitution) => (
        <TouchableOpacity
          key={substitution.id}
          style={[
            styles.substitutionCard,
            selectedSubstitution?.id === substitution.id && styles.substitutionCardSelected
          ]}
          onPress={() => setSelectedSubstitution(substitution)}
        >
          <View style={styles.substitutionHeader}>
            <View style={styles.substitutionInfo}>
              <Text style={styles.substitutionName}>{substitution.name}</Text>
              <View style={styles.priceContainer}>
                <Text style={styles.discountPrice}>₹{substitution.discountPrice}</Text>
                <Text style={styles.originalPrice}>₹{substitution.price}</Text>
                <View style={styles.savingsBadge}>
                  <Text style={styles.savingsText}>Save ₹{substitution.savings}</Text>
                </View>
              </View>
            </View>
            <View style={styles.confidenceContainer}>
              <Text style={styles.confidenceText}>{substitution.confidence}% match</Text>
              <View style={styles.confidenceBar}>
                <View
                  style={[
                    styles.confidenceFill,
                    { width: `${substitution.confidence}%` }
                  ]}
                />
              </View>
            </View>
          </View>

          <Text style={styles.substitutionReason}>{substitution.reason}</Text>

          <View style={styles.featuresContainer}>
            {Array.isArray(substitution.features) && substitution.features.length > 0 ? (
              substitution.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <MaterialCommunityIcons name="check" size={14} color={Colors.SUCCESS} />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))
            ) : null}
          </View>

          <View style={styles.substitutionFooter}>
            <View style={styles.timeContainer}>
              <MaterialCommunityIcons name="clock-outline" size={16} color={Colors.TEXT_SECONDARY} />
              <Text style={styles.timeText}>{substitution.estimatedTime}</Text>
            </View>
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={() => handleAcceptSubstitution(substitution)}
            >
              <Text style={styles.acceptButtonText}>Accept</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.aiReasoning}>
            🤖 {substitution.aiReasoning}
          </Text>
        </TouchableOpacity>
      ))}

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.declineButton}
          onPress={handleDeclineAll}
        >
          <Text style={styles.declineButtonText}>Remove Unavailable Service</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.keepButton}
          onPress={onDeclineSubstitution}
        >
          <Text style={styles.keepButtonText}>Keep for Later</Text>
        </TouchableOpacity>
      </View>
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
  unavailableNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.WARNING_LIGHT,
    padding: Spacing.S,
    borderRadius: Spacing.BORDER_RADIUS_S,
    marginBottom: Spacing.M,
  },
  unavailableText: {
    fontSize: Typography.BODY_S,
    color: Colors.WARNING_DARK,
    marginLeft: Spacing.S,
    fontWeight: '600',
  },
  aiSuggestion: {
    fontSize: Typography.BODY_M,
    color: Colors.TEXT_SECONDARY,
    marginBottom: Spacing.M,
  },
  substitutionCard: {
    backgroundColor: Colors.LIGHT_BACKGROUND,
    borderRadius: Spacing.BORDER_RADIUS_M,
    padding: Spacing.M,
    marginBottom: Spacing.M,
    borderWidth: 2,
    borderColor: Colors.BORDER_LIGHT,
  },
  substitutionCardSelected: {
    borderColor: Colors.PRIMARY,
    backgroundColor: Colors.PRIMARY_LIGHT,
  },
  substitutionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.S,
  },
  substitutionInfo: {
    flex: 1,
  },
  substitutionName: {
    fontSize: Typography.BODY_L,
    fontWeight: '600',
    color: Colors.TEXT_PRIMARY,
    marginBottom: Spacing.XS,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.S,
  },
  discountPrice: {
    fontSize: Typography.BODY_L,
    fontWeight: '700',
    color: Colors.PRIMARY,
    marginRight: Spacing.S,
  },
  originalPrice: {
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_MUTED,
    textDecorationLine: 'line-through',
  },
  savingsBadge: {
    backgroundColor: Colors.SUCCESS,
    paddingHorizontal: Spacing.S,
    paddingVertical: Spacing.XS,
    borderRadius: Spacing.BORDER_RADIUS_S,
    marginLeft: Spacing.S,
  },
  savingsText: {
    fontSize: Typography.BODY_XS,
    color: Colors.LIGHT_BACKGROUND,
    fontWeight: '600',
  },
  confidenceContainer: {
    alignItems: 'flex-end',
  },
  confidenceText: {
    fontSize: Typography.BODY_XS,
    color: Colors.TEXT_SECONDARY,
    marginBottom: Spacing.XS,
  },
  confidenceBar: {
    width: 60,
    height: 4,
    backgroundColor: Colors.SECTION_BACKGROUND,
    borderRadius: 2,
  },
  confidenceFill: {
    height: '100%',
    backgroundColor: Colors.PRIMARY,
    borderRadius: 2,
  },
  substitutionReason: {
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_SECONDARY,
    fontStyle: 'italic',
    marginBottom: Spacing.M,
  },
  featuresContainer: {
    marginBottom: Spacing.M,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.XS,
  },
  featureText: {
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_SECONDARY,
    marginLeft: Spacing.S,
  },
  substitutionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.S,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_SECONDARY,
    marginLeft: Spacing.S,
  },
  acceptButton: {
    backgroundColor: Colors.PRIMARY,
    paddingHorizontal: Spacing.M,
    paddingVertical: Spacing.S,
    borderRadius: Spacing.BORDER_RADIUS_S,
  },
  acceptButtonText: {
    fontSize: Typography.BODY_S,
    color: Colors.LIGHT_BACKGROUND,
    fontWeight: '600',
  },
  aiReasoning: {
    fontSize: Typography.BODY_XS,
    color: Colors.TEXT_MUTED,
    fontStyle: 'italic',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.M,
  },
  declineButton: {
    flex: 1,
    backgroundColor: Colors.ERROR,
    paddingVertical: Spacing.M,
    borderRadius: Spacing.BORDER_RADIUS_M,
    marginRight: Spacing.S,
  },
  declineButtonText: {
    fontSize: Typography.BODY_M,
    color: Colors.LIGHT_BACKGROUND,
    fontWeight: '600',
    textAlign: 'center',
  },
  keepButton: {
    flex: 1,
    backgroundColor: Colors.SECTION_BACKGROUND,
    paddingVertical: Spacing.M,
    borderRadius: Spacing.BORDER_RADIUS_M,
    marginLeft: Spacing.S,
  },
  keepButtonText: {
    fontSize: Typography.BODY_M,
    color: Colors.TEXT_SECONDARY,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default AISubstitutions;