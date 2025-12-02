import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Colors } from '../constants/Colors';
import { Spacing } from '../constants/Spacing';
import { Typography } from '../constants/Typography';

const SafetyTipsCarousel = () => {
  const [windowWidth, setWindowWidth] = useState(400);
  const cardWidth = (windowWidth || 400) - Spacing.SCREEN_HORIZONTAL * 2;
  const scrollViewRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
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

  const tips = [
    {
      id: '1',
      icon: '🚗',
      title: 'Stay Inside',
      description: 'Keep your car doors locked if it\'s dark or unsafe',
      bgColor: '#FFE5D9',
    },
    {
      id: '2',
      icon: '⚠️',
      title: 'Hazard Lights',
      description: 'Turn on your hazard lights immediately',
      bgColor: '#FFF3E0',
    },
    {
      id: '3',
      icon: '🔺',
      title: 'Warning Triangle',
      description: 'Place warning triangle 50m behind your vehicle',
      bgColor: '#E1F5FE',
    },
    {
      id: '4',
      icon: '📞',
      title: 'Call for Help',
      description: 'Call Go Clutch helpline if stranded alone',
      bgColor: '#F0F4C3',
    },
  ];

  // Auto-scroll effect
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % tips.length;
      scrollViewRef.current?.scrollTo({
        x: nextIndex * (cardWidth + Spacing.M),
        animated: true,
      });
      setCurrentIndex(nextIndex);
    }, 5000);

    return () => clearInterval(interval);
  }, [cardWidth, currentIndex, tips.length]);

  const handleScroll = (event) => {
    if (event?.nativeEvent?.contentOffset) {
      const contentOffsetX = event.nativeEvent.contentOffset.x;
      const index = Math.round(contentOffsetX / (cardWidth + Spacing.M));
      setCurrentIndex(index % tips.length);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>Safety Tips</Text>

      {/* Carousel */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        scrollEventThrottle={16}
        onScroll={handleScroll}
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {tips.map((tip) => (
          <View
            key={tip.id}
            style={[styles.card, { backgroundColor: tip.bgColor, width: cardWidth }]}
          >
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>{tip.icon}</Text>
            </View>
            <Text style={styles.tipTitle}>{tip.title}</Text>
            <Text style={styles.tipDescription}>{tip.description}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Pagination Dots */}
      <View style={styles.dotsContainer}>
        {tips.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor:
                  index === currentIndex ? Colors.PRIMARY : Colors.BORDER_LIGHT,
                width: index === currentIndex ? 24 : 8,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.L,
  },
  title: {
    fontSize: Typography.HEADING_S,
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
    marginHorizontal: Spacing.SCREEN_HORIZONTAL,
    marginBottom: Spacing.M,
  },
  scrollView: {
    marginHorizontal: Spacing.SCREEN_HORIZONTAL,
  },
  scrollContent: {
    paddingRight: Spacing.SCREEN_HORIZONTAL,
  },
  card: {
    borderRadius: Spacing.BORDER_RADIUS_L,
    padding: Spacing.L,
    marginRight: Spacing.M,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    marginBottom: Spacing.M,
  },
  icon: {
    fontSize: 40,
  },
  tipTitle: {
    fontSize: Typography.HEADING_S,
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: Spacing.S,
  },
  tipDescription: {
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: Typography.LINE_HEIGHT_NORMAL * Typography.BODY_S,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.L,
    gap: Spacing.S,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
});

export default SafetyTipsCarousel;