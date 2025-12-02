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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../constants/Colors';
import mobileApi from '../api/mobileApi';

const STORAGE_KEYS = {
  SELECTED_VEHICLE: '@selected_vehicle',
};

const ModelSelectionScreen = ({ navigation, route }) => {
  const [models, setModels] = useState([]);
  const [filteredModels, setFilteredModels] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [screenWidth, setScreenWidth] = useState(400);

  // Get selected brand from route params
  const selectedBrand = route?.params?.selectedBrand;

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
    // Validate brand selection
    if (!selectedBrand || !selectedBrand.id) {
      Alert.alert(
        'No Brand Selected',
        'Please select a brand first.',
        [{ text: 'Go Back', onPress: () => navigation.goBack() }]
      );
      return;
    }

    fetchModels();
  }, [selectedBrand]);

  // Debounced search effect
  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (searchQuery.trim()) {
      setIsSearching(true);
      searchTimeout.current = setTimeout(() => {
        searchModels(searchQuery.trim());
      }, 300);
    } else {
      setFilteredModels(models);
      setIsSearching(false);
    }

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [searchQuery, models]);

  const fetchModels = async () => {
    try {
      setIsLoading(true);
      
      // Get ALL models for this brand from database - no limit
      const result = await mobileApi.modelApi.getModelsByBrand(selectedBrand.id, { limit: 1000 });
      
      if (result.success) {
        const allModels = result.data?.models || [];
        setModels(allModels);
        setFilteredModels(allModels);
      } else {
        throw new Error(result.message || 'Failed to fetch models from database');
      }
    } catch (error) {
      
      // NO FALLBACK DATA - Show error message to user
      setModels([]);
      setFilteredModels([]);
      
      Alert.alert(
        'Database Connection Error',
        `Unable to load models for ${selectedBrand.name} from server: ${error.message}\n\nPlease ensure the Mobile API server is running on port 3002.`,
        [
          { 
            text: 'Retry', 
            onPress: () => fetchModels() 
          },
          { 
            text: 'Go Back', 
            onPress: () => navigation.goBack() 
          }
        ]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const searchModels = async (query) => {
    try {
      const result = await mobileApi.modelApi.getModelsByBrand(selectedBrand.id, { 
        search: query, 
        limit: 50 
      });
      
      if (result.success) {
        setFilteredModels(result.data.models);
      } else {
        throw new Error(result.message || 'Search failed');
      }
    } catch (error) {
      
      // NO FALLBACK - Show error and clear results
      setFilteredModels([]);
      
      Alert.alert(
        'Search Error',
        `Unable to search models: ${error.message}\n\nPlease check your database connection.`,
        [{ text: 'OK' }]
      );
    } finally {
      setIsSearching(false);
    }
  };

  const handleModelSelect = (model) => {
    // Navigate to Variant Selection screen
    navigation.navigate('VariantSelection', {
      selectedBrand: selectedBrand,
      selectedModel: model
    });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const clearSearch = () => {
    setSearchQuery('');
    setFilteredModels(models);
    searchInputRef.current?.blur();
  };

  const renderModelItem = ({ item, index }) => (
    <TouchableOpacity
      style={[
        styles.modelItem,
        {
          marginRight: (index + 1) % 3 !== 0 ? 6 : 0,
          marginBottom: 12
        }
      ]}
      onPress={() => handleModelSelect(item)}
      activeOpacity={0.7}
    >
      <View style={styles.modelContent}>
        {/* Model Image */}
        <View style={styles.modelImageContainer}>
          {item.image_url ? (
            <Image
              source={{ uri: item.image_url }}
              style={[
                styles.modelImage,
                {
                  width: getResponsiveSize(70, 75, 80),
                  height: getResponsiveSize(55, 60, 65),
                }
              ]}
              resizeMode="contain"
            />
          ) : (
            <View style={[
              styles.modelImagePlaceholder,
              {
                width: getResponsiveSize(70, 75, 80),
                height: getResponsiveSize(55, 60, 65),
              }
            ]}>
              <Text style={[
                styles.modelInitials,
                { fontSize: getResponsiveSize(16, 18, 20) }
              ]}>
                {item.name.charAt(0)}
              </Text>
            </View>
          )}
        </View>
        
        {/* Model Name */}
        <Text style={[
          styles.modelName,
          {
            fontSize: getResponsiveSize(12, 13, 14),
            lineHeight: getResponsiveSize(16, 18, 20),
          }
        ]} numberOfLines={2}>
          {item.name}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="car-sport-outline" size={64} color={Colors.TEXT_SECONDARY} />
      <Text style={[
        styles.emptyStateTitle,
        { fontSize: getResponsiveSize(18, 20, 22) }
      ]}>No models found</Text>
      <Text style={[
        styles.emptyStateSubtitle,
        { fontSize: getResponsiveSize(14, 15, 16) }
      ]}>
        {searchQuery.trim() 
          ? 'Try adjusting your search' 
          : `No models available for ${selectedBrand?.name || 'this brand'}`
        }
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
            Select Model
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
          placeholder="Search models..."
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

      {/* Models List */}
      <View style={[styles.listContainer, { paddingHorizontal: horizontalPadding }]}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.PRIMARY} />
            <Text style={[styles.loadingText, { fontSize: subtitleSize }]}>
              Loading {selectedBrand?.name || 'brand'} models...
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredModels}
            renderItem={renderModelItem}
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
  row: {
    justifyContent: 'space-between',
  },
  modelItem: {
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
    minHeight: 140,
  },
  modelItemSelected: {
    borderColor: Colors.PRIMARY,
    borderWidth: 2,
    shadowColor: Colors.PRIMARY,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  modelContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modelImageContainer: {
    marginBottom: 10,
    alignItems: 'center',
  },
  modelImage: {
    borderRadius: 8,
    resizeMode: 'contain',
  },
  modelImagePlaceholder: {
    borderRadius: 8,
    backgroundColor: Colors.SECONDARY || '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modelInitials: {
    fontWeight: '600',
    color: Colors.TEXT_PRIMARY,
  },
  modelName: {
    fontWeight: '600',
    color: Colors.TEXT_PRIMARY,
    textAlign: 'center',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
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
    paddingVertical: 40,
  },
  emptyStateTitle: {
    fontWeight: '600',
    color: Colors.TEXT_PRIMARY,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    color: Colors.TEXT_SECONDARY,
    textAlign: 'center',
    paddingHorizontal: 32,
    lineHeight: 20,
  },
});

export default ModelSelectionScreen;