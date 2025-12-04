import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import { Spacing } from '../constants/Spacing';
import SearchBar from '../components/SearchBar';
import CarouselBanner from '../components/CarouselBanner';
import CategoryCard from '../components/CategoryCard';
import BrandLogoCarousel from '../components/BrandLogoCarousel';
import { useCart } from '../context/CartContext';

// Mock data for categories
const CATEGORIES = [
  { id: '1', name: 'Lubricants', icon: '🫗', image: require('../../assets/accessories/lubricant.png') },
  { id: '2', name: 'Tyres', icon: '🛞', image: require('../../assets/accessories/tyres.png') },
  { id: '3', name: 'Batteries', icon: '🔋', image: require('../../assets/accessories/battery.png') },
  { id: '4', name: 'Coolants', icon: '❄️', image: require('../../assets/accessories/coolant.png') },
  { id: '5', name: 'Filters', icon: '🔍', image: require('../../assets/accessories/oil-filter.png') },
  { id: '6', name: 'Wipers', icon: '💨', image: require('../../assets/accessories/wiper.png') },
];

// Mock data for brands - using product images
const BRANDS = [
  { id: '1', name: 'Exide', image: require('../../assets/accessories/products/Exide.png') },
  { id: '2', name: 'Amaron', image: require('../../assets/accessories/products/Amaron.png') },
  { id: '3', name: 'MRF', image: require('../../assets/accessories/products/MRF.png') },
  { id: '4', name: 'Apollo', image: require('../../assets/accessories/products/Apollo.png') },
  { id: '5', name: 'Bosch', image: require('../../assets/accessories/products/Bosch.png') },
  { id: '6', name: 'BREMBO', image: require('../../assets/accessories/products/BREMBO.png') },
  { id: '7', name: 'Castrol', image: require('../../assets/accessories/products/Castrol.png') },
  { id: '8', name: 'CEAT', image: require('../../assets/accessories/products/CEAT.png') },
  { id: '9', name: 'Continental', image: require('../../assets/accessories/products/Continental.png') },
  { id: '10', name: 'Denso', image: require('../../assets/accessories/products/Denso.png') },
  { id: '11', name: 'GABRIEL', image: require('../../assets/accessories/products/GABRIEL.png') },
  { id: '12', name: 'Go Clutch', image: require('../../assets/accessories/products/Go Clutch.png') },
  { id: '13', name: 'JK Tyres', image: require('../../assets/accessories/products/JKTyres.png') },
  { id: '14', name: 'LUMAX', image: require('../../assets/accessories/products/LUMAX.png') },
  { id: '15', name: 'Mobil', image: require('../../assets/accessories/products/Mobil.png') },
  { id: '16', name: 'Motul', image: require('../../assets/accessories/products/Motul.png') },
  { id: '17', name: 'PURALATOR', image: require('../../assets/accessories/products/PURALATOR.png') },
  { id: '18', name: 'Shell', image: require('../../assets/accessories/products/Shell.png') },
  { id: '19', name: 'TVS Go', image: require('../../assets/accessories/products/TVS Go.png') },
  { id: '20', name: 'Valeo', image: require('../../assets/accessories/products/Valeo.png') },
];

const ACCESSORY_BANNERS = [
  { id: 'banner-1', image: require('../../assets/accessories/Banners/1.png') },
  { id: 'banner-2', image: require('../../assets/accessories/Banners/2.png') },
  { id: 'banner-3', image: require('../../assets/accessories/Banners/3.png') },
  { id: 'banner-4', image: require('../../assets/accessories/Banners/4.png') },
];

const QUICK_SERVICES = [
  {
    id: '1',
    name: 'Quick Services',
    icon: 'flash',
    gradient: ['#EC4899', '#DB2777'],
  },
  {
    id: '2',
    name: 'Extended Warranty',
    icon: 'shield-checkmark',
    gradient: ['#10B981', '#059669'],
  },
  {
    id: '3',
    name: 'Reasonable Prices',
    icon: 'pricetag',
    gradient: ['#3B82F6', '#06B6D4'],
  },
  {
    id: '4',
    name: 'Same Day Delivery',
    icon: 'car',
    gradient: ['#F59E0B', '#EF4444'],
  },
];


const AccessoriesScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { getTotalItems } = useCart();

  const totalItems = getTotalItems();

  // Handle category selection
  const handleCategoryPress = useCallback((category) => {
    setSelectedCategory(category.id);
    navigation.navigate('CategoryProducts', { categoryId: category.id });
  }, [navigation]);





  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={28} color={Colors.TEXT_PRIMARY} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Accessories</Text>
          </View>
          <View style={{ width: 28 }} />
        </View>

        {/* Search Bar */}
        <SearchBar
          placeholder="Search accessories…"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {/* Promotional Banner Carousel */}
        <View style={styles.bannerSection}>
          <CarouselBanner banners={ACCESSORY_BANNERS} />
        </View>

        {/* Category Section */}
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <Ionicons name="grid" size={24} color={Colors.INFO} />
            <Text style={styles.sectionTitle}>Shop by Category</Text>
          </View>
          <FlatList
            data={CATEGORIES}
            renderItem={({ item }) => (
              <CategoryCard
                id={item.id}
                name={item.name}
                icon={item.icon}
                image={item.image}
                onPress={() => handleCategoryPress(item)}
              />
            )}
            keyExtractor={(item) => item.id}
            numColumns={3}
            columnWrapperStyle={styles.categoryGrid}
            scrollEnabled={false}
            contentContainerStyle={styles.categoryList}
          />
        </View>

        {/* Brands Section */}
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <Ionicons name="shield-checkmark" size={24} color={Colors.SUCCESS} />
            <Text style={styles.sectionTitle}>Genuine Products We Use</Text>
          </View>
          <Text style={styles.sectionSubtitle}>
            Trusted brands for quality car services
          </Text>
          <BrandLogoCarousel brands={BRANDS} />
        </View>

        {/* Quick Services Section */}
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <Ionicons name="star" size={24} color={Colors.WARNING} />
            <Text style={styles.sectionTitle}>GoClutch Benefits</Text>
          </View>
          <View style={styles.quickServicesContainer}>
            {QUICK_SERVICES.map((service) => (
              <View key={service.id} style={styles.serviceBoxWrapper}>
                <TouchableOpacity style={styles.serviceBoxTouchable} activeOpacity={0.7}>
                  <View style={styles.glassLayer} />
                  <LinearGradient
                    colors={[...service.gradient, 'transparent']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradientBg}
                  />
                  <View style={styles.serviceIconWrapper}>
                    <View style={[styles.serviceIconBg, { backgroundColor: Colors.PRIMARY + '08' }]}>
                      <Ionicons name={service.icon} size={32} color={Colors.PRIMARY} />
                    </View>
                  </View>
                  <Text style={styles.serviceBoxName} numberOfLines={2}>
                    {service.name}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: Spacing.XL * 2 }} />
      </ScrollView>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.PRIMARY} />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.PAGE_BACKGROUND,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.SCREEN_HORIZONTAL,
    paddingVertical: Spacing.M,
    paddingTop: Spacing.S,
    gap: Spacing.M,
  },
  headerContent: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  headerTitle: {
    fontSize: Typography.HEADING_L,
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
    marginBottom: Spacing.XS,
  },
  headerSubtitle: {
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_SECONDARY,
    fontWeight: '500',
  },
  section: {
    marginVertical: Spacing.S,
  },
  bannerSection: {
    marginTop: -Spacing.M,
    marginBottom: -Spacing.L,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.SCREEN_HORIZONTAL,
    marginBottom: Spacing.M,
    gap: Spacing.S,
  },
  sectionTitle: {
    fontSize: Typography.HEADING_S,
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
  },
  sectionSubtitle: {
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_SECONDARY,
    marginHorizontal: Spacing.SCREEN_HORIZONTAL,
    marginBottom: Spacing.M,
  },

  // Category Grid
  categoryList: {
    paddingHorizontal: Spacing.SCREEN_HORIZONTAL,
  },
  categoryGrid: {
    justifyContent: 'space-around',
    gap: 4,
  },

  // Quick Services Section
  quickServicesContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.SCREEN_HORIZONTAL,
    gap: Spacing.S,
  },
  serviceBoxWrapper: {
    flex: 1,
  },
  serviceBoxTouchable: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    overflow: 'hidden',
    position: 'relative',
    minHeight: 110,
    justifyContent: 'center',
  },
  glassLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    zIndex: 0,
  },
  gradientBg: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    opacity: 0.12,
    zIndex: 1,
  },
  serviceIconWrapper: {
    zIndex: 2,
    alignItems: 'center',
    marginBottom: Spacing.XS,
  },
  serviceIconBg: {
    width: 48,
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceBoxName: {
    fontSize: Typography.BODY_S,
    fontWeight: '600',
    color: Colors.TEXT_PRIMARY,
    textAlign: 'center',
    zIndex: 2,
  },

  // Loading
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
});

export default AccessoriesScreen;