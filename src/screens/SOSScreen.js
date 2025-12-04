import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Alert,
  FlatList,
  Dimensions,
  Animated,
  Image,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import { Spacing } from '../constants/Spacing';

const BANNER_SPACING = 16;

const SERVICES = [
  { id: 'flat-tyre', label: 'Flat Tyre', image: require('../../assets/Emergency Services/Flat Tyre.png') },
  { id: 'battery-jumpstart', label: 'Battery Jumstart', image: require('../../assets/Emergency Services/Battery Jumstart.png') },
  { id: 'car-oil-leakages', label: 'Car Oil Leakages', image: require('../../assets/Emergency Services/Car Oil Leakages.png') },
  { id: 'coolant-leakage', label: 'Coolant Leakage', image: require('../../assets/Emergency Services/Coolant Leakage.png') },
  { id: 'car-scanning', label: 'Car Scanning', image: require('../../assets/Emergency Services/Car Scanning.png') },
  { id: 'car-towing', label: 'Car Towing', image: require('../../assets/Emergency Services/Car Towing.png') },
  { id: 'car-key-inside', label: 'Car Key Inside', image: require('../../assets/Emergency Services/Car Key Inside.png') },
  { id: 'clutch-breakdown', label: 'Car Clutch Breakdwon', image: require('../../assets/Emergency Services/Car Clutch Breakdwon.png') },
  { id: 'car-accident', label: 'Car Accident', image: require('../../assets/Emergency Services/Car Accident.png') },
  { id: 'car-flooding', label: 'Car Flooding', image: require('../../assets/Emergency Services/Car Flooding.png') },
  { id: 'check-engine-light', label: 'Check Engine Light', image: require('../../assets/Emergency Services/Check Engine Light.png') },
  { id: 'engine-smoke', label: 'Engine Smoke', image: require('../../assets/Emergency Services/Engine Smoke.png') },
];

const SERVICE_PRICES = {
  'flat-tyre': { normalPrice: 399, price: 299, primePrice: 199, description: 'Tyre replacement or repair at your location' },
  'battery-jumpstart': { normalPrice: 299, price: 199, primePrice: 129, description: 'Quick battery jump start service' },
  'car-oil-leakages': { normalPrice: 549, price: 399, primePrice: 269, description: 'Oil leak diagnosis and repair' },
  'coolant-leakage': { normalPrice: 499, price: 349, primePrice: 239, description: 'Coolant system check and repair' },
  'car-scanning': { normalPrice: 399, price: 249, primePrice: 169, description: 'Complete vehicle diagnostic scan' },
  'car-towing': { normalPrice: 699, price: 499, primePrice: 339, description: 'Safe towing service up to 20 km' },
  'car-key-inside': { normalPrice: 449, price: 299, primePrice: 199, description: 'Professional car key extraction service' },
  'clutch-breakdown': { normalPrice: 1099, price: 799, primePrice: 539, description: 'Clutch system inspection and repair' },
  'car-accident': { normalPrice: 1399, price: 999, primePrice: 679, description: 'Post-accident assistance and documentation' },
  'car-flooding': { normalPrice: 1299, price: 899, primePrice: 609, description: 'Water damage assessment and recovery' },
  'check-engine-light': { normalPrice: 349, price: 199, primePrice: 129, description: 'Engine diagnostic and error code reading' },
  'engine-smoke': { normalPrice: 649, price: 449, primePrice: 299, description: 'Smoke detection and source diagnosis' },
};

const EMERGENCY_NUMBER = '9133959551';

const BANNERS = [
  { id: '1', title: '24/7 Support', subtitle: 'Always ready to help', gradient: ['#fe5110', '#e63900'] },
  { id: '2', title: 'Fast Response', subtitle: 'Quick assistance available', gradient: ['#4CAF50', '#2E7D32'] },
  { id: '3', title: 'Professional Service', subtitle: 'Trained technicians', gradient: ['#2196F3', '#1976D2'] },
];

const TESTIMONIALS = [
  { id: '1', name: 'Rajesh Kumar', text: 'GoClutch saved me during a flat tire emergency. Outstanding support!', rating: 5 },
  { id: '2', name: 'Priya Singh', text: 'Fast, reliable, and professional. Highly recommended service.', rating: 5 },
  { id: '3', name: 'Amit Patel', text: 'Best roadside assistance I\'ve experienced in India.', rating: 5 },
  { id: '4', name: 'Sneha Verma', text: 'Emergency support when I needed it most. Thank you GoClutch!', rating: 5 },
];

const FALLBACK_REGION = {
  latitude: 12.9716,
  longitude: 77.5946,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

const ITEMS_PER_PAGE = 6;
const COLUMNS = 3;

const MAP_STYLE = [
  {
    elementType: 'geometry',
    stylers: [{ color: '#f5f5f5' }],
  },
  {
    elementType: 'labels.icon',
    stylers: [{ visibility: 'off' }],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [{ color: '#616161' }],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#f5f5f5' }],
  },
  {
    featureType: 'administrative.land_parcel',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#bdbdbd' }],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [{ color: '#eeeeee' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#757575' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#e5e5e5' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9e9e9e' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#ffffff' }],
  },
  {
    featureType: 'road.arterial',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#757575' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#dadada' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#616161' }],
  },
  {
    featureType: 'road.local',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9e9e9e' }],
  },
  {
    featureType: 'transit.line',
    elementType: 'geometry',
    stylers: [{ color: '#e5e5e5' }],
  },
  {
    featureType: 'transit.station',
    elementType: 'geometry',
    stylers: [{ color: '#eeeeee' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#c9c9c9' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9e9e9e' }],
  },
];

const PriceDetailsModal = ({ visible, serviceData, onBookNow, onClose }) => {
  const navigation = useNavigation();
  
  if (!serviceData) return null;

  const handleUpgradePremium = () => {
    onClose();
    navigation.navigate('Plans');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialCommunityIcons
                name="close"
                size={24}
                color={Colors.TEXT_PRIMARY}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.modalScrollContent}>
            <View style={styles.serviceImageContainer}>
              <Image
                source={serviceData.image}
                style={styles.modalServiceImage}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.modalServiceName}>{serviceData.label}</Text>

            <View style={styles.primeMembershipUnifiedCard}>
              <View style={styles.primeMembershipBannerWrapper}>
                <Image
                  source={require('../../assets/subscription/subscriptionbanner.png')}
                  style={styles.primeMembershipBanner}
                  resizeMode="cover"
                />
              </View>
              <TouchableOpacity style={styles.upgradeButtonUnified} activeOpacity={0.8} onPress={handleUpgradePremium}>
                <LinearGradient
                  colors={['#8B5CF6', '#7C3AED']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.upgradeButtonGradientUnified}
                >
                  <MaterialCommunityIcons name="crown" size={18} color="#FFFFFF" />
                  <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <View style={styles.benefitsCard}>
              <Text style={styles.benefitsLabel}>What's Included</Text>
              <View style={styles.benefitItem}>
                <MaterialCommunityIcons name="check-circle" size={14} color={Colors.PRIMARY} />
                <Text style={styles.benefitText}>24/7 Professional Support</Text>
              </View>
              <View style={styles.benefitItem}>
                <MaterialCommunityIcons name="check-circle" size={14} color={Colors.PRIMARY} />
                <Text style={styles.benefitText}>Fast Response Time</Text>
              </View>
              <View style={styles.benefitItem}>
                <MaterialCommunityIcons name="check-circle" size={14} color={Colors.PRIMARY} />
                <Text style={styles.benefitText}>Trained Technicians</Text>
              </View>
              <View style={styles.benefitItem}>
                <MaterialCommunityIcons name="check-circle" size={14} color={Colors.PRIMARY} />
                <Text style={styles.benefitText}>Transparent Pricing</Text>
              </View>
            </View>
          </View>

          <View style={styles.modalFooter}>
            <View style={styles.unifiedPricingCard}>
              <View style={styles.singlePriceDisplay}>
                <View style={styles.priceRowNew}>
                  <Text style={styles.priceRowLabel}>Regular Price</Text>
                  <Text style={styles.priceRowStrikeoff}>₹{serviceData.normalPrice}</Text>
                </View>
                
                <View style={styles.priceRowDivider} />
                
                <View style={styles.priceRowNew}>
                  <Text style={styles.priceRowLabel}>Our Price</Text>
                  <Text style={styles.priceRowHighlight}>₹{serviceData.price}</Text>
                </View>
                
                <View style={styles.priceRowDivider} />
                
                <View style={styles.priceRowNew}>
                  <View style={styles.primeRowLabel}>
                    <MaterialCommunityIcons name="crown" size={14} color="#FF2E64" />
                    <Text style={styles.priceRowLabelPrime}>Prime Member</Text>
                  </View>
                  <Text style={styles.priceRowPrime}>₹{serviceData.primePrice}</Text>
                </View>
              </View>
              
              <TouchableOpacity
                style={styles.bookButtonContainerInline}
                onPress={() => onBookNow(serviceData.id)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#8B5CF6', '#7C3AED']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.bookButtonGradient}
                >
                  <MaterialCommunityIcons name="phone-in-talk" size={15} color="#FFFFFF" />
                  <Text style={styles.bookButtonText}>Book Now</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const SOSScreen = () => {
  const navigation = useNavigation();
  const [windowWidth, setWindowWidth] = useState(400);
  const safeWindowWidth = windowWidth || 400;
  const bannerWidth = safeWindowWidth * 0.92;
  const bannerHeight = bannerWidth * 0.45;
  const mapHeight = safeWindowWidth * 0.45;
  const testimonialWidth = safeWindowWidth * 0.8;
  const bannersHorizontalPadding = Math.max((safeWindowWidth - bannerWidth) / 2, 0);
  const servicePageWidth = safeWindowWidth;
  const [region, setRegion] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [selectedService, setSelectedService] = useState(SERVICES[0].id);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [activeServicePageIndex, setActiveServicePageIndex] = useState(0);
  const [priceModalVisible, setPriceModalVisible] = useState(false);
  const [selectedServiceData, setSelectedServiceData] = useState(null);
  const isMounted = useRef(true);
  const bannerFlatListRef = useRef(null);
  const servicesCarouselRef = useRef(null);
  const sirenOpacity = useRef(new Animated.Value(1)).current;
  const mapRef = useRef(null);

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
  
  const totalPages = Math.ceil(SERVICES.length / ITEMS_PER_PAGE);
  const pages = Array.from({ length: totalPages }, (_, i) =>
    SERVICES.slice(i * ITEMS_PER_PAGE, (i + 1) * ITEMS_PER_PAGE)
  );

  const fetchLocation = useCallback(async () => {
    if (!isMounted.current) {
      return;
    }
    setIsLoadingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (!isMounted.current) {
        return;
      }
      if (status !== 'granted') {
        setPermissionDenied(true);
        setRegion(null);
        return;
      }
      const { coords } = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      if (!isMounted.current) {
        return;
      }
      setPermissionDenied(false);
      setRegion({
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    } catch (error) {
      if (isMounted.current) {
        setPermissionDenied(true);
      }
    } finally {
      if (isMounted.current) {
        setIsLoadingLocation(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (BANNERS.length <= 1) return;

    const autoSlideInterval = setInterval(() => {
      setActiveBannerIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % BANNERS.length;
        
        if (bannerFlatListRef.current) {
          bannerFlatListRef.current.scrollToIndex({
            index: nextIndex,
            animated: true,
          });
        }
        
        return nextIndex;
      });
    }, 4000);

    return () => clearInterval(autoSlideInterval);
  }, []);

  useEffect(() => {
    if (pages.length <= 1) return;

    const autoSlideInterval = setInterval(() => {
      setActiveServicePageIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % pages.length;
        
        if (servicesCarouselRef.current) {
          servicesCarouselRef.current.scrollToIndex({
            index: nextIndex,
            animated: true,
          });
        }
        
        return nextIndex;
      });
    }, 5000);

    return () => clearInterval(autoSlideInterval);
  }, [pages.length]);

  useEffect(() => {
    const blinkAnimation = Animated.sequence([
      Animated.timing(sirenOpacity, {
        toValue: 0.3,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(sirenOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]);

    const loop = Animated.loop(blinkAnimation);
    loop.start();

    return () => loop.stop();
  }, [sirenOpacity]);

  const handleSelectService = useCallback((serviceId) => {
    setSelectedService(serviceId);
    
    const service = SERVICES.find(s => s.id === serviceId);
    const priceData = SERVICE_PRICES[serviceId];
    
    setSelectedServiceData({
      id: serviceId,
      label: service?.label || 'Emergency Service',
      image: service?.image,
      normalPrice: priceData?.normalPrice || 0,
      price: priceData?.price || 0,
      primePrice: priceData?.primePrice || 0,
      description: priceData?.description || '',
      region,
    });
    
    setPriceModalVisible(true);
  }, [region]);

  const handleBookNow = useCallback(async (serviceId) => {
    setPriceModalVisible(false);
    
    const selectedServiceObj = SERVICES.find(service => service.id === serviceId);
    const serviceName = selectedServiceObj?.label || 'Emergency Service';
    
    let finalRegion = region;
    
    if (!finalRegion) {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });
          finalRegion = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          };
          setRegion(finalRegion);
        }
      } catch (error) {
        console.log('Location error:', error);
      }
    }
    
    let locationText = '📍 Location: Not available';
    if (finalRegion) {
      locationText = `📍 My Location:\nhttps://maps.google.com/?q=${finalRegion.latitude},${finalRegion.longitude}`;
    }
    
    const message = `🚨 *EMERGENCY SERVICE REQUEST*\n\n🔧 *Service Needed:* ${serviceName}\n\n${locationText}\n\n⏰ *Time:* ${new Date().toLocaleTimeString()}\n\n✅ Please respond ASAP!\n\nThank you! 🙏`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${EMERGENCY_NUMBER}?text=${encodedMessage}`;
    
    Linking.canOpenURL(whatsappUrl).then(supported => {
      if (supported) {
        Linking.openURL(whatsappUrl);
      } else {
        Alert.alert('WhatsApp not installed', 'Please install WhatsApp to contact emergency services.');
      }
    }).catch(error => {
      Alert.alert('Error', 'Unable to open WhatsApp. Please try again.');
    });
  }, [region]);

  const handleBannerScroll = useCallback((event) => {
    if (event?.nativeEvent?.contentOffset) {
      const scrollPosition = event.nativeEvent.contentOffset.x;
      const index = Math.round(scrollPosition / (bannerWidth + BANNER_SPACING));
      setActiveBannerIndex(index);
    }
  }, [bannerWidth]);

  const handleServiceCarouselScroll = useCallback((event) => {
    if (event?.nativeEvent?.contentOffset) {
      const scrollPosition = event.nativeEvent.contentOffset.x;
      const pageWidth = servicePageWidth || 1;
      const index = Math.round(scrollPosition / pageWidth);
      setActiveServicePageIndex(index);
    }
  }, [servicePageWidth]);

  const renderBanner = useCallback(({ item }) => (
    <LinearGradient
      colors={item.gradient}
      style={[styles.bannerCard, { width: bannerWidth, height: bannerHeight }]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.bannerTextContent}>
        <Text style={styles.bannerTitle}>{item.title}</Text>
        <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
      </View>
    </LinearGradient>
  ), [bannerHeight, bannerWidth]);

  const getEmergencyServiceGradient = (index) => {
    const gradients = [
      ['#6366F1', '#8B5CF6'], // Indigo to Purple
      ['#EC4899', '#F43F5E'], // Pink to Rose
      ['#10B981', '#059669'], // Emerald to Green
      ['#F59E0B', '#EF4444'], // Amber to Red
      ['#3B82F6', '#06B6D4'], // Blue to Cyan
      ['#8B5CF6', '#D946EF'], // Purple to Fuchsia
      ['#14B8A6', '#06B6D4'], // Teal to Cyan
      ['#F97316', '#DC2626'], // Orange to Red
      ['#6366F1', '#8B5CF6'], // Indigo to Purple (cycle)
      ['#EC4899', '#F43F5E'], // Pink to Rose (cycle)
      ['#10B981', '#059669'], // Emerald to Green (cycle)
      ['#F59E0B', '#EF4444'], // Amber to Red (cycle)
    ];
    return gradients[index % gradients.length];
  };

  const renderBannerPaginationDots = () => (
    <View style={styles.bannerPaginationContainer}>
      {BANNERS.map((_, index) => (
        <TouchableOpacity
          key={`banner-dot-${index}`}
          style={[
            styles.bannerPaginationDot,
            activeBannerIndex === index && styles.bannerPaginationDotActive,
          ]}
          onPress={() => {
            setActiveBannerIndex(index);
            bannerFlatListRef.current?.scrollToIndex({
              index,
              animated: true,
            });
          }}
        />
      ))}
    </View>
  );

  const renderServiceCarouselPaginationDots = () => (
    <View style={styles.servicePaginationContainer}>
      {pages.map((_, index) => (
        <TouchableOpacity
          key={`service-dot-${index}`}
          style={[
            styles.servicePaginationDot,
            activeServicePageIndex === index && styles.servicePaginationDotActive,
          ]}
          onPress={() => {
            setActiveServicePageIndex(index);
            servicesCarouselRef.current?.scrollToIndex({
              index,
              animated: true,
            });
          }}
        />
      ))}
    </View>
  );

  const renderTestimonial = useCallback(({ item }) => (
    <View style={[styles.testimonialCard, { width: testimonialWidth }]}>
      <View style={styles.testimonialHeader}>
        <View style={styles.testimonialAvatar}>
          <Text style={styles.testimonialAvatarText}>{item.name.charAt(0)}</Text>
        </View>
        <View style={styles.testimonialInfo}>
          <Text style={styles.testimonialName}>{item.name}</Text>
          <View style={styles.ratingContainer}>
            {[...Array(item.rating)].map((_, i) => (
              <MaterialCommunityIcons
                key={i}
                name="star"
                size={10}
                color="#FFD700"
              />
            ))}
          </View>
        </View>
      </View>
      <Text style={styles.testimonialText} numberOfLines={2}>{item.text}</Text>
    </View>
  ), [testimonialWidth]);

  const handleCall = useCallback(async () => {
    const url = `tel:${EMERGENCY_NUMBER}`;
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Unable to open dialer', 'Please dial the number manually.');
    }
  }, []);

  return (
    <>
      <PriceDetailsModal
        visible={priceModalVisible}
        serviceData={selectedServiceData}
        onBookNow={handleBookNow}
        onClose={() => setPriceModalVisible(false)}
      />
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerSection}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={32}
              color={Colors.TEXT_PRIMARY}
            />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Emergency SOS</Text>
            <Text style={styles.subtitle}>Professional roadside assistance</Text>
          </View>
        </View>

        <View style={styles.mapCard}>
          <View style={[styles.mapWrapper, { height: mapHeight }]}>
            <MapView
              ref={mapRef}
              style={styles.map}
              initialRegion={FALLBACK_REGION}
              region={region || FALLBACK_REGION}
              showsUserLocation
              showsCompass
              zoomControlEnabled
            >
              {region && (
                <Marker
                  coordinate={region}
                  title="Your Location"
                  description="Current position"
                  pinColor="#FE5110"
                />
              )}
            </MapView>
            {isLoadingLocation && (
              <View style={styles.mapOverlay}>
                <ActivityIndicator size="small" color={Colors.PRIMARY} />
                <Text style={styles.overlayText}>Fetching location</Text>
              </View>
            )}
          </View>
          {permissionDenied && (
            <Text style={styles.permissionText}>
              Enable location services to view your live position.
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <MaterialCommunityIcons name="alarm-light" size={28} color="#fe5110" />
            <Text style={styles.sectionTitle}>Emergency Services</Text>
          </View>
          <FlatList
            ref={servicesCarouselRef}
            data={pages}
            renderItem={({ item: pageServices }) => (
              <View style={[styles.page, { width: servicePageWidth }]}>
                <FlatList
                  key={`flatlist-${COLUMNS}`}
                  data={pageServices}
                  keyExtractor={(item) => item.id}
                  numColumns={COLUMNS}
                  scrollEnabled={false}
                  columnWrapperStyle={styles.columnWrapper}
                  contentContainerStyle={styles.servicesGrid}
                  renderItem={({ item, index }) => {
                    const gradientColors = getEmergencyServiceGradient(index + pageServices.indexOf(item));
                    return (
                      <TouchableOpacity
                        style={[
                          styles.serviceCard,
                          selectedService === item.id && styles.serviceCardActive,
                        ]}
                        onPress={() => handleSelectService(item.id)}
                        activeOpacity={0.8}
                      >
                        <View style={styles.glassLayer} />
                        <LinearGradient
                          colors={[...gradientColors, 'transparent']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.serviceGradientBg}
                        />
                        <View style={styles.serviceIconContainer}>
                          <LinearGradient
                            colors={[...gradientColors.map((c) => c + '12')]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.serviceIconBg}
                          >
                            <Image
                              source={item.image}
                              style={styles.serviceIcon}
                              resizeMode="contain"
                            />
                          </LinearGradient>
                        </View>
                        <Text
                          style={[
                            styles.serviceLabel,
                            selectedService === item.id && styles.serviceLabelActive,
                          ]}
                          numberOfLines={2}
                        >
                          {item.label}
                        </Text>
                        <View style={styles.shimmerOverlay} />
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>
            )}
            keyExtractor={(_, index) => `service-page-${index}`}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={handleServiceCarouselScroll}
            contentContainerStyle={styles.carouselContainer}
          />
        </View>

        <TouchableOpacity
          style={styles.callButton}
          onPress={handleCall}
          activeOpacity={0.9}
        >
          <View style={styles.callIconLeft}>
            <MaterialCommunityIcons
              name="phone"
              size={24}
              color={Colors.PRIMARY}
            />
          </View>
          <View style={styles.callTextGroup}>
            <Text style={styles.callLabel}>Emergency Number</Text>
            <Text style={styles.callNumber}>{EMERGENCY_NUMBER}</Text>
          </View>
          <Animated.View style={[styles.sirenIconRight, { opacity: sirenOpacity }]}>
            <View style={styles.sirenGlow} />
            <View style={styles.sirenGlowOuter} />
            <MaterialCommunityIcons
              name="alarm-light"
              size={28}
              color="#FFFFFF"
            />
          </Animated.View>
        </TouchableOpacity>

        <View style={styles.bannersSection}>
          <FlatList
            ref={bannerFlatListRef}
            data={BANNERS}
            renderItem={renderBanner}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={handleBannerScroll}
            contentContainerStyle={[styles.bannersContainer, { paddingHorizontal: bannersHorizontalPadding }]}
          />
        </View>

        <View style={styles.testimonialsSection}>
          <View style={styles.testimonialsTitleRow}>
            <MaterialCommunityIcons name="star" size={28} color="#FFD700" />
            <Text style={styles.testimonialsTitle}>Customer Testimonials</Text>
          </View>
          <FlatList
            data={TESTIMONIALS}
            renderItem={renderTestimonial}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.testimonialsContainer}
            scrollEventThrottle={16}
            nestedScrollEnabled={true}
            scrollEnabled={true}
          />
        </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.PAGE_BACKGROUND,
  },
  scrollContent: {
    paddingBottom: Spacing.XXL,
  },
  headerSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.SCREEN_HORIZONTAL,
    paddingTop: Spacing.S,
    paddingBottom: Spacing.XS,
  },
  headerContent: {
    flex: 1,
    marginLeft: Spacing.S,
  },
  title: {
    fontSize: Typography.HEADING_L,
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
  },
  subtitle: {
    marginTop: Spacing.XS,
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_SECONDARY,
  },
  mapCard: {
    marginHorizontal: Spacing.SCREEN_HORIZONTAL,
    marginTop: Spacing.XS,
    marginBottom: Spacing.XS,
    backgroundColor: 'transparent',
    borderRadius: 0,
    padding: 0,
    shadowColor: 'transparent',
    elevation: 0,
  },
  mapWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#F5F5F5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  map: {
    flex: 1,
  },
  mapOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(249, 249, 249, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    marginTop: Spacing.S,
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_SECONDARY,
  },
  permissionText: {
    marginTop: Spacing.XS,
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_MUTED,
    paddingHorizontal: Spacing.SCREEN_HORIZONTAL,
  },
  refreshButton: {
    marginTop: Spacing.XS,
    marginHorizontal: Spacing.SCREEN_HORIZONTAL,
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.M,
    paddingVertical: Spacing.XS,
    borderRadius: Spacing.BORDER_RADIUS_M,
    backgroundColor: `${Colors.PRIMARY}15`,
  },
  refreshText: {
    fontSize: Typography.BODY_S,
    fontWeight: '600',
    color: Colors.PRIMARY,
  },
  section: {
    marginTop: Spacing.S,
    marginBottom: Spacing.XS,
    paddingHorizontal: 0,
    backgroundColor: 'transparent',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.SCREEN_HORIZONTAL,
    marginBottom: Spacing.M,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.TEXT_PRIMARY,
    marginBottom: 0,
    letterSpacing: -0.5,
  },
  carouselContainer: {
    flexGrow: 0,
  },
  page: {
    paddingHorizontal: Spacing.SCREEN_HORIZONTAL,
  },
  columnWrapper: {
    justifyContent: 'space-around',
    gap: 8,
  },
  servicesGrid: {
    paddingHorizontal: 0,
    paddingBottom: Spacing.S,
  },
  serviceCard: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
    marginHorizontal: 5,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
    position: 'relative',
    aspectRatio: 1 / 1.1,
  },
  serviceCardActive: {
    borderWidth: 2.5,
    borderColor: Colors.PRIMARY,
    shadowColor: Colors.PRIMARY,
    shadowOpacity: 0.25,
  },
  glassLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(10px)',
  },
  serviceGradientBg: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 100,
    height: 100,
    borderRadius: 50,
    opacity: 0.15,
  },
  serviceIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    zIndex: 2,
  },
  serviceIconBg: {
    width: 70,
    height: 70,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceIcon: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },


  serviceLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.TEXT_PRIMARY,
    textAlign: 'center',
    lineHeight: 16,
    width: '100%',
    marginTop: 4,
    zIndex: 2,
  },
  serviceLabelActive: {
    color: Colors.PRIMARY,
    fontWeight: '900',
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    left: -100,
    width: 100,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    transform: [{ skewX: '-20deg' }],
  },
  callButton: {
    marginTop: Spacing.S,
    marginHorizontal: Spacing.SCREEN_HORIZONTAL,
    marginBottom: Spacing.S,
    backgroundColor: Colors.LIGHT_BACKGROUND,
    borderRadius: Spacing.BORDER_RADIUS_XL,
    paddingVertical: Spacing.M,
    paddingHorizontal: Spacing.M,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    shadowColor: Colors.PRIMARY,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  callIconLeft: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${Colors.PRIMARY}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.M,
  },
  sirenIconRight: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FF0000',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.S,
    position: 'relative',
    shadowColor: '#FF0000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  sirenGlow: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF0000',
    opacity: 0.4,
    left: -4,
    top: -4,
  },
  sirenGlowOuter: {
    position: 'absolute',
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FF0000',
    opacity: 0.2,
    left: -10,
    top: -10,
  },
  callTextGroup: {
    flex: 1,
  },
  callLabel: {
    fontSize: Typography.BODY_S,
    fontWeight: '600',
    color: Colors.TEXT_SECONDARY,
  },
  callNumber: {
    marginTop: Spacing.XS,
    fontSize: Typography.HEADING_S,
    fontWeight: '700',
    color: Colors.PRIMARY,
  },
  testimonialsSection: {
    marginTop: Spacing.M,
    marginHorizontal: 0,
    marginBottom: Spacing.XL,
    paddingHorizontal: 0,
  },
  testimonialsTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.SCREEN_HORIZONTAL,
    marginBottom: Spacing.M,
    gap: 12,
  },
  testimonialsTitle: {
    fontSize: Typography.HEADING_S,
    fontWeight: '800',
    color: Colors.TEXT_PRIMARY,
    marginBottom: 0,
    letterSpacing: -0.5,
  },
  testimonialsContainer: {
    paddingStart: Spacing.SCREEN_HORIZONTAL,
    paddingEnd: Spacing.SCREEN_HORIZONTAL,
    gap: 12,
  },
  testimonialCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.BORDER_RADIUS_L,
    padding: Spacing.M,
    marginVertical: 0,
  },
  testimonialHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.S,
  },
  testimonialAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.S,
    flexShrink: 0,
    shadowColor: Colors.PRIMARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  testimonialAvatarText: {
    fontSize: Typography.BODY_M,
    fontWeight: '700',
    color: Colors.LIGHT_BACKGROUND,
  },
  testimonialInfo: {
    flex: 1,
  },
  testimonialName: {
    fontSize: Typography.BODY_M,
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
    marginBottom: 3,
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  testimonialText: {
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_SECONDARY,
    lineHeight: 18,
    marginTop: Spacing.S,
  },
  bannersSection: {
    marginTop: Spacing.S,
    marginHorizontal: Spacing.SCREEN_HORIZONTAL,
    marginBottom: Spacing.S,
  },
  bannersContainer: {
    gap: BANNER_SPACING,
  },
  bannerCard: {
    borderRadius: Spacing.BORDER_RADIUS_L,
    justifyContent: 'center',
    padding: 0,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  bannerTextContent: {
    width: '100%',
    height: '100%',
    padding: Spacing.M,
    justifyContent: 'space-between',
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.LIGHT_BACKGROUND,
  },
  bannerSubtitle: {
    fontSize: 12,
    color: Colors.LIGHT_BACKGROUND,
    opacity: 0.9,
  },
  bannerPaginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.XS,
    paddingBottom: 0,
  },
  bannerPaginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.TEXT_SECONDARY,
    opacity: 0.3,
    marginHorizontal: 4,
  },
  bannerPaginationDotActive: {
    width: 24,
    backgroundColor: Colors.PRIMARY,
    opacity: 1,
  },
  servicePaginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.XS,
    paddingBottom: 0,
  },
  servicePaginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.TEXT_SECONDARY,
    opacity: 0.3,
    marginHorizontal: 4,
  },
  servicePaginationDotActive: {
    width: 24,
    backgroundColor: Colors.PRIMARY,
    opacity: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.PAGE_BACKGROUND,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '92%',
    paddingTop: Spacing.M,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 20,
    flexDirection: 'column',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: Spacing.M,
    paddingBottom: 8,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${Colors.PRIMARY}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalScrollContent: {
    paddingHorizontal: Spacing.M,
    paddingTop: 0,
    paddingBottom: 4,
    flexGrow: 1,
  },
  serviceImageContainer: {
    alignItems: 'center',
    marginBottom: 4,
    paddingVertical: 4,
    paddingHorizontal: Spacing.S,
  },
  modalServiceImage: {
    width: 60,
    height: 60,
  },
  modalServiceName: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: 2,
  },
  primeMembershipUnifiedCard: {
    marginTop: 20,
    marginBottom: 18,
    marginHorizontal: Spacing.M,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#8B5CF6',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  primeMembershipBannerWrapper: {
    width: '100%',
    height: 110,
    overflow: 'hidden',
  },
  primeMembershipBanner: {
    width: '100%',
    height: '100%',
    borderRadius: 0,
  },
  upgradeButtonUnified: {
    width: '100%',
    overflow: 'hidden',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  upgradeButtonGradientUnified: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: Spacing.M,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  primeMembershipContainer: {
    marginTop: 14,
    marginBottom: 12,
    gap: 4,
  },
  upgradeButton: {
    borderRadius: 10,
    overflow: 'hidden',
    marginHorizontal: Spacing.M,
    elevation: 2,
    shadowColor: '#8B5CF6',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
  },
  upgradeButtonGradient: {
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: Spacing.M,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  upgradeButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  priceCard: {
    backgroundColor: Colors.LIGHT_BACKGROUND,
    borderRadius: Spacing.BORDER_RADIUS_L,
    padding: Spacing.M,
    marginBottom: Spacing.M,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: Typography.BODY_M,
    fontWeight: '600',
    color: Colors.TEXT_SECONDARY,
  },
  priceValue: {
    fontSize: Typography.HEADING_L,
    fontWeight: '800',
    color: Colors.PRIMARY,
  },
  descriptionCard: {
    backgroundColor: Colors.LIGHT_BACKGROUND,
    borderRadius: Spacing.BORDER_RADIUS_L,
    padding: Spacing.M,
    marginBottom: Spacing.M,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  descriptionLabel: {
    fontSize: Typography.BODY_M,
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
    marginBottom: Spacing.S,
  },
  descriptionText: {
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_SECONDARY,
    lineHeight: 20,
  },
  benefitsCard: {
    backgroundColor: Colors.LIGHT_BACKGROUND,
    borderRadius: Spacing.BORDER_RADIUS_L,
    padding: 10,
    marginBottom: 0,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  benefitsLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
    marginBottom: 6,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  benefitText: {
    fontSize: 11,
    color: Colors.TEXT_SECONDARY,
    marginLeft: 6,
    flex: 1,
    lineHeight: 14,
  },
  modalFooter: {
    paddingHorizontal: Spacing.M,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: Colors.PAGE_BACKGROUND,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    gap: 10,
  },
  unifiedPricingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    elevation: 2,
    shadowColor: '#D9845A',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: '#D9845A',
  },
  singlePriceDisplay: {
    marginBottom: 10,
  },
  priceRowNew: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  priceRowLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#444444',
    letterSpacing: 0.1,
  },
  priceRowLabelPrime: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FF2E64',
    letterSpacing: 0.2,
  },
  primeRowLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  priceRowStrikeoff: {
    fontSize: 15,
    fontWeight: '700',
    color: '#999999',
    textDecorationLine: 'line-through',
  },
  priceRowHighlight: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FF5722',
  },
  priceRowPrime: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FF2E64',
  },
  priceRowDivider: {
    height: 0.8,
    backgroundColor: '#F0F0F0',
  },
  pricingCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 14,
  },
  priceCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    elevation: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  priceCardHighlighted: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#FF5722',
    elevation: 3,
    shadowColor: '#FF5722',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  priceCardPrime: {
    backgroundColor: '#FFFBF0',
    borderColor: '#FFD700',
    borderWidth: 2,
    elevation: 4,
    shadowColor: '#FFD700',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
  },
  priceCardLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  priceCardStrikeoff: {
    fontSize: 18,
    fontWeight: '700',
    color: '#999999',
    textDecorationLine: 'line-through',
  },
  priceCardMain: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FF5722',
  },
  primeCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  primeCardLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFD700',
    letterSpacing: 0.5,
  },
  priceCardPrimePrice: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFD700',
  },
  bookButtonContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#8B5CF6',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  bookButtonContainerInline: {
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#8B5CF6',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  bookButtonGradient: {
    paddingVertical: 10,
    paddingHorizontal: Spacing.M,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
  },
  bookButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
});

export default SOSScreen;
