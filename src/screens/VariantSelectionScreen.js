import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../constants/Colors';
import mobileApi from '../api/mobileApi';

const { width: screenWidth } = Dimensions.get('window');

const STORAGE_KEYS = {
  SELECTED_VEHICLE: '@selected_vehicle',
};

const VARIANT_COLORS = {
  petrol: {
    primary: '#FF6B35',
    light: '#FFE8D6',
    accent: '#FF8C5A',
  },
  diesel: {
    primary: '#8B4513',
    light: '#E8DCC8',
    accent: '#A0522D',
  },
  cng: {
    primary: '#00796B',
    light: '#B2DFDB',
    accent: '#004D40',
  },
  electric: {
    primary: '#1E88E5',
    light: '#C5E1FF',
    accent: '#1565C0',
  },
};

const VariantSelectionScreen = ({ navigation, route }) => {
  const [variants, setVariants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const insets = useSafeAreaInsets();

  // Get selected brand and model from route params
  const selectedBrand = route?.params?.selectedBrand;
  const selectedModel = route?.params?.selectedModel;

  useEffect(() => {
    fetchVariants();
  }, []);

  const fetchVariants = async () => {
    try {
      setIsLoading(true);

      // Use model-specific variant fetching if model is selected
      let result;
      if (selectedModel && selectedModel.id) {
        console.log('Fetching variants for model:', selectedModel.id);
        result = await mobileApi.getVariantsByModel(selectedModel.id);
      } else {
        // Fallback to all variants if no model selected (shouldn't happen in flow)
        result = await mobileApi.getVariants();
      }

      if (result.success) {
        setVariants(result.data.variants);
      } else {
        throw new Error(result.message || 'Failed to fetch variants');
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'Unable to load variants. Please try again.',
        [
          { text: 'Retry', onPress: fetchVariants },
          { text: 'Cancel', onPress: () => navigation.goBack() }
        ]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
  };

  const handleContinue = async () => {
    if (!selectedVariant) return;

    try {
      // Save complete vehicle data with variant to AsyncStorage
      const vehicleData = {
        brand: selectedBrand,
        model: selectedModel,
        variant: selectedVariant,
        selectedAt: new Date().toISOString(),
      };

      await AsyncStorage.setItem(
        STORAGE_KEYS.SELECTED_VEHICLE,
        JSON.stringify(vehicleData)
      );

      // Navigate to main tabs
      navigation.reset({
        index: 0,
        routes: [{
          name: 'MainTabs',
          params: {
            selectedBrand: selectedBrand,
            selectedModel: selectedModel,
            selectedVariant: selectedVariant
          }
        }],
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to save your selection. Please try again.');
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const renderVariantItem = ({ item }) => {
    const fuelType = item.fuel_type.toLowerCase();
    const variantColor = VARIANT_COLORS[fuelType] || VARIANT_COLORS.petrol;
    const isSelected = selectedVariant?.id === item.id;

    return (
      <TouchableOpacity
        style={[
          styles.variantCard,
          isSelected && styles.variantCardSelected,
        ]}
        onPress={() => handleVariantSelect(item)}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={
            isSelected
              ? [variantColor.light, variantColor.light]
              : ['#FFFFFF', '#FAFAFA']
          }
          style={styles.variantGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={[styles.variantIcon, { backgroundColor: isSelected ? variantColor.primary : 'transparent' }]}>
            <MaterialCommunityIcons
              name={getFuelIcon(fuelType)}
              size={48}
              color={isSelected ? '#FFFFFF' : variantColor.primary}
            />
          </View>
          <Text
            style={[
              styles.variantName,
              isSelected && { color: variantColor.primary }
            ]}
          >
            {item.name}
          </Text>
          {isSelected && (
            <View style={styles.selectedBadge}>
              <Ionicons name="checkmark-circle" size={24} color={variantColor.primary} />
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const getFuelIcon = (fuelType) => {
    const icons = {
      petrol: 'gas-station',
      diesel: 'fuel',
      cng: 'gas-cylinder',
      electric: 'ev-station'
    };
    return icons[fuelType.toLowerCase()] || 'car-cog';
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.PRIMARY} />
          <Text style={styles.loadingText}>Loading variants...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Premium Header */}
      <LinearGradient
        colors={['#FFFFFF', '#F8F9FA']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <View style={styles.backButtonCircle}>
              <Ionicons name="arrow-back" size={22} color={Colors.TEXT_PRIMARY} />
            </View>
          </TouchableOpacity>

          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Select Variant</Text>
            <Text style={styles.headerSubtitle}>Step 3 of 3</Text>
          </View>

          <View style={styles.headerRight}>
            <View style={styles.progressIndicator}>
              <View style={styles.progressDot} />
              <View style={styles.progressDot} />
              <View style={[styles.progressDot, styles.progressDotActive]} />
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Vehicle Info Section */}
      <View style={styles.vehicleInfoSection}>
        <View style={styles.vehicleImageContainer}>
          {selectedModel?.image_url ? (
            <Image
              source={{ uri: selectedModel.image_url }}
              style={styles.vehicleImage}
              resizeMode="contain"
            />
          ) : (
            <Ionicons name="car-sport" size={80} color={Colors.TEXT_SECONDARY} />
          )}
        </View>
        <Text style={styles.modelName}>{selectedModel?.name}</Text>
        <Text style={styles.instructionText}>Choose your fuel type</Text>
      </View>

      {/* Variants List */}
      <FlatList
        data={variants}
        renderItem={renderVariantItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.variantsList}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
      />

      {/* Continue Button */}
      {selectedVariant && (
        <View style={[styles.continueButtonContainer, { paddingBottom: 16 + insets.bottom }]}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[Colors.PRIMARY, Colors.SECONDARY]}
              style={styles.continueButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.TEXT_SECONDARY,
  },
  headerGradient: {
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: screenWidth < 380 ? 16 : 20,
    paddingTop: screenWidth < 380 ? 12 : 16,
    paddingBottom: screenWidth < 380 ? 16 : 20,
  },
  backButton: {
    marginRight: screenWidth < 380 ? 8 : 12,
  },
  backButtonCircle: {
    width: screenWidth < 380 ? 40 : 44,
    height: screenWidth < 380 ? 40 : 44,
    borderRadius: screenWidth < 380 ? 20 : 22,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: screenWidth < 380 ? 18 : 20,
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: screenWidth < 380 ? 10 : 12,
    fontWeight: '500',
    color: Colors.TEXT_SECONDARY,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  headerRight: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
  },
  progressDotActive: {
    backgroundColor: Colors.PRIMARY,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  vehicleInfoSection: {
    alignItems: 'center',
    paddingTop: screenWidth < 380 ? 8 : 12,
    paddingBottom: screenWidth < 380 ? 12 : 16,
    paddingHorizontal: screenWidth < 380 ? 12 : 16,
    backgroundColor: Colors.LIGHT_BACKGROUND,
    borderBottomWidth: 1,
    borderBottomColor: Colors.BORDER_LIGHT,
  },
  vehicleImageContainer: {
    width: screenWidth < 380 ? 120 : 160,
    height: screenWidth < 380 ? 120 : 160,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: screenWidth < 380 ? 4 : 8,
  },
  vehicleImage: {
    width: '100%',
    height: '100%',
  },
  modelName: {
    fontSize: screenWidth < 380 ? 20 : 24,
    fontWeight: 'bold',
    color: Colors.TEXT_PRIMARY,
    marginBottom: screenWidth < 380 ? 4 : 8,
  },
  instructionText: {
    fontSize: screenWidth < 380 ? 12 : 14,
    color: Colors.TEXT_SECONDARY,
    marginTop: screenWidth < 380 ? 4 : 8,
  },
  variantsList: {
    padding: screenWidth < 380 ? 12 : 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: screenWidth < 380 ? 12 : 16,
  },
  variantCard: {
    flex: 1,
    marginHorizontal: screenWidth < 380 ? 4 : 6,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  variantCardSelected: {
    elevation: 6,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    borderWidth: 2,
  },
  variantGradient: {
    padding: screenWidth < 380 ? 16 : 20,
    alignItems: 'center',
    minHeight: screenWidth < 380 ? 140 : 160,
    justifyContent: 'center',
  },
  variantIcon: {
    marginBottom: 16,
    width: 76,
    height: 76,
    borderRadius: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  variantName: {
    fontSize: screenWidth < 380 ? 14 : 18,
    fontWeight: 'bold',
    color: Colors.TEXT_PRIMARY,
    marginBottom: 4,
    textAlign: 'center',
  },
  variantType: {
    fontSize: screenWidth < 380 ? 11 : 12,
    color: Colors.TEXT_SECONDARY,
    fontWeight: '500',
    textAlign: 'center',
  },
  selectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  continueButtonContainer: {
    paddingHorizontal: screenWidth < 380 ? 12 : 16,
    paddingTop: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  continueButton: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  continueButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: screenWidth < 380 ? 14 : 16,
    paddingHorizontal: screenWidth < 380 ? 24 : 32,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: screenWidth < 380 ? 16 : 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
});

export default VariantSelectionScreen;