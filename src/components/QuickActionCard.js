import React, { useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { Colors } from '../constants/Colors';
import { Spacing } from '../constants/Spacing';
import { Typography } from '../constants/Typography';

const QuickActionCard = ({ icon, label, onPress, color = Colors.PRIMARY }) => {
  const [windowWidth, setWindowWidth] = React.useState(400);
  const CARD_SIZE = ((windowWidth || 400) - Spacing.SCREEN_HORIZONTAL * 2 - Spacing.M) / 2.5;
  const scaleValue = useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    try {
      const dims = Dimensions.get('window');
      setWindowWidth(dims && typeof dims === 'object' && dims.width ? dims.width : 400);
    } catch (error) {
      console.warn('Error getting dimensions:', error);
      setWindowWidth(400);
    }
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.92,
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
      onPress={onPress}
    >
      <Animated.View
        style={[
          styles.card,
          {
            width: CARD_SIZE,
            height: CARD_SIZE,
            transform: [{ scale: scaleValue }],
          },
        ]}
      >
        {/* Icon Container */}
        <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
          <Text style={styles.icon}>{icon}</Text>
        </View>

        {/* Label */}
        <Text style={styles.label} numberOfLines={2}>
          {label}
        </Text>

        {/* Action Dot */}
        <View style={[styles.actionDot, { backgroundColor: color }]} />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.CARD_BACKGROUND,
    borderRadius: Spacing.BORDER_RADIUS_L,
    padding: Spacing.M,
    marginRight: Spacing.S,
    marginBottom: Spacing.M,
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: Spacing.BORDER_RADIUS_L,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.S,
  },
  icon: {
    fontSize: 36,
  },
  label: {
    fontSize: Typography.CAPTION,
    fontWeight: '600',
    color: Colors.TEXT_PRIMARY,
    textAlign: 'center',
    lineHeight: Typography.LINE_HEIGHT_NORMAL * Typography.CAPTION,
    marginHorizontal: Spacing.XS,
  },
  actionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: Spacing.XS,
  },
});

export default QuickActionCard;