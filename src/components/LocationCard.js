import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { Spacing } from '../constants/Spacing';
import { Typography } from '../constants/Typography';
import { responsiveSize } from '../constants/Responsive';

const LocationCard = ({ onRefresh }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const handleRefresh = () => {
    setIsRefreshing(true);
    
    // Rotate animation
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start(() => {
      rotateAnim.setValue(0);
      setIsRefreshing(false);
    });

    // Call the refresh callback
    if (onRefresh) {
      onRefresh();
    }
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Your Location</Text>
        <TouchableOpacity
          onPress={handleRefresh}
          disabled={isRefreshing}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Animated.View
            style={{
              transform: [{ rotate: rotateInterpolate }],
            }}
          >
            <Ionicons
              name="refresh"
              size={20}
              color={Colors.PRIMARY}
            />
          </Animated.View>
        </TouchableOpacity>
      </View>

      {/* Location Info */}
      <View style={styles.locationInfo}>
        <View style={styles.locationPin}>
          <Ionicons name="location" size={24} color={Colors.PRIMARY} />
        </View>
        <View style={styles.locationDetails}>
          <Text style={styles.locationName}>Current Location</Text>
          <Text style={styles.locationAddress}>
            Indiranagar, Bangalore
          </Text>
          <Text style={styles.locationCoords}>
            GPS: 12.9716° N, 77.6412° E
          </Text>
        </View>
      </View>

      {/* Service Center Info */}
      <View style={styles.divider} />

      <View style={styles.serviceInfo}>
        <View style={styles.serviceHeader}>
          <View style={styles.serviceBadge}>
            <Ionicons name="storefront" size={16} color={Colors.LIGHT_BACKGROUND} />
          </View>
          <Text style={styles.serviceTitle}>Nearest Service Center</Text>
        </View>
        <Text style={styles.serviceName}>
          Go Clutch - Premium Service Hub
        </Text>
        <Text style={styles.serviceDetails}>
          Indiranagar Branch • 2.3 km away
        </Text>
        <View style={styles.etaContainer}>
          <Ionicons name="time" size={16} color={Colors.WARNING} />
          <Text style={styles.etaText}>Estimated arrival: 15 mins</Text>
        </View>
      </View>

      {/* Action Button */}
      <TouchableOpacity style={styles.actionButton}>
        <Ionicons name="navigate" size={20} color={Colors.LIGHT_BACKGROUND} />
        <Text style={styles.actionText}>Navigate</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.CARD_BACKGROUND,
    borderRadius: Spacing.BORDER_RADIUS_L,
    padding: Spacing.L,
    marginHorizontal: Spacing.SCREEN_HORIZONTAL,
    marginVertical: Spacing.M,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.L,
  },
  title: {
    fontSize: Typography.HEADING_S,
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.L,
  },
  locationPin: {
    width: responsiveSize(48),
    height: responsiveSize(48),
    borderRadius: Spacing.BORDER_RADIUS_M,
    backgroundColor: `${Colors.PRIMARY}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.M,
  },
  locationDetails: {
    flex: 1,
  },
  locationName: {
    fontSize: Typography.BODY_M,
    fontWeight: '600',
    color: Colors.TEXT_PRIMARY,
    marginBottom: Spacing.XS,
  },
  locationAddress: {
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_SECONDARY,
    marginBottom: Spacing.XS,
  },
  locationCoords: {
    fontSize: Typography.CAPTION,
    color: Colors.TEXT_MUTED,
    fontWeight: '500',
  },
  divider: {
    height: responsiveSize(1),
    backgroundColor: Colors.BORDER_LIGHT,
    marginVertical: Spacing.M,
  },
  serviceInfo: {
    marginBottom: Spacing.L,
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.S,
  },
  serviceBadge: {
    width: responsiveSize(32),
    height: responsiveSize(32),
    borderRadius: Spacing.BORDER_RADIUS_M,
    backgroundColor: Colors.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.S,
  },
  serviceTitle: {
    fontSize: Typography.BODY_S,
    fontWeight: '600',
    color: Colors.TEXT_SECONDARY,
  },
  serviceName: {
    fontSize: Typography.BODY_M,
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
    marginBottom: Spacing.XS,
  },
  serviceDetails: {
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_SECONDARY,
    marginBottom: Spacing.S,
  },
  etaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.WARNING}15`,
    paddingHorizontal: Spacing.M,
    paddingVertical: Spacing.S,
    borderRadius: Spacing.BORDER_RADIUS_M,
    marginTop: Spacing.S,
  },
  etaText: {
    fontSize: Typography.BODY_S,
    fontWeight: '600',
    color: Colors.WARNING,
    marginLeft: Spacing.S,
  },
  actionButton: {
    flexDirection: 'row',
    backgroundColor: Colors.PRIMARY,
    paddingVertical: Spacing.M,
    borderRadius: Spacing.BORDER_RADIUS_M,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.M,
    shadowColor: Colors.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  actionText: {
    fontSize: Typography.BODY_M,
    fontWeight: '700',
    color: Colors.LIGHT_BACKGROUND,
    marginLeft: Spacing.S,
  },
});

export default LocationCard;