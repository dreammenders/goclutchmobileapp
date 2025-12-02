import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import { Spacing } from '../constants/Spacing';
import { useCart } from '../context/CartContext';

const EnhancedServiceBrowser = ({ navigation, services = [], onServiceSelect }) => {
  const { addToCart, getTotalItems } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');

  // Mock data for demonstration - in real app this would come from API
  const mockServices = [
    {
      id: '1',
      name: 'AC Service',
      category: 'maintenance',
      price: 1200,
      discountPrice: 999,
      rating: 4.8,
      duration: '2-3 hours',
      availability: 'available',
      image: 'https://via.placeholder.com/120x120/FF8C42/FFFFFF?text=AC',
      features: ['Gas refill', 'Filter cleaning', 'Performance test'],
      popularity: 95,
    },
    {
      id: '2',
      name: 'Oil Change',
      category: 'maintenance',
      price: 800,
      discountPrice: 650,
      rating: 4.6,
      duration: '1 hour',
      availability: 'available',
      image: 'https://via.placeholder.com/120x120/10B981/FFFFFF?text=OIL',
      features: ['Synthetic oil', 'Filter replacement', 'Check all fluids'],
      popularity: 88,
    },
    {
      id: '3',
      name: 'Car Wash & Wax',
      category: 'detailing',
      price: 500,
      discountPrice: 399,
      rating: 4.7,
      duration: '45 mins',
      availability: 'limited',
      image: 'https://via.placeholder.com/120x120/6366F1/FFFFFF?text=WASH',
      features: ['Foam wash', 'Wax coating', 'Interior cleaning'],
      popularity: 82,
    },
    {
      id: '4',
      name: 'Brake Inspection',
      category: 'repair',
      price: 600,
      discountPrice: 499,
      rating: 4.9,
      duration: '1.5 hours',
      availability: 'available',
      image: 'https://via.placeholder.com/120x120/EF4444/FFFFFF?text=BRAKE',
      features: ['Pad inspection', 'Disc check', 'Fluid test'],
      popularity: 78,
    },
    {
      id: '5',
      name: 'Tire Replacement',
      category: 'repair',
      price: 3500,
      discountPrice: 2999,
      rating: 4.5,
      duration: '2 hours',
      availability: 'unavailable',
      image: 'https://via.placeholder.com/120x120/8B5CF6/FFFFFF?text=TIRE',
      features: ['Premium tires', 'Alignment', 'Balancing'],
      popularity: 75,
    },
  ];

  const categories = [
    { id: 'all', label: 'All Services', icon: 'apps' },
    { id: 'maintenance', label: 'Maintenance', icon: 'wrench' },
    { id: 'repair', label: 'Repair', icon: 'hammer-wrench' },
    { id: 'detailing', label: 'Detailing', icon: 'car-wash' },
  ];

  const sortOptions = [
    { id: 'popularity', label: 'Most Popular' },
    { id: 'price_low', label: 'Price: Low to High' },
    { id: 'price_high', label: 'Price: High to Low' },
    { id: 'rating', label: 'Highest Rated' },
  ];

  const availabilityOptions = [
    { id: 'all', label: 'All' },
    { id: 'available', label: 'Available Now' },
    { id: 'limited', label: 'Limited Slots' },
    { id: 'unavailable', label: 'Unavailable' },
  ];

  const filteredAndSortedServices = useMemo(() => {
    let filtered = mockServices;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.features.some(feature =>
          feature.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }

    // Availability filter
    if (availabilityFilter !== 'all') {
      filtered = filtered.filter(service => service.availability === availabilityFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price_low':
          return a.discountPrice - b.discountPrice;
        case 'price_high':
          return b.discountPrice - a.discountPrice;
        case 'rating':
          return b.rating - a.rating;
        case 'popularity':
        default:
          return b.popularity - a.popularity;
      }
    });

    return filtered;
  }, [searchQuery, selectedCategory, sortBy, availabilityFilter]);

  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case 'available': return Colors.SUCCESS;
      case 'limited': return Colors.WARNING;
      case 'unavailable': return Colors.ERROR;
      default: return Colors.TEXT_MUTED;
    }
  };

  const getAvailabilityText = (availability) => {
    switch (availability) {
      case 'available': return 'Available Now';
      case 'limited': return 'Limited Slots';
      case 'unavailable': return 'Unavailable';
      default: return 'Check Availability';
    }
  };

  const handleQuickAdd = (service) => {
    if (service.availability === 'unavailable') {
      Alert.alert('Service Unavailable', 'This service is currently unavailable. Please check back later.');
      return;
    }

    addToCart(service);
  };

  const renderServiceCard = ({ item: service }) => (
    <TouchableOpacity
      style={styles.serviceCard}
      onPress={() => onServiceSelect && onServiceSelect(service)}
    >
      <View style={styles.serviceImageContainer}>
        <Image source={{ uri: service.image }} style={styles.serviceImage} />
        <View style={[styles.availabilityBadge, { backgroundColor: getAvailabilityColor(service.availability) }]}>
          <Text style={styles.availabilityText}>{getAvailabilityText(service.availability)}</Text>
        </View>
      </View>

      <View style={styles.serviceContent}>
        <View style={styles.serviceHeader}>
          <Text style={styles.serviceName} numberOfLines={2}>{service.name}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.ratingText}>{service.rating}</Text>
          </View>
        </View>

        <Text style={styles.serviceDuration}>{service.duration}</Text>

        <View style={styles.featuresContainer}>
          {service.features.slice(0, 2).map((feature, index) => (
            <Text key={index} style={styles.featureText} numberOfLines={1}>
              • {feature}
            </Text>
          ))}
        </View>

        <View style={styles.priceContainer}>
          <View style={styles.priceSection}>
            <Text style={styles.discountPrice}>₹{service.discountPrice}</Text>
            <Text style={styles.originalPrice}>₹{service.price}</Text>
          </View>
          <TouchableOpacity
            style={[
              styles.addButton,
              service.availability === 'unavailable' && styles.addButtonDisabled
            ]}
            onPress={() => handleQuickAdd(service)}
            disabled={service.availability === 'unavailable'}
          >
            <Text style={[
              styles.addButtonText,
              service.availability === 'unavailable' && styles.addButtonTextDisabled
            ]}>
              {service.availability === 'unavailable' ? 'Unavailable' : 'Add'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryFilter = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.categoryContainer}
    >
      {categories.map(category => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.categoryButton,
            selectedCategory === category.id && styles.categoryButtonActive
          ]}
          onPress={() => setSelectedCategory(category.id)}
        >
          <MaterialCommunityIcons
            name={category.icon}
            size={20}
            color={selectedCategory === category.id ? Colors.LIGHT_BACKGROUND : Colors.PRIMARY}
          />
          <Text style={[
            styles.categoryText,
            selectedCategory === category.id && styles.categoryTextActive
          ]}>
            {category.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Colors.TEXT_MUTED} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search services..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={Colors.TEXT_MUTED}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close" size={20} color={Colors.TEXT_MUTED} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Category Filters */}
      {renderCategoryFilter()}

      {/* Sort and Filter Row */}
      <View style={styles.filterRow}>
        <TouchableOpacity style={styles.filterButton} onPress={() => {/* Open sort modal */}}>
          <MaterialCommunityIcons name="sort" size={16} color={Colors.PRIMARY} />
          <Text style={styles.filterText}>
            {sortOptions.find(option => option.id === sortBy)?.label}
          </Text>
          <Ionicons name="chevron-down" size={14} color={Colors.TEXT_MUTED} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.filterButton} onPress={() => {/* Open availability filter */}}>
          <MaterialCommunityIcons name="filter" size={16} color={Colors.PRIMARY} />
          <Text style={styles.filterText}>
            {availabilityOptions.find(option => option.id === availabilityFilter)?.label}
          </Text>
          <Ionicons name="chevron-down" size={14} color={Colors.TEXT_MUTED} />
        </TouchableOpacity>
      </View>

      {/* Results Count */}
      <Text style={styles.resultsText}>
        {filteredAndSortedServices.length} services found
      </Text>

      {/* Services List */}
      <FlatList
        data={filteredAndSortedServices}
        renderItem={renderServiceCard}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.servicesList}
        numColumns={2}
        columnWrapperStyle={styles.serviceRow}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.PAGE_BACKGROUND,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.CARD_BACKGROUND,
    borderRadius: Spacing.BORDER_RADIUS_M,
    margin: Spacing.M,
    paddingHorizontal: Spacing.M,
    paddingVertical: Spacing.S,
  },
  searchIcon: {
    marginRight: Spacing.S,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.BODY_M,
    color: Colors.TEXT_PRIMARY,
  },
  categoryContainer: {
    paddingHorizontal: Spacing.M,
    paddingBottom: Spacing.S,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.SECTION_BACKGROUND,
    borderRadius: Spacing.BORDER_RADIUS_M,
    paddingHorizontal: Spacing.M,
    paddingVertical: Spacing.S,
    marginRight: Spacing.S,
  },
  categoryButtonActive: {
    backgroundColor: Colors.PRIMARY,
  },
  categoryText: {
    fontSize: Typography.BODY_S,
    color: Colors.PRIMARY,
    marginLeft: Spacing.XS,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: Colors.LIGHT_BACKGROUND,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.M,
    marginBottom: Spacing.S,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.CARD_BACKGROUND,
    borderRadius: Spacing.BORDER_RADIUS_S,
    paddingHorizontal: Spacing.M,
    paddingVertical: Spacing.S,
  },
  filterText: {
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_PRIMARY,
    marginHorizontal: Spacing.XS,
  },
  resultsText: {
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_SECONDARY,
    paddingHorizontal: Spacing.M,
    marginBottom: Spacing.S,
  },
  servicesList: {
    paddingHorizontal: Spacing.M,
    paddingBottom: Spacing.XL,
  },
  serviceRow: {
    justifyContent: 'space-between',
    marginBottom: Spacing.M,
  },
  serviceCard: {
    backgroundColor: Colors.CARD_BACKGROUND,
    borderRadius: Spacing.BORDER_RADIUS_M,
    width: '48%',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceImageContainer: {
    position: 'relative',
  },
  serviceImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  availabilityBadge: {
    position: 'absolute',
    top: Spacing.S,
    right: Spacing.S,
    paddingHorizontal: Spacing.S,
    paddingVertical: Spacing.XS,
    borderRadius: Spacing.BORDER_RADIUS_S,
  },
  availabilityText: {
    fontSize: Typography.BODY_XS,
    color: Colors.LIGHT_BACKGROUND,
    fontWeight: '600',
  },
  serviceContent: {
    padding: Spacing.M,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.XS,
  },
  serviceName: {
    fontSize: Typography.BODY_M,
    fontWeight: '600',
    color: Colors.TEXT_PRIMARY,
    flex: 1,
    marginRight: Spacing.S,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_SECONDARY,
    marginLeft: Spacing.XS,
  },
  serviceDuration: {
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_SECONDARY,
    marginBottom: Spacing.XS,
  },
  featuresContainer: {
    marginBottom: Spacing.M,
  },
  featureText: {
    fontSize: Typography.BODY_XS,
    color: Colors.TEXT_SECONDARY,
    marginBottom: Spacing.XS,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  discountPrice: {
    fontSize: Typography.BODY_L,
    fontWeight: '700',
    color: Colors.PRIMARY,
    marginRight: Spacing.S,
  },
  originalPrice: {
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_MUTED,
    textDecorationLine: 'line-through',
  },
  addButton: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: Spacing.BORDER_RADIUS_S,
    paddingHorizontal: Spacing.M,
    paddingVertical: Spacing.XS,
  },
  addButtonDisabled: {
    backgroundColor: Colors.TEXT_MUTED,
  },
  addButtonText: {
    fontSize: Typography.BODY_S,
    color: Colors.LIGHT_BACKGROUND,
    fontWeight: '600',
  },
  addButtonTextDisabled: {
    color: Colors.CARD_BACKGROUND,
  },
});

export default EnhancedServiceBrowser;