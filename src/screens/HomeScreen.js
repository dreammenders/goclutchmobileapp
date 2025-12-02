import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import { Spacing } from '../constants/Spacing';
import mobileApi from '../api/mobileApi';

const BANNER_SPACING = 0;
const BANNER_WIDTH = 400;

const STORAGE_KEYS = {
  SELECTED_VEHICLE: '@selected_vehicle',
  LOCATION_PERMISSION: '@location_permission',
};

const HomeScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [currentLocation, setCurrentLocation] = useState('Fetching location...');
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [locationSubscription, setLocationSubscription] = useState(null);
  const [services, setServices] = useState([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [promotionalBanners, setPromotionalBanners] = useState([]);
  const [isLoadingBanners, setIsLoadingBanners] = useState(true);
  const [specialOffers, setSpecialOffers] = useState([]);
  const [isLoadingOffers, setIsLoadingOffers] = useState(true);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [activeOfferIndex, setActiveOfferIndex] = useState(0);
  const bannerFlatListRef = useRef(null);
  const offerFlatListRef = useRef(null);

  // Load selected vehicle on mount
  useEffect(() => {
    loadSelectedVehicle();
    fetchServices();
    fetchPromotionalBanners();
    fetchSpecialOffers();
  }, []);

  // Request location permission and start tracking
  useEffect(() => {
    requestLocationPermission();
    
    // Cleanup location subscription on unmount
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  // Auto-slide banner carousel
  useEffect(() => {
    if (promotionalBanners.length <= 1) return; // No need to auto-slide if only one banner

    const autoSlideInterval = setInterval(() => {
      setActiveBannerIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % promotionalBanners.length;
        
        // Scroll to next banner
        if (bannerFlatListRef.current) {
          bannerFlatListRef.current.scrollToIndex({
            index: nextIndex,
            animated: true,
          });
        }
        
        return nextIndex;
      });
    }, 3000); // Auto-slide every 3 seconds

    return () => clearInterval(autoSlideInterval);
  }, [promotionalBanners.length]);

  // Auto-slide special offers carousel
  useEffect(() => {
    if (specialOffers.length <= 1) return; // No need to auto-slide if only one offer

    const autoSlideInterval = setInterval(() => {
      setActiveOfferIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % specialOffers.length;
        
        // Scroll to next offer
        if (offerFlatListRef.current) {
          offerFlatListRef.current.scrollToIndex({
            index: nextIndex,
            animated: true,
          });
        }
        
        return nextIndex;
      });
    }, 3500); // Auto-slide every 3.5 seconds (slightly different from banners)

    return () => clearInterval(autoSlideInterval);
  }, [specialOffers.length]);

  // Load selected vehicle from AsyncStorage
  const loadSelectedVehicle = async () => {
    try {
      const vehicleData = await AsyncStorage.getItem(STORAGE_KEYS.SELECTED_VEHICLE);
      if (vehicleData) {
        const vehicle = JSON.parse(vehicleData);
        setSelectedVehicle(vehicle);
      }
    } catch (error) {
      // Silently handle error
    }
  };

  // Fetch services from remote database
  const fetchServices = async () => {
    try {
      setIsLoadingServices(true);
      const result = await mobileApi.getServices();

      if (result.success) {
        setServices(result.data.services);
      } else {
        throw new Error(result.message || 'Failed to fetch services');
      }
    } catch (error) {
      Alert.alert(
        'Error Loading Services',
        'Unable to load services from server. Please check your connection and try again.',
        [
          { text: 'Retry', onPress: fetchServices },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    } finally {
      setIsLoadingServices(false);
    }
  };

  // Fetch promotional banners from remote database
  const fetchPromotionalBanners = async () => {
    try {
      setIsLoadingBanners(true);
      const result = await mobileApi.getPromotionalBanners();

      if (result.success && result.data && result.data.banners && result.data.banners.length > 0) {
        // Define gradient colors for banners
        const gradientOptions = [
          ['#fe5110', '#e63900'],
          ['#4CAF50', '#2E7D32'],
          ['#2196F3', '#1976D2'],
          ['#9C27B0', '#7B1FA2'],
          ['#FF9800', '#F57C00'],
        ];
        
        // Transform database banners to match the expected format with gradients
        const transformedBanners = result.data.banners.map((banner, index) => ({
          id: banner.id,
          title: banner.title || 'Special Offer',
          subtitle: banner.description || '',
          image_url: banner.image_url,
          gradient: gradientOptions[index % gradientOptions.length],
        }));
        
        setPromotionalBanners(transformedBanners);
      } else {
        setPromotionalBanners([]);
      }
    } catch (error) {
      setPromotionalBanners([]);
    } finally {
      setIsLoadingBanners(false);
    }
  };

  // Fetch special offers from remote database
  const fetchSpecialOffers = async () => {
    try {
      setIsLoadingOffers(true);
      const result = await mobileApi.getSpecialOffers();

      if (result.success && result.data && result.data.offers && result.data.offers.length > 0) {
        // Define gradient colors for offers (different from banners)
        const offerGradientOptions = [
          ['#FF6B6B', '#C92A2A'],
          ['#51CF66', '#2F9E44'],
          ['#339AF0', '#1864AB'],
          ['#DA77F2', '#9C36B5'],
          ['#FFA94D', '#E67700'],
          ['#FF8787', '#FA5252'],
        ];
        
        // Transform database offers to match the expected format with gradients
        const transformedOffers = result.data.offers.map((offer, index) => ({
          id: offer.id,
          title: offer.title || 'Special Offer',
          subtitle: offer.description || '',
          discount: offer.discount_percentage ? `${offer.discount_percentage}% OFF` : '',
          image_url: offer.image_url,
          gradient: offerGradientOptions[index % offerGradientOptions.length],
        }));
        
        setSpecialOffers(transformedOffers);
      } else {
        setSpecialOffers([]);
      }
    } catch (error) {
      setSpecialOffers([]);
    } finally {
      setIsLoadingOffers(false);
    }
  };

  // Request location permission and start tracking
  const requestLocationPermission = async () => {
    try {
      setIsLoadingLocation(true);
      
      // Check if permission was already granted
      const { status: existingStatus } = await Location.getForegroundPermissionsAsync();
      
      let finalStatus = existingStatus;
      
      // If not granted, request permission
      if (existingStatus !== 'granted') {
        const { status } = await Location.requestForegroundPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        setCurrentLocation('Location permission denied');
        setIsLoadingLocation(false);
        Alert.alert(
          'Location Permission',
          'Please enable location access to see your current location and get better service recommendations.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Get current location
      await getCurrentLocation();
      
      // Start watching location changes
      startLocationTracking();
      
    } catch (error) {
      setCurrentLocation('Unable to get location');
      setIsLoadingLocation(false);
    }
  };

  // Get current location once
  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      await reverseGeocode(location.coords.latitude, location.coords.longitude);
    } catch (error) {
      setCurrentLocation('Unable to get location');
      setIsLoadingLocation(false);
    }
  };

  // Start watching location changes
  const startLocationTracking = async () => {
    try {
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          distanceInterval: 100, // Update every 100 meters
          timeInterval: 30000, // Or every 30 seconds
        },
        (location) => {
          reverseGeocode(location.coords.latitude, location.coords.longitude);
        }
      );
      
      setLocationSubscription(subscription);
    } catch (error) {
      // Silent error handling for location tracking
    }
  };

  const persistCheckoutAddress = async ({ street, city, district, region, postalCode, fallback }) => {
    try {
      const addressLine = [street, region].filter(Boolean).join(', ') || fallback || '';
      const cityValue = city || district || region || '';
      const pincodeValue = postalCode || '';
      const operations = [];
      if (addressLine) operations.push(['@checkout_address', addressLine]);
      if (cityValue) operations.push(['@checkout_city', cityValue]);
      if (pincodeValue) operations.push(['@checkout_pincode', pincodeValue]);
      if (operations.length > 0) {
        await AsyncStorage.multiSet(operations);
      }
    } catch (error) {}
  };

  // Convert coordinates to address
  const reverseGeocode = async (latitude, longitude) => {
    try {
      const addresses = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      
      if (addresses && addresses.length > 0) {
        const address = addresses[0];
        const locationString = [
          address.street || address.name,
          address.city || address.district,
        ]
          .filter(Boolean)
          .join(', ');
        
        setCurrentLocation(locationString || 'Unknown location');
        await persistCheckoutAddress({
          street: address.street || address.name,
          city: address.city,
          district: address.district,
          region: address.region,
          postalCode: address.postalCode,
          fallback: locationString,
        });
      } else {
        setCurrentLocation('Unknown location');
      }
    } catch (error) {
      setCurrentLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  // Handle vehicle selector press
  const handleVehicleSelectorPress = () => {
    navigation.navigate('BrandSelection');
  };

  // Handle banner scroll
  const handleBannerScroll = (event) => {
    if (event?.nativeEvent?.contentOffset) {
      const scrollPosition = event.nativeEvent.contentOffset.x;
      const index = Math.round(scrollPosition / (BANNER_WIDTH + BANNER_SPACING));
      setActiveBannerIndex(index);
    }
  };

  // Handle offer scroll
  const handleOfferScroll = (event) => {
    if (event?.nativeEvent?.contentOffset) {
      const scrollPosition = event.nativeEvent.contentOffset.x;
      const index = Math.round(scrollPosition / (BANNER_WIDTH + BANNER_SPACING));
      setActiveOfferIndex(index);
    }
  };

  const renderBanner = ({ item }) => (
    <View
      style={styles.bannerCard}
    >
      {item.image_url && typeof item.image_url === 'string' ? (
        <Image
          source={{ uri: item.image_url }}
          style={styles.bannerImage}
          resizeMode="contain"
        />
      ) : (
        <View style={styles.bannerTextContent}>
          <Text style={styles.bannerTitle}>{item.title}</Text>
          <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
          <TouchableOpacity style={styles.bannerButton}>
            <Text style={styles.bannerButtonText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderOffer = ({ item }) => (
    <View
      style={styles.bannerCard}
    >
      {item.image_url && typeof item.image_url === 'string' ? (
        <Image
          source={{ uri: item.image_url }}
          style={styles.bannerImage}
          resizeMode="contain"
        />
      ) : (
        <View style={styles.bannerTextContent}>
          <Text style={styles.offerTitle}>{item.title}</Text>
          {item.discount && <Text style={styles.offerDiscount}>{item.discount}</Text>}
          <Text style={styles.offerSubtitle}>{item.subtitle}</Text>
        </View>
      )}
    </View>
  );

  // Render pagination dots for banners
  const renderPaginationDots = () => (
    <View style={styles.paginationContainer}>
      {promotionalBanners.map((_, index) => (
        <View
          key={index}
          style={[
            styles.paginationDot,
            index === activeBannerIndex && styles.paginationDotActive,
          ]}
        />
      ))}
    </View>
  );

  // Render pagination dots for offers
  const renderOfferPaginationDots = () => (
    <View style={styles.paginationContainer}>
      {specialOffers.map((_, index) => (
        <View
          key={index}
          style={[
            styles.paginationDot,
            index === activeOfferIndex && styles.paginationDotActive,
          ]}
        />
      ))}
    </View>
  );

  // Dynamic gradient colors for each service (cycles through premium palettes)
  const getServiceGradient = (index) => {
    const gradients = [
      ['#6366F1', '#8B5CF6'], // Indigo to Purple
      ['#EC4899', '#F43F5E'], // Pink to Rose
      ['#10B981', '#059669'], // Emerald to Green
      ['#F59E0B', '#EF4444'], // Amber to Red
      ['#3B82F6', '#06B6D4'], // Blue to Cyan
      ['#8B5CF6', '#D946EF'], // Purple to Fuchsia
      ['#14B8A6', '#06B6D4'], // Teal to Cyan
      ['#F97316', '#DC2626'], // Orange to Red
    ];
    return gradients[index % gradients.length];
  };

  const handleServicePress = (service) => {
    navigation.navigate('ServiceDetails', { service });
  };

  const ServiceCard = ({ service, gradientIndex, variant }) => {
    const gradientColors = getServiceGradient(gradientIndex);
    const serviceName = (service?.name || '').trim();
    const isIconEnhanced = serviceName === 'Periodic Service' || serviceName === 'Denting & Painting';
    const iconSize = variant === 'featured' ? (isIconEnhanced ? 64 : 50) : isIconEnhanced ? 52 : 38;

    return (
      <TouchableOpacity
        style={[
          styles.serviceCard,
          variant === 'featured' ? styles.featuredServiceCard : styles.compactServiceCard,
        ]}
        activeOpacity={0.7}
        onPress={() => handleServicePress(service)}
      >
        <View style={styles.glassLayer} />
        <LinearGradient
          colors={[...gradientColors, 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.serviceGradientBg,
            variant === 'featured' && styles.featuredServiceGradientBg,
            variant === 'compact' && styles.compactServiceGradientBg,
          ]}
        />
        <View
          style={[
            styles.serviceIconWrapper,
            variant === 'featured' ? styles.featuredServiceIconWrapper : styles.compactServiceIconWrapper,
          ]}
        >
          {service.image_url && typeof service.image_url === 'string' ? (
            <View
              style={[
                styles.serviceImageContainer,
                variant === 'featured' && styles.featuredServiceImageContainer,
                variant === 'compact' && styles.compactServiceImageContainer,
              ]}
            >
              <LinearGradient
                colors={[...gradientColors.map((c) => c + '15')]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.imageBackdrop}
              />
              <Image
                source={{ uri: service.image_url }}
                style={[
                  styles.serviceImage,
                  variant === 'featured' && styles.featuredServiceImage,
                  variant === 'compact' && styles.compactServiceImage,
                ]}
                resizeMode="contain"
              />
            </View>
          ) : (
            <LinearGradient
              colors={gradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.serviceIconBg,
                isIconEnhanced && styles.serviceIconBgLarge,
                variant === 'featured' && styles.featuredServiceIconBg,
                variant === 'compact' && styles.compactServiceIconBg,
              ]}
            >
              <Ionicons name="construct" size={iconSize} color="#FFFFFF" />
            </LinearGradient>
          )}
        </View>
        <Text
          style={[
            styles.serviceName,
            variant === 'featured' ? styles.featuredServiceName : styles.compactServiceName,
          ]}
          numberOfLines={variant === 'featured' ? 3 : 2}
        >
          {service.name}
        </Text>
        <View style={styles.shimmerOverlay} />
      </TouchableOpacity>
    );
  };

  const featuredServices = services.slice(0, 2);
  const compactServices = services.slice(2);

  const renderCompactService = ({ item, index }) => (
    <ServiceCard
      service={item}
      gradientIndex={index + featuredServices.length}
      variant="compact"
    />
  );

  return (
    <View style={styles.container}>
      {/* Clean Premium Header - Fixed */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.headerContent}>
          {/* Left Section */}
          <View style={styles.leftSection}>
            {/* Location Row */}
            <View style={styles.locationRow}>
              <Ionicons name="location-sharp" size={16} color={Colors.PRIMARY} />
              {isLoadingLocation ? (
                <View style={styles.locationLoading}>
                  <ActivityIndicator size="small" color={Colors.PRIMARY} />
                  <Text style={styles.locationText}>Getting location...</Text>
                </View>
              ) : (
                <Text style={styles.locationText} numberOfLines={1}>
                  {currentLocation}
                </Text>
              )}
            </View>

            {/* Search Bar */}
            <View style={styles.searchBar}>
              <Ionicons name="search-outline" size={18} color={Colors.TEXT_SECONDARY} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search services..."
                placeholderTextColor={Colors.TEXT_SECONDARY}
              />
            </View>
          </View>

          {/* Right Section - Big Vehicle Selector */}
          <TouchableOpacity 
            style={styles.vehicleSelector}
            onPress={handleVehicleSelectorPress}
            activeOpacity={0.8}
          >
            <View style={styles.vehicleContent}>
              {selectedVehicle ? (
                <>
                  {selectedVehicle.model?.image_url ? (
                    <Image
                      source={{ uri: selectedVehicle.model.image_url }}
                      style={styles.vehicleImage}
                      resizeMode="contain"
                    />
                  ) : (
                    <Ionicons name="car-sport" size={40} color={Colors.PRIMARY} />
                  )}
                  <View style={styles.vehicleInfo}>
                    <Text style={styles.vehicleModel} numberOfLines={1}>
                      {selectedVehicle.model?.name}
                    </Text>
                  </View>
                </>
              ) : (
                <>
                  <Ionicons name="car-sport-outline" size={40} color={Colors.TEXT_SECONDARY} />
                  <View style={styles.vehicleInfo}>
                    <Text style={styles.vehiclePlaceholder}>Select Vehicle</Text>
                    <Text style={styles.vehiclePlaceholderSub}>Tap to choose</Text>
                  </View>
                </>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Spacing.TAB_BAR_HEIGHT + insets.bottom + 16 }}
      >
        {/* Banner Carousel - Only show if banners are available */}
        {promotionalBanners.length > 0 && (
          <View style={styles.section}>
            <FlatList
              ref={bannerFlatListRef}
              data={promotionalBanners}
              renderItem={renderBanner}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.bannerContainer}
              snapToInterval={BANNER_WIDTH + BANNER_SPACING}
              decelerationRate="fast"
              pagingEnabled={false}
              snapToAlignment="start"
              onScroll={handleBannerScroll}
              scrollEventThrottle={16}
              getItemLayout={(data, index) => ({
                length: BANNER_WIDTH + BANNER_SPACING,
                offset: (BANNER_WIDTH + BANNER_SPACING) * index,
                index,
              })}
            />
          </View>
        )}

        {/* Ultra-Premium Services Section */}
        <View style={styles.servicesSection}>
          {/* Elite Section Header with Gradient */}
          <View style={styles.servicesSectionHeader}>
            <View style={styles.servicesTitleRow}>
              <View style={styles.titleWithIcon}>
                <LinearGradient
                  colors={['#6366F1', '#8B5CF6', '#D946EF']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.titleGradientIcon}
                >
                  <Ionicons name="sparkles" size={22} color="#FFFFFF" />
                </LinearGradient>
                <Text style={styles.servicesSectionTitle}>Our Car Services</Text>
              </View>
            </View>
            <Text style={styles.servicesSectionSubtitle}>
              Car Services & Mechanical Repairs Are Simplified
            </Text>
          </View>

          {isLoadingServices ? (
            <View style={styles.servicesLoadingContainer}>
              <ActivityIndicator size="large" color={Colors.PRIMARY} />
              <Text style={styles.loadingText}>Loading services...</Text>
            </View>
          ) : services.length > 0 ? (
            <>
              {featuredServices.length > 0 && (
                <View style={styles.featuredServicesRow}>
                  {featuredServices.map((service, index) => (
                    <ServiceCard
                      key={String(service?.id ?? index)}
                      service={service}
                      gradientIndex={index}
                      variant="featured"
                    />
                  ))}
                </View>
              )}
              {compactServices.length > 0 && (
                <FlatList
                  data={compactServices}
                  renderItem={renderCompactService}
                  numColumns={3}
                  keyExtractor={(item) => item.id.toString()}
                  scrollEnabled={false}
                  contentContainerStyle={styles.compactServicesGrid}
                  columnWrapperStyle={styles.compactServicesRow}
                />
              )}
            </>
          ) : (
            <View style={styles.servicesLoadingContainer}>
              <Text style={styles.emptyText}>No services available</Text>
            </View>
          )}
        </View>

        {/* Special Offers Carousel - Only show if offers are available */}
        {specialOffers.length > 0 && (
          <View style={styles.section}>
            <View style={styles.specialOffersSectionHeader}>
              <View style={styles.servicesTitleRow}>
                <View style={styles.titleWithIcon}>
                  <LinearGradient
                    colors={['#F97316', '#DC2626', '#EF4444']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.titleGradientIcon}
                  >
                    <Ionicons name="pricetag" size={22} color="#FFFFFF" />
                  </LinearGradient>
                  <Text style={styles.servicesSectionTitle}>Special Offers</Text>
                </View>
              </View>
              <Text style={styles.servicesSectionSubtitle}>
                Exclusive car deals and limited-time offers
              </Text>
            </View>
            <FlatList
              ref={offerFlatListRef}
              data={specialOffers}
              renderItem={renderOffer}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.bannerContainer}
              snapToInterval={BANNER_WIDTH + BANNER_SPACING}
              decelerationRate="fast"
              pagingEnabled={false}
              snapToAlignment="start"
              onScroll={handleOfferScroll}
              scrollEventThrottle={16}
              getItemLayout={(data, index) => ({
                length: BANNER_WIDTH + BANNER_SPACING,
                offset: (BANNER_WIDTH + BANNER_SPACING) * index,
                index,
              })}
            />
          </View>
        )}

        {/* Benefits Comparison Table - Fully Responsive */}
        <View style={styles.benefitsSection}>
          <View style={styles.benefitsSectionHeader}>
            <View style={styles.servicesTitleRow}>
              <View style={styles.titleWithIcon}>
                <LinearGradient
                  colors={['#10B981', '#059669', '#047857']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.titleGradientIcon}
                >
                  <Ionicons name="shield-checkmark" size={20} color="#FFFFFF" />
                </LinearGradient>
                <Text style={styles.servicesSectionTitle}>GoClutch Benefits</Text>
              </View>
            </View>
            <Text style={styles.servicesSectionSubtitle}>
              💎 Compare Standard vs Premium
            </Text>
          </View>

          <View style={styles.benefitsTableCard}>
            {/* Table Header - Clean & Professional */}
            <View style={styles.benefitsTableHeader}>
              <View style={styles.benefitsFeatureColumn}>
                <Text style={styles.benefitsTableHeaderText}>Features</Text>
              </View>
              <View style={styles.benefitsPlanColumn}>
                <LinearGradient
                  colors={['#10B981', '#059669', '#047857']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.premiumHeaderGradient}
                >
                  <Ionicons name="shield-checkmark" size={10} color="#FFFFFF" />
                  <Text style={styles.benefitsPremiumHeaderText}>Go Clutch</Text>
                </LinearGradient>
              </View>
              <View style={styles.benefitsPlanColumn}>
                <Text style={styles.benefitsTableHeaderText}>Local Garage</Text>
              </View>
            </View>

            {/* Table Rows - Optimized for Readability */}
            <View style={styles.benefitsTableRow}>
              <View style={styles.benefitsFeatureColumn}>
                <Ionicons name="car-outline" size={14} color="#6B7280" style={styles.featureIcon} />
                <Text style={styles.benefitsFeatureText}>Free pick up & drop</Text>
              </View>
              <View style={styles.benefitsPlanColumn}>
                <Ionicons name="checkmark-circle" size={18} color="#10B981" />
              </View>
              <View style={styles.benefitsPlanColumn}>
                <Ionicons name="close-circle" size={18} color="#EF4444" />
              </View>
            </View>

            <View style={[styles.benefitsTableRow, styles.benefitsRowAlternate]}>
              <View style={styles.benefitsFeatureColumn}>
                <Ionicons name="notifications-outline" size={14} color="#6B7280" style={styles.featureIcon} />
                <Text style={styles.benefitsFeatureText}>Live updates</Text>
              </View>
              <View style={styles.benefitsPlanColumn}>
                <Ionicons name="checkmark-circle" size={18} color="#10B981" />
              </View>
              <View style={styles.benefitsPlanColumn}>
                <Ionicons name="close-circle" size={18} color="#EF4444" />
              </View>
            </View>

            <View style={styles.benefitsTableRow}>
              <View style={styles.benefitsFeatureColumn}>
                <Ionicons name="construct-outline" size={14} color="#6B7280" style={styles.featureIcon} />
                <Text style={styles.benefitsFeatureText}>Experienced Mechanics</Text>
              </View>
              <View style={styles.benefitsPlanColumn}>
                <Ionicons name="checkmark-circle" size={18} color="#10B981" />
              </View>
              <View style={styles.benefitsPlanColumn}>
                <Ionicons name="close-circle" size={18} color="#EF4444" />
              </View>
            </View>

            <View style={[styles.benefitsTableRow, styles.benefitsRowAlternate]}>
              <View style={styles.benefitsFeatureColumn}>
                <Ionicons name="shield-checkmark-outline" size={14} color="#6B7280" style={styles.featureIcon} />
                <Text style={styles.benefitsFeatureText}>Warranty</Text>
              </View>
              <View style={styles.benefitsPlanColumn}>
                <Ionicons name="checkmark-circle" size={18} color="#10B981" />
              </View>
              <View style={styles.benefitsPlanColumn}>
                <Ionicons name="close-circle" size={18} color="#EF4444" />
              </View>
            </View>

            <View style={styles.benefitsTableRow}>
              <View style={styles.benefitsFeatureColumn}>
                <Ionicons name="cube-outline" size={14} color="#6B7280" style={styles.featureIcon} />
                <Text style={styles.benefitsFeatureText}>Genuine Spares</Text>
              </View>
              <View style={styles.benefitsPlanColumn}>
                <Ionicons name="checkmark-circle" size={18} color="#10B981" />
              </View>
              <View style={styles.benefitsPlanColumn}>
                <Ionicons name="close-circle" size={18} color="#EF4444" />
              </View>
            </View>

            <View style={[styles.benefitsTableRow, styles.benefitsRowAlternate, styles.benefitsRowLast]}>
              <View style={styles.benefitsFeatureColumn}>
                <Ionicons name="pricetag-outline" size={14} color="#6B7280" style={styles.featureIcon} />
                <Text style={styles.benefitsFeatureText}>Affordable prices</Text>
              </View>
              <View style={styles.benefitsPlanColumn}>
                <Ionicons name="checkmark-circle" size={18} color="#10B981" />
              </View>
              <View style={styles.benefitsPlanColumn}>
                <Ionicons name="close-circle" size={18} color="#EF4444" />
              </View>
            </View>

            {/* Subscription CTA - Compact Button */}
            <TouchableOpacity 
              style={styles.benefitsSubscribeButton}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['#fe5110', '#e63900']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.benefitsSubscribeGradient}
              >
                <View style={styles.subscribeButtonContent}>
                  <Ionicons name="rocket" size={18} color="#FFFFFF" />
                  <Text style={styles.benefitsSubscribeText}>Upgrade to Premium</Text>
                  <View style={styles.priceBadge}>
                    <Text style={styles.benefitsSubscribePrice}>₹999/mo</Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Premium Referral Section */}
        <View style={[styles.section, { marginTop: 20 }]}>
          <LinearGradient
            colors={['#6366F1', '#8B5CF6', '#D946EF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.referralCard}
          >
            <View style={styles.referralContent}>
              {/* Left Content Section */}
              <View style={styles.referralTextSection}>
                <Text style={styles.referralTitle} numberOfLines={1} adjustsFontSizeToFit>Refer & Earn</Text>
                
                <View style={styles.cashbackHighlight}>
                  <Text style={styles.referralAmount}>₹200</Text>
                  <Text style={styles.cashbackLabel}>CASHBACK</Text>
                </View>
                
                <Text style={styles.referralSubtitle}>
                  For every friend who joins GoClutch
                </Text>
                
                <TouchableOpacity style={styles.referralButton} activeOpacity={0.85}>
                  <LinearGradient
                    colors={['#FFFFFF', '#F8F9FF']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.referralButtonGradient}
                  >
                    <Ionicons name="share-social" size={18} color="#6366F1" />
                    <Text style={styles.referralButtonText}>Share & Earn</Text>
                    <Ionicons name="arrow-forward" size={18} color="#6366F1" />
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              {/* Right Image Section */}
              <View style={styles.referralImageSection}>
                <Image 
                  source={require('../../assets/referfriend.png')} 
                  style={styles.referralImage}
                  resizeMode="contain"
                />
              </View>
            </View>
          </LinearGradient>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.PAGE_BACKGROUND,
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5E5',
  },
  headerContent: {
    flexDirection: 'row',
    gap: 12,
  },
  leftSection: {
    flex: 3,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: '#E8EAED',
  },
  locationText: {
    flex: 1,
    fontSize: 13,
    color: Colors.TEXT_PRIMARY,
    fontWeight: '600',
  },
  locationLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 0.5,
    borderColor: '#E8EAED',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.TEXT_PRIMARY,
    padding: 0,
  },
  vehicleSelector: {
    justifyContent: 'center',
  },
  vehicleContent: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  vehicleImage: {
    width: 60,
    height: 60,
  },
  vehicleInfo: {
    width: '100%',
    alignItems: 'center',
  },
  vehicleBrand: {
    fontSize: 10,
    color: Colors.TEXT_SECONDARY,
    fontWeight: '500',
    textAlign: 'center',
  },
  vehicleModel: {
    fontSize: 13,
    color: Colors.TEXT_PRIMARY,
    fontWeight: '700',
    textAlign: 'center',
  },
  vehicleVariant: {
    fontSize: 10,
    color: Colors.TEXT_SECONDARY,
    marginTop: 2,
    textAlign: 'center',
  },
  vehiclePlaceholder: {
    fontSize: 13,
    color: Colors.TEXT_SECONDARY,
    fontWeight: '600',
    textAlign: 'center',
  },
  vehiclePlaceholderSub: {
    fontSize: 10,
    color: Colors.TEXT_SECONDARY,
    marginTop: 2,
    textAlign: 'center',
  },
  section: {
    marginVertical: 0,
    backgroundColor: 'transparent',
  },
  sectionTitle: {
    fontSize: Typography.HEADING_S,
    fontWeight: 'bold',
    color: Colors.TEXT_PRIMARY,
    marginHorizontal: Spacing.SCREEN_HORIZONTAL,
    marginBottom: Spacing.M,
  },
  bannerContainer: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  bannerCard: {
    width: BANNER_WIDTH,
    height: 240,
    borderRadius: 0,
    padding: 0,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: BANNER_SPACING,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.M,
    paddingBottom: Spacing.S,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.TEXT_SECONDARY,
    opacity: 0.3,
    marginHorizontal: 4,
  },
  paginationDotActive: {
    width: 24,
    backgroundColor: Colors.PRIMARY,
    opacity: 1,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerTextContent: {
    width: '100%',
    height: '100%',
    padding: Spacing.L,
    justifyContent: 'space-between',
  },
  bannerTitle: {
    fontSize: Typography.HEADING_S,
    fontWeight: 'bold',
    color: Colors.LIGHT_BACKGROUND,
  },
  bannerSubtitle: {
    fontSize: Typography.BODY_M,
    color: Colors.LIGHT_BACKGROUND,
    opacity: 0.9,
  },
  bannerButton: {
    backgroundColor: Colors.LIGHT_BACKGROUND,
    paddingHorizontal: Spacing.L,
    paddingVertical: Spacing.S,
    borderRadius: Spacing.BORDER_RADIUS_S,
    alignSelf: 'flex-start',
  },
  bannerButtonText: {
    fontSize: Typography.BODY_S,
    fontWeight: '600',
    color: Colors.PRIMARY,
  },
  // Ultra-Premium Services Section Styles
  servicesSection: {
    marginTop: Spacing.M,
    marginBottom: Spacing.S,
    backgroundColor: '#F9F9F9',
    marginHorizontal: -16,
    paddingHorizontal: 16,
    paddingVertical: Spacing.M,
  },
  servicesSectionHeader: {
    paddingHorizontal: Spacing.SCREEN_HORIZONTAL,
    marginBottom: 16,
  },
  specialOffersSectionHeader: {
    paddingHorizontal: Spacing.SCREEN_HORIZONTAL,
    marginBottom: 16,
  },
  servicesTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.XS,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  titleGradientIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    flexShrink: 0,
  },
  servicesSectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.TEXT_PRIMARY,
    letterSpacing: -0.3,
    flexShrink: 1,
  },
  serviceBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  serviceBadgeText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  servicesSectionSubtitle: {
    fontSize: 13,
    color: Colors.TEXT_SECONDARY,
    lineHeight: 18,
    marginTop: 4,
    fontWeight: '500',
  },
  // Category Pills
  categoryScrollContainer: {
    marginTop: 8,
  },
  categoryContainer: {
    paddingVertical: 4,
    gap: 8,
  },
  categoryPill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
    borderWidth: 1.5,
    borderColor: 'rgba(99, 102, 241, 0.12)',
    marginRight: 8,
  },
  categoryPillActive: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  categoryPillText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.PRIMARY,
  },
  categoryPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  servicesGrid: {
    paddingHorizontal: Spacing.SCREEN_HORIZONTAL - 6,
    paddingTop: 4,
  },
  servicesRow: {
    justifyContent: 'space-between',
  },
  featuredServicesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.SCREEN_HORIZONTAL - 4,
    marginBottom: 12,
  },
  compactServicesGrid: {
    paddingHorizontal: Spacing.SCREEN_HORIZONTAL - 4,
    paddingTop: 2,
    paddingBottom: 2,
  },
  compactServicesRow: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  serviceCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 6,
    marginBottom: 16,
    minHeight: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
  },
  featuredServiceCard: {
    marginHorizontal: 8,
    padding: 18,
    minHeight: 200,
  },
  compactServiceCard: {
    marginHorizontal: 4,
    marginBottom: 12,
    padding: 12,
    minHeight: 120,
  },
  serviceCardLeft: {
    // Slight animation offset for left cards
  },
  serviceCardRight: {
    // Slight animation offset for right cards
  },
  // Glassmorphism effect
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
    width: 120,
    height: 120,
    borderRadius: 60,
    opacity: 0.15,
  },
  featuredServiceGradientBg: {
    width: 190,
    height: 190,
    borderRadius: 95,
    opacity: 0.2,
  },
  compactServiceGradientBg: {
    width: 100,
    height: 100,
    borderRadius: 50,
    opacity: 0.16,
  },
  // Popular Badge
  popularBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  popularBadgeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 4,
  },
  popularBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  serviceIconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    zIndex: 2,
  },
  featuredServiceIconWrapper: {
    marginBottom: 14,
  },
  compactServiceIconWrapper: {
    marginBottom: 8,
  },
  serviceIcon: {
    width: 70,
    height: 70,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceIconBg: {
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  featuredServiceIconBg: {
    width: 78,
    height: 78,
    borderRadius: 26,
  },
  compactServiceIconBg: {
    width: 56,
    height: 56,
    borderRadius: 18,
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  serviceIconBgLarge: {
    width: 72,
    height: 72,
    borderRadius: 24,
    shadowOffset: { width: 0, height: 6 },
  },
  serviceImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  serviceImageContainerLarge: {
    width: 72,
    height: 72,
    borderRadius: 24,
  },
  featuredServiceImageContainer: {
    width: 90,
    height: 90,
    borderRadius: 30,
  },
  compactServiceImageContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
  },
  imageBackdrop: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  serviceImage: {
    width: '88%',
    height: '88%',
    zIndex: 2,
  },
  serviceImageLarge: {
    width: '100%',
    height: '100%',
  },
  featuredServiceImage: {
    width: '95%',
    height: '95%',
  },
  compactServiceImage: {
    width: '86%',
    height: '86%',
  },
  serviceName: {
    fontSize: 18,
    color: Colors.TEXT_PRIMARY,
    fontWeight: '800',
    lineHeight: 24,
    marginBottom: 2,
    textAlign: 'center',
    zIndex: 2,
  },
  featuredServiceName: {
    fontSize: 20,
    lineHeight: 26,
  },
  compactServiceName: {
    fontSize: 16,
    lineHeight: 22,
  },
  // Price Container
  servicePriceContainer: {
    marginBottom: 8,
    zIndex: 2,
  },
  servicePriceLabel: {
    fontSize: 11,
    color: Colors.TEXT_SECONDARY,
    fontWeight: '500',
    marginBottom: 2,
  },
  servicePrice: {
    fontSize: 18,
    color: Colors.TEXT_PRIMARY,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  serviceArrow: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 10,
  },
  // Shimmer overlay effect
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    left: -100,
    width: 100,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    transform: [{ skewX: '-20deg' }],
  },
  viewAllButtonContainer: {
    marginHorizontal: Spacing.SCREEN_HORIZONTAL,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 12,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
    gap: 12,
  },
  viewAllText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  viewAllIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  servicesLoadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: Typography.BODY_M,
    color: Colors.TEXT_SECONDARY,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: Typography.BODY_M,
    color: Colors.TEXT_SECONDARY,
    textAlign: 'center',
  },
  referralCard: {
    marginHorizontal: Spacing.SCREEN_HORIZONTAL,
    borderRadius: 16,
    padding: 16,
    paddingVertical: 20,
    elevation: 6,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  decorativeCircle1: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    top: -40,
    right: -30,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    bottom: -30,
    left: -20,
  },
  sparkle1: {
    position: 'absolute',
    top: 15,
    right: 30,
    zIndex: 2,
  },
  sparkle2: {
    position: 'absolute',
    bottom: 20,
    right: 50,
    zIndex: 2,
  },
  sparkle3: {
    position: 'absolute',
    top: 50,
    left: 15,
    zIndex: 2,
  },
  referralContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    zIndex: 1,
  },
  referralTextSection: {
    flex: 1,
    paddingRight: 12,
    minWidth: 0,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleIcon: {
    marginLeft: 8,
  },
  referralTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.3,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    marginBottom: 10,
    flexShrink: 1,
  },
  cashbackHighlight: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  referralAmount: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    lineHeight: 30,
  },
  cashbackLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.9)',
    letterSpacing: 1.2,
    marginTop: -1,
  },
  referralSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.95)',
    lineHeight: 16,
    marginBottom: 14,
    fontWeight: '500',
    flexShrink: 1,
  },
  referralImageSection: {
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    flexShrink: 0,
  },
  imageGlow: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
  },
  referralImage: {
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  referralButton: {
    borderRadius: 24,
    alignSelf: 'flex-start',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  referralButtonGradient: {
    paddingVertical: 11,
    paddingHorizontal: 18,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.2)',
  },
  referralButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#6366F1',
    letterSpacing: 0.2,
  },
  offerTitle: {
    fontSize: Typography.HEADING_S,
    fontWeight: 'bold',
    color: Colors.LIGHT_BACKGROUND,
    marginBottom: Spacing.XS,
  },
  offerDiscount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.LIGHT_BACKGROUND,
    marginVertical: Spacing.S,
  },
  offerSubtitle: {
    fontSize: Typography.BODY_M,
    color: Colors.LIGHT_BACKGROUND,
    opacity: 0.9,
  },
  // ===== BENEFITS TABLE - FULLY RESPONSIVE STYLES =====
  benefitsSection: {
    marginTop: Spacing.XL,
    marginBottom: Spacing.L,
  },
  benefitsSectionHeader: {
    marginBottom: 14,
    paddingHorizontal: Spacing.SCREEN_HORIZONTAL,
  },
  benefitsTableCard: {
    marginHorizontal: Spacing.SCREEN_HORIZONTAL,
    backgroundColor: Colors.LIGHT_BACKGROUND,
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  benefitsTableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1.5,
    borderBottomColor: '#E9ECEF',
  },
  benefitsFeatureColumn: {
    flex: 1.8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingRight: 4,
    minWidth: 0,
  },
  featureIcon: {
    marginRight: 6,
    flexShrink: 0,
  },
  benefitsPlanColumn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 0,
    paddingHorizontal: 3,
  },
  benefitsTableHeaderText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#495057',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.2,
    flexShrink: 1,
  },
  premiumHeaderGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 8,
    gap: 2,
    width: '100%',
  },
  benefitsPremiumHeaderText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.1,
    flexShrink: 1,
  },
  benefitsTableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F5',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    minHeight: 46,
  },
  benefitsRowAlternate: {
    backgroundColor: '#FAFBFC',
  },
  benefitsRowLast: {
    borderBottomWidth: 0,
  },
  benefitsFeatureText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#212529',
    lineHeight: 18,
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  benefitsValueText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6C757D',
    textAlign: 'center',
    flexShrink: 1,
  },
  benefitsPremiumValueText: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.PRIMARY,
    textAlign: 'center',
    flexShrink: 1,
  },
  benefitsSubscribeButton: {
    marginTop: 12,
    marginHorizontal: 10,
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: Colors.PRIMARY,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  benefitsSubscribeGradient: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  subscribeButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  benefitsSubscribeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
    flex: 1,
    marginLeft: 8,
  },
  priceBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 8,
  },
  benefitsSubscribePrice: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
});

export default HomeScreen;