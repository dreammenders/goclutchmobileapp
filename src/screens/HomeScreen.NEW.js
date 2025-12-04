import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

// Custom Hooks
import { useLocation } from '../hooks/home/useLocation';
import { useHomeData } from '../hooks/home/useHomeData';
import { useVehicleSelection } from '../hooks/home/useVehicleSelection';

// Components
import LocationHeader from '../components/home/LocationHeader';
import SearchBar from '../components/home/SearchBar';
import VehicleSelector from '../components/home/VehicleSelector';
import BannerCarousel from '../components/home/BannerCarousel';
import OffersCarousel from '../components/home/OffersCarousel';
import ServicesSection from '../components/home/ServicesSection';

import { Colors } from '../constants/Colors';
import { Spacing } from '../constants/Spacing';

/**
 * Refactored HomeScreen - Now only ~150 lines!
 * All logic extracted to custom hooks
 * All UI extracted to reusable components
 * Includes smart navigation support
 */
const HomeScreen = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();

    // Custom hooks for business logic
    const { location, isLoading: isLoadingLocation } = useLocation();
    const { services, banners, offers } = useHomeData();
    const { selectedVehicle } = useVehicleSelection();

    // Carousel state
    const [activeBannerIndex, setActiveBannerIndex] = useState(0);
    const [activeOfferIndex, setActiveOfferIndex] = useState(0);

    // Handle banner scroll
    const handleBannerScroll = (event) => {
        if (event?.nativeEvent?.contentOffset) {
            const scrollPosition = event.nativeEvent.contentOffset.x;
            const index = Math.round(scrollPosition / 400);
            setActiveBannerIndex(index);
        }
    };

    // Handle offer scroll
    const handleOfferScroll = (event) => {
        if (event?.nativeEvent?.contentOffset) {
            const scrollPosition = event.nativeEvent.contentOffset.x;
            const index = Math.round(scrollPosition / 400);
            setActiveOfferIndex(index);
        }
    };

    // Handle service press with smart navigation
    const handleServicePress = (service) => {
        // Check if vehicle is selected
        if (!selectedVehicle?.model || !selectedVehicle?.variant) {
            // No vehicle selected - redirect to BrandSelection with service info
            navigation.navigate('BrandSelection', { redirectService: service });
            return;
        }

        // Vehicle selected - go directly to ServiceDetails
        navigation.navigate('ServiceDetails', {
            service,
            modelId: selectedVehicle.model.id,
            variantId: selectedVehicle.variant.id
        });
    };

    // Handle vehicle selector press
    const handleVehiclePress = () => {
        navigation.navigate('BrandSelection');
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header Section */}
            <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
                <View style={styles.headerContent}>
                    <View style={styles.leftSection}>
                        <LocationHeader
                            location={location}
                            isLoading={isLoadingLocation}
                        />
                        <SearchBar placeholder="Search services..." />
                    </View>

                    <VehicleSelector
                        selectedVehicle={selectedVehicle}
                        onPress={handleVehiclePress}
                    />
                </View>
            </View>

            {/* Scrollable Content */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: Spacing.TAB_BAR_HEIGHT + insets.bottom + 16
                }}
            >
                {/* Promotional Banners */}
                <BannerCarousel
                    banners={banners}
                    activeIndex={activeBannerIndex}
                    onScroll={handleBannerScroll}
                />

                {/* Special Offers */}
                <OffersCarousel
                    offers={offers}
                    activeIndex={activeOfferIndex}
                    onScroll={handleOfferScroll}
                />

                {/* Services Section */}
                <ServicesSection
                    services={services}
                    onServicePress={handleServicePress}
                />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFBFC',
    },
    header: {
        paddingHorizontal: 20,
        paddingBottom: 16,
    },
    headerContent: {
        flexDirection: 'row',
        gap: 12,
    },
    leftSection: {
        flex: 1,
    },
});

export default HomeScreen;
