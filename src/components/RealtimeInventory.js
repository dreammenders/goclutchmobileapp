import React, { useState, useEffect } from 'react';
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

const RealtimeInventory = ({ serviceId, onAvailabilityChange }) => {
  const [availability, setAvailability] = useState('checking');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [nearbyProviders, setNearbyProviders] = useState([]);

  // Mock real-time inventory data
  const mockInventoryData = {
    '1': { status: 'available', providers: 3, nextSlot: '2:00 PM' },
    '2': { status: 'limited', providers: 1, nextSlot: '4:30 PM' },
    '3': { status: 'available', providers: 5, nextSlot: 'Immediate' },
    '4': { status: 'unavailable', providers: 0, nextSlot: 'Tomorrow' },
    '5': { status: 'available', providers: 2, nextSlot: '1:00 PM' },
  };

  useEffect(() => {
    // Simulate real-time updates
    const checkAvailability = () => {
      const data = mockInventoryData[serviceId] || { status: 'checking', providers: 0 };
      setAvailability(data.status);
      setNearbyProviders(Array.from({ length: data.providers }, (_, i) => ({
        id: i + 1,
        name: `Provider ${i + 1}`,
        distance: `${(i + 1) * 2} km`,
        eta: `${(i + 1) * 15} mins`,
        rating: 4.5 + Math.random() * 0.5,
      })));
      setLastUpdated(new Date());

      if (onAvailabilityChange) {
        onAvailabilityChange(data.status);
      }
    };

    checkAvailability();

    // Update every 30 seconds to simulate real-time sync
    const interval = setInterval(checkAvailability, 30000);

    return () => clearInterval(interval);
  }, [serviceId]);

  const getAvailabilityColor = (status) => {
    switch (status) {
      case 'available': return Colors.SUCCESS;
      case 'limited': return Colors.WARNING;
      case 'unavailable': return Colors.ERROR;
      case 'checking': return Colors.TEXT_MUTED;
      default: return Colors.TEXT_MUTED;
    }
  };

  const getAvailabilityIcon = (status) => {
    switch (status) {
      case 'available': return 'check-circle';
      case 'limited': return 'clock-outline';
      case 'unavailable': return 'close-circle';
      case 'checking': return 'sync';
      default: return 'help-circle';
    }
  };

  const getAvailabilityText = (status) => {
    switch (status) {
      case 'available': return 'Available Now';
      case 'limited': return 'Limited Slots';
      case 'unavailable': return 'Currently Unavailable';
      case 'checking': return 'Checking Availability...';
      default: return 'Status Unknown';
    }
  };

  const handleProviderSelect = (provider) => {
    Alert.alert(
      'Select Provider',
      `Book with ${provider.name}? (${provider.distance} away, ${provider.eta} ETA)`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Book Now', onPress: () => {/* Handle booking */} },
      ]
    );
  };

  if (availability === 'checking') {
    return (
      <View style={styles.container}>
        <View style={styles.statusContainer}>
          <MaterialCommunityIcons
            name={getAvailabilityIcon(availability)}
            size={20}
            color={getAvailabilityColor(availability)}
          />
          <Text style={[styles.statusText, { color: getAvailabilityColor(availability) }]}>
            {getAvailabilityText(availability)}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.statusContainer}>
        <MaterialCommunityIcons
          name={getAvailabilityIcon(availability)}
          size={20}
          color={getAvailabilityColor(availability)}
        />
        <Text style={[styles.statusText, { color: getAvailabilityColor(availability) }]}>
          {getAvailabilityText(availability)}
        </Text>
        <Text style={styles.lastUpdated}>
          Updated {lastUpdated.toLocaleTimeString()}
        </Text>
      </View>

      {nearbyProviders.length > 0 && (
        <View style={styles.providersContainer}>
          <Text style={styles.providersTitle}>
            {nearbyProviders.length} provider{nearbyProviders.length > 1 ? 's' : ''} nearby
          </Text>
          {nearbyProviders.slice(0, 3).map((provider) => (
            <TouchableOpacity
              key={provider.id}
              style={styles.providerRow}
              onPress={() => handleProviderSelect(provider)}
            >
              <View style={styles.providerInfo}>
                <Text style={styles.providerName}>{provider.name}</Text>
                <Text style={styles.providerDetails}>
                  {provider.distance} • {provider.eta} ETA
                </Text>
              </View>
              <View style={styles.providerRating}>
                <MaterialCommunityIcons name="star" size={14} color="#FFD700" />
                <Text style={styles.ratingText}>{provider.rating.toFixed(1)}</Text>
              </View>
              <MaterialCommunityIcons
                name="chevron-right"
                size={20}
                color={Colors.TEXT_MUTED}
              />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {availability === 'limited' && (
        <View style={styles.warningContainer}>
          <MaterialCommunityIcons name="alert-circle" size={16} color={Colors.WARNING} />
          <Text style={styles.warningText}>
            Only {nearbyProviders.length} slot{nearbyProviders.length > 1 ? 's' : ''} left today
          </Text>
        </View>
      )}

      {availability === 'unavailable' && (
        <View style={styles.unavailableContainer}>
          <MaterialCommunityIcons name="calendar-clock" size={16} color={Colors.TEXT_SECONDARY} />
          <Text style={styles.unavailableText}>
            Next available slot: Tomorrow at 9:00 AM
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.CARD_BACKGROUND,
    borderRadius: Spacing.BORDER_RADIUS_M,
    padding: Spacing.M,
    margin: Spacing.M,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.S,
  },
  statusText: {
    fontSize: Typography.BODY_M,
    fontWeight: '600',
    marginLeft: Spacing.S,
    flex: 1,
  },
  lastUpdated: {
    fontSize: Typography.BODY_XS,
    color: Colors.TEXT_MUTED,
  },
  providersContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.BORDER_LIGHT,
    paddingTop: Spacing.M,
  },
  providersTitle: {
    fontSize: Typography.BODY_S,
    fontWeight: '600',
    color: Colors.TEXT_PRIMARY,
    marginBottom: Spacing.S,
  },
  providerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.S,
    borderBottomWidth: 1,
    borderBottomColor: Colors.BORDER_LIGHT,
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: Typography.BODY_M,
    fontWeight: '600',
    color: Colors.TEXT_PRIMARY,
  },
  providerDetails: {
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_SECONDARY,
    marginTop: Spacing.XS,
  },
  providerRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Spacing.S,
  },
  ratingText: {
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_SECONDARY,
    marginLeft: Spacing.XS,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.WARNING_LIGHT,
    padding: Spacing.S,
    borderRadius: Spacing.BORDER_RADIUS_S,
    marginTop: Spacing.S,
  },
  warningText: {
    fontSize: Typography.BODY_S,
    color: Colors.WARNING_DARK,
    marginLeft: Spacing.S,
  },
  unavailableContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.SECTION_BACKGROUND,
    padding: Spacing.S,
    borderRadius: Spacing.BORDER_RADIUS_S,
    marginTop: Spacing.S,
  },
  unavailableText: {
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_SECONDARY,
    marginLeft: Spacing.S,
  },
});

export default RealtimeInventory;