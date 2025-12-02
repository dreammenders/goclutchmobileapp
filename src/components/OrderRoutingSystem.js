import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import { Spacing } from '../constants/Spacing';

const OrderRoutingSystem = ({ orderDetails, userLocation, onProviderSelected }) => {
  const [availableProviders, setAvailableProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [routingStatus, setRoutingStatus] = useState('searching');
  const [searchRadius, setSearchRadius] = useState(5);

  // Mock provider data with real-time availability
  const mockProviders = [
    {
      id: '1',
      name: 'Rajesh Kumar',
      businessName: 'RK Auto Services',
      distance: 2.3,
      eta: 15,
      rating: 4.8,
      completedOrders: 1247,
      specialties: ['AC Service', 'Oil Change', 'Brake Repair'],
      currentLoad: 2, // Current orders
      maxCapacity: 4,
      price: 999,
      availability: 'available',
      location: { lat: 12.9716, lng: 77.5946 },
      contact: '+91 9876543210',
      certifications: ['ASE Certified', 'GoClutch Verified'],
    },
    {
      id: '2',
      name: 'Priya Sharma',
      businessName: 'Priya Car Care',
      distance: 3.1,
      eta: 22,
      rating: 4.9,
      completedOrders: 892,
      specialties: ['Detailing', 'Oil Change', 'Tire Service'],
      currentLoad: 1,
      maxCapacity: 3,
      price: 950,
      availability: 'available',
      location: { lat: 12.9756, lng: 77.5986 },
      contact: '+91 9876543211',
      certifications: ['Detailing Expert', 'GoClutch Premium'],
    },
    {
      id: '3',
      name: 'Amit Patel',
      businessName: 'Patel Motors',
      distance: 4.2,
      eta: 28,
      rating: 4.6,
      completedOrders: 2156,
      specialties: ['Major Repairs', 'Brake Service', 'Suspension'],
      currentLoad: 3,
      maxCapacity: 5,
      price: 1050,
      availability: 'busy',
      location: { lat: 12.9696, lng: 77.5886 },
      contact: '+91 9876543212',
      certifications: ['Master Technician', 'GoClutch Verified'],
    },
    {
      id: '4',
      name: 'Sneha Reddy',
      businessName: 'Reddy Auto Hub',
      distance: 5.8,
      eta: 35,
      rating: 4.7,
      completedOrders: 756,
      specialties: ['AC Service', 'Electrical', 'Diagnostics'],
      currentLoad: 0,
      maxCapacity: 2,
      price: 975,
      availability: 'available',
      location: { lat: 12.9816, lng: 77.6046 },
      contact: '+91 9876543213',
      certifications: ['Electrical Specialist', 'GoClutch Verified'],
    },
  ];

  useEffect(() => {
    // Simulate real-time provider search
    setRoutingStatus('searching');

    const searchTimer = setTimeout(() => {
      const filteredProviders = mockProviders
        .filter(provider => provider.distance <= searchRadius)
        .sort((a, b) => {
          // Sort by: availability, distance, rating, ETA
          if (a.availability !== b.availability) {
            return a.availability === 'available' ? -1 : 1;
          }
          if (a.distance !== b.distance) {
            return a.distance - b.distance;
          }
          return b.rating - a.rating;
        });

      setAvailableProviders(filteredProviders);
      setRoutingStatus('found');
    }, 2000);

    return () => clearTimeout(searchTimer);
  }, [searchRadius]);

  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case 'available': return Colors.SUCCESS;
      case 'busy': return Colors.WARNING;
      case 'offline': return Colors.ERROR;
      default: return Colors.TEXT_MUTED;
    }
  };

  const getAvailabilityText = (availability) => {
    switch (availability) {
      case 'available': return 'Available Now';
      case 'busy': return 'Busy (Can take order)';
      case 'offline': return 'Offline';
      default: return 'Checking...';
    }
  };

  const calculateMatchScore = (provider) => {
    let score = 0;

    // Distance score (closer = higher score)
    if (provider.distance <= 2) score += 30;
    else if (provider.distance <= 5) score += 20;
    else score += 10;

    // Rating score
    score += provider.rating * 10;

    // Availability score
    if (provider.availability === 'available') score += 25;
    else if (provider.availability === 'busy') score += 15;

    // Capacity score
    const capacityRatio = (provider.maxCapacity - provider.currentLoad) / provider.maxCapacity;
    score += capacityRatio * 15;

    return Math.min(100, Math.round(score));
  };

  const handleProviderSelect = (provider) => {
    setSelectedProvider(provider);
    Alert.alert(
      'Confirm Provider',
      `Select ${provider.name} from ${provider.businessName}?\n\nDistance: ${provider.distance} km\nETA: ${provider.eta} mins\nPrice: ₹${provider.price}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            onProviderSelected && onProviderSelected(provider);
            Alert.alert('Provider Selected', `${provider.name} has been assigned to your order!`);
          }
        },
      ]
    );
  };

  const handleExpandSearch = () => {
    setSearchRadius(prev => prev + 5);
  };

  const renderProviderCard = ({ item: provider }) => {
    const matchScore = calculateMatchScore(provider);
    const isRecommended = matchScore >= 85;

    return (
      <TouchableOpacity
        style={[
          styles.providerCard,
          selectedProvider?.id === provider.id && styles.providerCardSelected
        ]}
        onPress={() => handleProviderSelect(provider)}
      >
        {isRecommended && (
          <View style={styles.recommendedBadge}>
            <MaterialCommunityIcons name="star" size={14} color="#FFD700" />
            <Text style={styles.recommendedText}>Recommended</Text>
          </View>
        )}

        <View style={styles.providerHeader}>
          <View style={styles.providerInfo}>
            <Text style={styles.providerName}>{provider.name}</Text>
            <Text style={styles.businessName}>{provider.businessName}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.ratingText}>{provider.rating}</Text>
              <Text style={styles.ordersText}>({provider.completedOrders} orders)</Text>
            </View>
          </View>

          <View style={styles.matchScore}>
            <Text style={styles.matchScoreText}>{matchScore}% match</Text>
            <View style={styles.matchScoreBar}>
              <View
                style={[
                  styles.matchScoreFill,
                  { width: `${matchScore}%` },
                  matchScore >= 85 && styles.matchScoreFillHigh
                ]}
              />
            </View>
          </View>
        </View>

        <View style={styles.providerDetails}>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="map-marker-distance" size={16} color={Colors.TEXT_SECONDARY} />
            <Text style={styles.detailText}>{provider.distance} km away</Text>
            <MaterialCommunityIcons name="clock-outline" size={16} color={Colors.TEXT_SECONDARY} />
            <Text style={styles.detailText}>{provider.eta} min ETA</Text>
          </View>

          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="cash" size={16} color={Colors.SUCCESS} />
            <Text style={styles.priceText}>₹{provider.price}</Text>
            <View style={[
              styles.availabilityBadge,
              { backgroundColor: getAvailabilityColor(provider.availability) }
            ]}>
              <Text style={styles.availabilityText}>{getAvailabilityText(provider.availability)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.specialtiesContainer}>
          <Text style={styles.specialtiesTitle}>Specialties:</Text>
          <View style={styles.specialtiesList}>
            {provider.specialties.slice(0, 3).map((specialty, index) => (
              <View key={index} style={styles.specialtyTag}>
                <Text style={styles.specialtyText}>{specialty}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.certificationsContainer}>
          {provider.certifications.map((cert, index) => (
            <View key={index} style={styles.certificationBadge}>
              <MaterialCommunityIcons name="certificate" size={12} color={Colors.PRIMARY} />
              <Text style={styles.certificationText}>{cert}</Text>
            </View>
          ))}
        </View>

        <View style={styles.capacityIndicator}>
          <Text style={styles.capacityText}>
            Current load: {provider.currentLoad}/{provider.maxCapacity} orders
          </Text>
          <View style={styles.capacityBar}>
            <View
              style={[
                styles.capacityFill,
                { width: `${(provider.currentLoad / provider.maxCapacity) * 100}%` }
              ]}
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => handleProviderSelect(provider)}
        >
          <Text style={styles.selectButtonText}>Select Provider</Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.LIGHT_BACKGROUND} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="map-search" size={24} color={Colors.PRIMARY} />
        <Text style={styles.headerTitle}>Finding Best Provider</Text>
      </View>

      {routingStatus === 'searching' && (
        <View style={styles.searchingContainer}>
          <MaterialCommunityIcons name="radar" size={40} color={Colors.PRIMARY} />
          <Text style={styles.searchingText}>Searching for available providers...</Text>
          <Text style={styles.searchRadiusText}>Within {searchRadius} km radius</Text>
        </View>
      )}

      {routingStatus === 'found' && (
        <>
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsText}>
              Found {availableProviders.length} provider{availableProviders.length > 1 ? 's' : ''}
            </Text>
            <TouchableOpacity style={styles.expandSearchButton} onPress={handleExpandSearch}>
              <Text style={styles.expandSearchText}>Search farther</Text>
              <MaterialCommunityIcons name="arrow-expand" size={16} color={Colors.PRIMARY} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={availableProviders}
            renderItem={renderProviderCard}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.providersList}
          />
        </>
      )}

      {availableProviders.length === 0 && routingStatus === 'found' && (
        <View style={styles.noProvidersContainer}>
          <MaterialCommunityIcons name="map-marker-off" size={40} color={Colors.TEXT_MUTED} />
          <Text style={styles.noProvidersText}>No providers found in your area</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleExpandSearch}>
            <Text style={styles.retryButtonText}>Expand Search Area</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.PAGE_BACKGROUND,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.M,
    backgroundColor: Colors.CARD_BACKGROUND,
    borderBottomWidth: 1,
    borderBottomColor: Colors.BORDER_LIGHT,
  },
  headerTitle: {
    fontSize: Typography.HEADING_M,
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
    marginLeft: Spacing.S,
  },
  searchingContainer: {
    alignItems: 'center',
    padding: Spacing.XL,
  },
  searchingText: {
    fontSize: Typography.BODY_L,
    color: Colors.TEXT_PRIMARY,
    marginTop: Spacing.M,
    textAlign: 'center',
  },
  searchRadiusText: {
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_SECONDARY,
    marginTop: Spacing.S,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.M,
  },
  resultsText: {
    fontSize: Typography.BODY_L,
    fontWeight: '600',
    color: Colors.TEXT_PRIMARY,
  },
  expandSearchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.S,
  },
  expandSearchText: {
    fontSize: Typography.BODY_S,
    color: Colors.PRIMARY,
    marginRight: Spacing.XS,
  },
  providersList: {
    padding: Spacing.M,
  },
  providerCard: {
    backgroundColor: Colors.CARD_BACKGROUND,
    borderRadius: Spacing.BORDER_RADIUS_M,
    padding: Spacing.M,
    marginBottom: Spacing.M,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  providerCardSelected: {
    borderWidth: 2,
    borderColor: Colors.PRIMARY,
  },
  recommendedBadge: {
    position: 'absolute',
    top: Spacing.S,
    right: Spacing.S,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.WARNING,
    paddingHorizontal: Spacing.S,
    paddingVertical: Spacing.XS,
    borderRadius: Spacing.BORDER_RADIUS_S,
    zIndex: 1,
  },
  recommendedText: {
    fontSize: Typography.BODY_XS,
    color: Colors.LIGHT_BACKGROUND,
    fontWeight: '600',
    marginLeft: Spacing.XS,
  },
  providerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.M,
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: Typography.BODY_L,
    fontWeight: '600',
    color: Colors.TEXT_PRIMARY,
  },
  businessName: {
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_SECONDARY,
    marginBottom: Spacing.XS,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_SECONDARY,
    marginLeft: Spacing.XS,
  },
  ordersText: {
    fontSize: Typography.BODY_XS,
    color: Colors.TEXT_MUTED,
    marginLeft: Spacing.XS,
  },
  matchScore: {
    alignItems: 'flex-end',
  },
  matchScoreText: {
    fontSize: Typography.BODY_XS,
    color: Colors.TEXT_SECONDARY,
    marginBottom: Spacing.XS,
  },
  matchScoreBar: {
    width: 60,
    height: 4,
    backgroundColor: Colors.SECTION_BACKGROUND,
    borderRadius: 2,
  },
  matchScoreFill: {
    height: '100%',
    backgroundColor: Colors.PRIMARY,
    borderRadius: 2,
  },
  matchScoreFillHigh: {
    backgroundColor: Colors.SUCCESS,
  },
  providerDetails: {
    marginBottom: Spacing.M,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.S,
  },
  detailText: {
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_SECONDARY,
    marginLeft: Spacing.XS,
    marginRight: Spacing.M,
  },
  priceText: {
    fontSize: Typography.BODY_L,
    fontWeight: '600',
    color: Colors.SUCCESS,
    marginLeft: Spacing.XS,
  },
  availabilityBadge: {
    paddingHorizontal: Spacing.S,
    paddingVertical: Spacing.XS,
    borderRadius: Spacing.BORDER_RADIUS_S,
  },
  availabilityText: {
    fontSize: Typography.BODY_XS,
    color: Colors.LIGHT_BACKGROUND,
    fontWeight: '600',
  },
  specialtiesContainer: {
    marginBottom: Spacing.M,
  },
  specialtiesTitle: {
    fontSize: Typography.BODY_S,
    fontWeight: '600',
    color: Colors.TEXT_PRIMARY,
    marginBottom: Spacing.S,
  },
  specialtiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  specialtyTag: {
    backgroundColor: Colors.SECTION_BACKGROUND,
    paddingHorizontal: Spacing.S,
    paddingVertical: Spacing.XS,
    borderRadius: Spacing.BORDER_RADIUS_S,
    marginRight: Spacing.S,
    marginBottom: Spacing.S,
  },
  specialtyText: {
    fontSize: Typography.BODY_XS,
    color: Colors.TEXT_SECONDARY,
  },
  certificationsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Spacing.M,
  },
  certificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.PRIMARY_LIGHT,
    paddingHorizontal: Spacing.S,
    paddingVertical: Spacing.XS,
    borderRadius: Spacing.BORDER_RADIUS_S,
    marginRight: Spacing.S,
    marginBottom: Spacing.S,
  },
  certificationText: {
    fontSize: Typography.BODY_XS,
    color: Colors.PRIMARY,
    marginLeft: Spacing.XS,
  },
  capacityIndicator: {
    marginBottom: Spacing.M,
  },
  capacityText: {
    fontSize: Typography.BODY_XS,
    color: Colors.TEXT_SECONDARY,
    marginBottom: Spacing.XS,
  },
  capacityBar: {
    height: 4,
    backgroundColor: Colors.SECTION_BACKGROUND,
    borderRadius: 2,
  },
  capacityFill: {
    height: '100%',
    backgroundColor: Colors.WARNING,
    borderRadius: 2,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.PRIMARY,
    padding: Spacing.M,
    borderRadius: Spacing.BORDER_RADIUS_M,
  },
  selectButtonText: {
    fontSize: Typography.BODY_M,
    color: Colors.LIGHT_BACKGROUND,
    fontWeight: '600',
  },
  noProvidersContainer: {
    alignItems: 'center',
    padding: Spacing.XL,
  },
  noProvidersText: {
    fontSize: Typography.BODY_L,
    color: Colors.TEXT_SECONDARY,
    textAlign: 'center',
    marginTop: Spacing.M,
    marginBottom: Spacing.L,
  },
  retryButton: {
    backgroundColor: Colors.PRIMARY,
    paddingHorizontal: Spacing.L,
    paddingVertical: Spacing.M,
    borderRadius: Spacing.BORDER_RADIUS_M,
  },
  retryButtonText: {
    fontSize: Typography.BODY_M,
    color: Colors.LIGHT_BACKGROUND,
    fontWeight: '600',
  },
});

export default OrderRoutingSystem;