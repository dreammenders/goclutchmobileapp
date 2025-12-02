import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Spacing } from '../constants/Spacing';
import { Typography } from '../constants/Typography';
import { Responsive, responsiveSize } from '../constants/Responsive';

const BannerItem = ({ icon, title, subtitle, colors, image, contentWidth = 400 }) => {
  if (image) {
    return (
      <View style={[styles.bannerImageWrapper, { width: contentWidth }]}>
        <Image source={image} style={styles.bannerImageFull} resizeMode="contain" />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.banner, { width: contentWidth }]}
    >
      <View style={styles.decorativeCircle} />
      <View style={styles.bannerContent}>
        <View style={styles.iconWrapper}>
          <Text style={styles.bannerIcon}>{icon}</Text>
        </View>
        <View style={styles.bannerText}>
          <Text style={styles.bannerTitle}>{title}</Text>
          <Text style={styles.bannerSubtitle}>{subtitle}</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const CarouselBanner = ({ banners = defaultBanners, autoPlayInterval = 4000 }) => {
  const [windowWidth, setWindowWidth] = useState(400);
  const safeWindowWidth = windowWidth || 400;
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef(null);

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

  useEffect(() => {
    if (currentIndex >= banners.length) {
      setCurrentIndex(0);
    }
  }, [banners.length, currentIndex]);

  useEffect(() => {
    if (banners.length <= 1) {
      return undefined;
    }

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [banners.length, autoPlayInterval]);

  useEffect(() => {
    if (banners.length <= 1) {
      return;
    }

    scrollViewRef.current?.scrollTo({
      x: currentIndex * windowWidth,
      animated: true,
    });
  }, [currentIndex, banners.length, windowWidth]);

  if (banners.length <= 1) {
    const banner = banners[0];
    if (!banner) {
      return null;
    }

    const wrapperStyle = banner.image
      ? [styles.singleBannerWrapperImage, { width: safeWindowWidth }]
      : [styles.singleBannerWrapper, { width: safeWindowWidth }];

    return (
      <View style={wrapperStyle}>
        <BannerItem {...banner} contentWidth={safeWindowWidth} />
      </View>
    );
  }

  return (
    <View style={styles.carouselContainer}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          if (event?.nativeEvent?.contentOffset) {
            const offsetX = event.nativeEvent.contentOffset.x;
            const index = Math.round(offsetX / windowWidth);
            setCurrentIndex(index);
          }
        }}
      >
        {banners.map((banner, index) => (
          <View
            key={banner.id ?? index}
            style={[
              styles.bannerSlide,
              banner.image ? styles.bannerSlideImage : styles.bannerSlideContent,
              { width: safeWindowWidth },
            ]}
          >
            <BannerItem {...banner} contentWidth={safeWindowWidth} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const defaultBanners = [
  {
    icon: '🛞',
    title: 'Tyres Sale',
    subtitle: 'Up to 40% off on premium tyres',
    colors: ['#FF6B35', '#FF8C42'],
  },
  {
    icon: '🔋',
    title: 'Battery Exchange',
    subtitle: 'Get instant replacements with exchange offers',
    colors: ['#F7B32B', '#FFC844'],
  },
  {
    icon: '❄️',
    title: 'Summer Coolers',
    subtitle: 'Keep your car cool all season long',
    colors: ['#0FA3B1', '#1FBBCF'],
  },
];

const styles = StyleSheet.create({
  singleBannerWrapper: {
    marginHorizontal: Spacing.SCREEN_HORIZONTAL,
    borderRadius: Spacing.BORDER_RADIUS_L,
    overflow: 'hidden',
  },
  singleBannerWrapperImage: {
    alignSelf: 'center',
  },
  carouselContainer: {
    marginVertical: 0,
  },
  bannerSlide: {
  },
  bannerSlideContent: {
    paddingHorizontal: Spacing.SCREEN_HORIZONTAL,
  },
  bannerSlideImage: {
    paddingHorizontal: 0,
  },
  container: {
    marginVertical: Spacing.XS,
  },
  banner: {
    borderRadius: Spacing.BORDER_RADIUS_L,
    padding: Spacing.L,
    minHeight: responsiveSize(180),
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: responsiveSize(3) },
    shadowOpacity: 0.15,
    shadowRadius: responsiveSize(6),
    elevation: 4,
  },
  bannerImageWrapper: {
    aspectRatio: 16 / 9,
    borderRadius: Spacing.BORDER_RADIUS_L,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  bannerImageFull: {
    width: '100%',
    height: '100%',
  },
  decorativeCircle: {
    position: 'absolute',
    width: responsiveSize(180),
    height: responsiveSize(180),
    borderRadius: responsiveSize(90),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    right: responsiveSize(-80),
    top: responsiveSize(-50),
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  iconWrapper: {
    width: responsiveSize(70),
    height: responsiveSize(70),
    borderRadius: responsiveSize(16),
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.L,
  },
  bannerIcon: {
    fontSize: responsiveSize(52),
  },
  bannerText: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: Typography.HEADING_S,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: Spacing.XS,
  },
  bannerSubtitle: {
    fontSize: Typography.BODY_S,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: Typography.LINE_HEIGHT_NORMAL * Typography.BODY_S,
    fontWeight: '500',
  },
});

export default CarouselBanner;