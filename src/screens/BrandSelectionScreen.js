import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/Colors';
import { brandApi } from '../api/mobileApi';

const BrandSelectionScreen = ({ navigation }) => {
  const [brands, setBrands] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [screenWidth, setScreenWidth] = useState(400);

  const searchInputRef = useRef(null);
  const searchTimeout = useRef(null);

  const getResponsiveSize = (small, medium, large) => {
    const isSmallDevice = screenWidth < 375;
    const isMediumDevice = screenWidth >= 375 && screenWidth < 414;
    if (isSmallDevice) return small;
    if (isMediumDevice) return medium;
    return large;
  };

  useEffect(() => {
    try {
      const dims = Dimensions.get('window');
      setScreenWidth(dims && typeof dims === 'object' && dims.width ? dims.width : 400);
    } catch (error) {
      console.warn('Error getting dimensions:', error);
      setScreenWidth(400);
    }

    const subscription = Dimensions.addEventListener('change', (event) => {
      try {
        const window = event && event.window ? event.window : event;
        setScreenWidth(window && typeof window === 'object' && window.width ? window.width : 400);
      } catch (error) {
        console.warn('Error in dimensions change listener:', error);
        setScreenWidth(400);
      }
    });

    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    fetchBrands();
  }, []);

  // Debounced search effect
  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (searchQuery.trim()) {
      setIsSearching(true);
      searchTimeout.current = setTimeout(() => {
        searchBrands(searchQuery.trim());
      }, 300);
    } else {
      setFilteredBrands(brands);
      setIsSearching(false);
    }

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [searchQuery, brands]);

  const fetchBrands = async () => {
    try {
      setIsLoading(true);
      
      // Get ALL brands from database - no limit
      const result = await brandApi.getBrands({ limit: 1000 });
      
      if (result.success) {
        const allBrands = result.data?.brands || [];
        setBrands(allBrands);
        setFilteredBrands(allBrands);
      } else {
        throw new Error(result.message || 'Failed to fetch brands from database');
      }
    } catch (error) {
      
      // NO FALLBACK DATA - Show error message to user
      setBrands([]);
      setFilteredBrands([]);
      
      Alert.alert(
        'Database Connection Error',
        `Unable to load brands from server: ${error.message}\n\nPlease ensure the Mobile API server is running on port 3002.`,
        [
          { 
            text: 'Retry', 
            onPress: () => fetchBrands() 
          },
          { text: 'Cancel' }
        ]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const searchBrands = async (query) => {
    try {
      const result = await brandApi.getBrands({ 
        search: query, 
        limit: 50 
      });
      
      if (result.success) {
        setFilteredBrands(result.data.brands);
      } else {
        throw new Error(result.message || 'Search failed');
      }
    } catch (error) {
      
      // NO FALLBACK - Show error and clear results
      setFilteredBrands([]);
      
      Alert.alert(
        'Search Error',
        `Unable to search brands: ${error.message}\n\nPlease check your database connection.`,
        [{ text: 'OK' }]
      );
    } finally {
      setIsSearching(false);
    }
  };

  const handleBrandSelect = (brand) => {
    // Navigate to model selection screen
    navigation.navigate('ModelSelection', { selectedBrand: brand });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const clearSearch = () => {
    setSearchQuery('');
    setFilteredBrands(brands);
    searchInputRef.current?.blur();
  };

  const renderBrandItem = ({ item, index }) => (
    <TouchableOpacity
      style={[
        styles.brandItem,
        {
          marginRight: (index + 1) % 3 !== 0 ? 6 : 0,
          marginBottom: 12
        }
      ]}
      onPress={() => handleBrandSelect(item)}
      activeOpacity={0.7}
    >
      <View style={styles.brandContent}>
        {/* Brand Logo/Image */}
        <View style={styles.brandImageContainer}>
          {item.logo_url ? (
            <Image
              source={{ uri: item.logo_url }}
              style={styles.brandLogo}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.brandLogoPlaceholder}>
              <Text style={styles.brandInitials}>
                {item.name.charAt(0)}
              </Text>
            </View>
          )}
        </View>
        
        {/* Brand Name */}
        <Text style={styles.brandName} numberOfLines={2}>
          {item.name}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="car-outline" size={64} color={Colors.TEXT_SECONDARY} />
      <Text style={styles.emptyStateTitle}>No brands found</Text>
      <Text style={styles.emptyStateSubtitle}>
        Try adjusting your search or check your connection
      </Text>
    </View>
  );

  // Responsive values
  const horizontalPadding = getResponsiveSize(16, 20, 24);
  const titleSize = getResponsiveSize(24, 26, 28);
  const subtitleSize = getResponsiveSize(14, 15, 16);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingHorizontal: horizontalPadding }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.6}
        >
          <Ionicons name="chevron-back" size={getResponsiveSize(24, 26, 28)} color="#1A1A1A" />
        </TouchableOpacity>
        
        <View style={styles.headerTitleContainer}>
          <Text style={[styles.headerTitle, { fontSize: titleSize }]}>
            Select Brand
          </Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { 
        marginHorizontal: horizontalPadding,
        paddingHorizontal: getResponsiveSize(12, 14, 16),
        paddingVertical: getResponsiveSize(10, 12, 14)
      }]}>
        <Ionicons name="search-outline" size={20} color={Colors.TEXT_SECONDARY} />
        <TextInput
          ref={searchInputRef}
          style={[styles.searchInput, { fontSize: getResponsiveSize(14, 15, 16) }]}
          placeholder="Search brands..."
          placeholderTextColor={Colors.TEXT_SECONDARY}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCorrect={false}
          autoCapitalize="words"
        />
        {(searchQuery || isSearching) && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={clearSearch}
            activeOpacity={0.6}
          >
            {isSearching ? (
              <ActivityIndicator size="small" color={Colors.PRIMARY} />
            ) : (
              <Ionicons name="close-circle" size={20} color={Colors.TEXT_SECONDARY} />
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* Brands List */}
      <View style={[styles.listContainer, { paddingHorizontal: horizontalPadding }]}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.PRIMARY} />
            <Text style={[styles.loadingText, { fontSize: subtitleSize }]}>
              Loading brands...
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredBrands}
            renderItem={renderBrandItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            columnWrapperStyle={styles.row}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={renderEmptyState}
            initialNumToRender={20}
            maxToRenderPerBatch={20}
            windowSize={10}
            removeClippedSubviews={true}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFC',
  },
  header: {
    paddingTop: 8,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
    marginBottom: 2,
  },
  headerSubtitle: {
    color: Colors.TEXT_SECONDARY,
    fontWeight: '400',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: Colors.TEXT_PRIMARY,
    fontWeight: '400',
  },
  clearButton: {
    padding: 4,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  brandItem: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
    position: 'relative',
    overflow: 'hidden',
    padding: 12,
    minHeight: 120,
  },
  brandItemSelected: {
    borderColor: Colors.PRIMARY,
    borderWidth: 2,
    shadowColor: Colors.PRIMARY,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  brandContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  row: {
    justifyContent: 'space-between',
  },
  brandImageContainer: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  brandLogo: {
    width: 50,
    height: 50,
  },
  brandLogoPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandInitials: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  brandName: {
    fontWeight: '600',
    color: Colors.TEXT_PRIMARY,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    color: Colors.TEXT_SECONDARY,
    fontWeight: '400',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.TEXT_PRIMARY,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: Colors.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default BrandSelectionScreen;