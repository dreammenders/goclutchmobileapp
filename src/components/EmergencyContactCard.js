import React, { useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { Spacing } from '../constants/Spacing';
import { Typography } from '../constants/Typography';

const EmergencyContactCard = ({
  icon,
  name,
  phone,
  onCall,
  color = Colors.PRIMARY,
}) => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      friction: 6,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 6,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onCall}
    >
      <Animated.View
        style={[
          styles.card,
          {
            transform: [{ scale: scaleValue }],
          },
        ]}
      >
        {/* Icon Container */}
        <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
          <Text style={styles.icon}>{icon}</Text>
        </View>

        {/* Contact Info */}
        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          {phone && <Text style={styles.phone}>{phone}</Text>}
        </View>

        {/* Call Button */}
        <View style={[styles.callButton, { backgroundColor: color }]}>
          <Ionicons name="call" size={16} color={Colors.LIGHT_BACKGROUND} />
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 160,
    backgroundColor: Colors.CARD_BACKGROUND,
    borderRadius: Spacing.BORDER_RADIUS_L,
    padding: Spacing.M,
    marginRight: Spacing.M,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: Spacing.BORDER_RADIUS_M,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.S,
  },
  icon: {
    fontSize: 28,
  },
  info: {
    alignItems: 'center',
    marginBottom: Spacing.M,
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: Typography.BODY_S,
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: Spacing.XS,
  },
  phone: {
    fontSize: Typography.CAPTION,
    color: Colors.TEXT_SECONDARY,
    textAlign: 'center',
  },
  callButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default EmergencyContactCard;