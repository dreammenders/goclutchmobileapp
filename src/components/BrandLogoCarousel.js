import React, { useEffect, useRef, useState } from 'react';
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  useWindowDimensions,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Spacing } from '../constants/Spacing';

// Image mapping - requires defined at module level for Metro bundler
const BRAND_IMAGES = {
  Exide: require('../../assets/accessories/products/Exide.png'),
  Amaron: require('../../assets/accessories/products/Amaron.png'),
  MRF: require('../../assets/accessories/products/MRF.png'),
  Apollo: require('../../assets/accessories/products/Apollo.png'),
  Bosch: require('../../assets/accessories/products/Bosch.png'),
  BREMBO: require('../../assets/accessories/products/BREMBO.png'),
  Castrol: require('../../assets/accessories/products/Castrol.png'),
  CEAT: require('../../assets/accessories/products/CEAT.png'),
  Continental: require('../../assets/accessories/products/Continental.png'),
  Denso: require('../../assets/accessories/products/Denso.png'),
  GABRIEL: require('../../assets/accessories/products/GABRIEL.png'),
  GoClutch: require('../../assets/accessories/products/Go Clutch.png'),
  JKTyres: require('../../assets/accessories/products/JKTyres.png'),
  LUMAX: require('../../assets/accessories/products/LUMAX.png'),
  Mobil: require('../../assets/accessories/products/Mobil.png'),
  Motul: require('../../assets/accessories/products/Motul.png'),
  PURALATOR: require('../../assets/accessories/products/PURALATOR.png'),
  Shell: require('../../assets/accessories/products/Shell.png'),
  TVS: require('../../assets/accessories/products/TVS Go.png'),
  Valeo: require('../../assets/accessories/products/Valeo.png'),
};

const defaultBrands = [
  { name: 'Exide', image: BRAND_IMAGES.Exide },
  { name: 'Amaron', image: BRAND_IMAGES.Amaron },
  { name: 'MRF', image: BRAND_IMAGES.MRF },
  { name: 'Apollo', image: BRAND_IMAGES.Apollo },
  { name: 'Bosch', image: BRAND_IMAGES.Bosch },
  { name: 'BREMBO', image: BRAND_IMAGES.BREMBO },
  { name: 'Castrol', image: BRAND_IMAGES.Castrol },
  { name: 'CEAT', image: BRAND_IMAGES.CEAT },
  { name: 'Continental', image: BRAND_IMAGES.Continental },
  { name: 'Denso', image: BRAND_IMAGES.Denso },
  { name: 'GABRIEL', image: BRAND_IMAGES.GABRIEL },
  { name: 'Go Clutch', image: BRAND_IMAGES.GoClutch },
  { name: 'JK Tyres', image: BRAND_IMAGES.JKTyres },
  { name: 'LUMAX', image: BRAND_IMAGES.LUMAX },
  { name: 'Mobil', image: BRAND_IMAGES.Mobil },
  { name: 'Motul', image: BRAND_IMAGES.Motul },
  { name: 'PURALATOR', image: BRAND_IMAGES.PURALATOR },
  { name: 'Shell', image: BRAND_IMAGES.Shell },
  { name: 'TVS Go', image: BRAND_IMAGES.TVS },
  { name: 'Valeo', image: BRAND_IMAGES.Valeo },
];

const BrandLogoItem = ({ brand }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.8}
    >
      <Animated.View
        style={[
          styles.cardContainer,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Image Container */}
        {brand.image && (
          <Image
            source={brand.image}
            style={styles.logo}
            resizeMode="contain"
          />
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const BrandLogoCarousel = ({ brands = defaultBrands }) => {
  const windowDimensions = useWindowDimensions();
  const width = windowDimensions?.width || 400;
  const scrollViewRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const CARD_WIDTH = (width - Spacing.SCREEN_HORIZONTAL * 2 - Spacing.M) / 3;

  // Auto-scroll effect
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % Math.ceil(brands.length / 3);
      scrollViewRef.current?.scrollTo({
        x: nextIndex * (width - Spacing.SCREEN_HORIZONTAL * 2),
        animated: true,
      });
      setCurrentIndex(nextIndex);
    }, 4000);

    return () => clearInterval(interval);
  }, [currentIndex, brands.length, width]);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {brands.map((brand, index) => (
          <View key={index} style={[styles.itemWrapper, { width: CARD_WIDTH }]}>
            <BrandLogoItem brand={brand} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.S,
  },
  scrollView: {
    marginHorizontal: Spacing.SCREEN_HORIZONTAL,
  },
  scrollContent: {
    paddingRight: Spacing.SCREEN_HORIZONTAL,
  },
  itemWrapper: {
    marginRight: Spacing.S,
    height: 120,
  },
  cardContainer: {
    overflow: 'hidden',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 8,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
});

export default BrandLogoCarousel;