import React, { memo, useMemo } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Navigation Components
import AuthStackNavigator from './AuthStackNavigator';
import BottomTabNavigator from './BottomTabNavigator';

// Components
import FloatingCartOverlay from '../components/FloatingCartOverlay';

// Vehicle Selection Screens
import BrandSelectionScreen from '../screens/BrandSelectionScreen';
import ModelSelectionScreen from '../screens/ModelSelectionScreen';
import VariantSelectionScreen from '../screens/VariantSelectionScreen';

// Service Screens
import ServiceDetailsScreen from '../screens/ServiceDetailsScreen';
import PremiumServiceDetailsScreen from '../screens/PremiumServiceDetailsScreen';
import PlanDetailScreen from '../screens/PlanDetailScreen';

// Subscription Screens
import PrimeMembershipScreen from '../screens/PrimeMembershipScreen';

// Accessories Screens
import CategoryProductsScreen from '../screens/CategoryProductsScreen';
import CartScreen from '../screens/CartScreen';
import UserCheckoutInfoScreen from '../screens/UserCheckoutInfoScreen';
import PayNowScreen from '../screens/PayNowScreen';

// Account Subpage Screens
import ProfileScreen from '../screens/ProfileScreen';
import GaragesScreen from '../screens/GaragesScreen';
import CouponsScreen from '../screens/CouponsScreen';
import ReferralScreen from '../screens/ReferralScreen';
import WalletScreen from '../screens/WalletScreen';
import PaymentMethodsScreen from '../screens/PaymentMethodsScreen';
import HelpSupportScreen from '../screens/HelpSupportScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';

const Stack = createNativeStackNavigator();

const MainNavigator = memo(() => {
  // Performance-optimized navigation structure - always show MainTabs with Auth as modal
  // This avoids unnecessary re-renders and animation delays
  const screenOptions = useMemo(() => ({
    headerShown: false,
    animationEnabled: false, // Disabled for faster navigation
  }), []);

  const modalOptions = useMemo(() => ({
    presentation: 'modal',
    animationEnabled: false,
  }), []);

  return (
    <>
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen name="MainTabs" component={BottomTabNavigator} />

        {/* Auth Stack as Modal */}
        <Stack.Group screenOptions={modalOptions}>
          <Stack.Screen name="Auth" component={AuthStackNavigator} />
        </Stack.Group>

        {/* Regular screens */}
        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="UserCheckoutInfo" component={UserCheckoutInfoScreen} />
        <Stack.Screen name="PayNow" component={PayNowScreen} />
        <Stack.Screen name="BrandSelection" component={BrandSelectionScreen} />
        <Stack.Screen name="ModelSelection" component={ModelSelectionScreen} />
        <Stack.Screen name="VariantSelection" component={VariantSelectionScreen} />
        <Stack.Screen name="ServiceDetails" component={ServiceDetailsScreen} />
        <Stack.Screen name="PremiumServiceDetails" component={PremiumServiceDetailsScreen} />
        <Stack.Screen name="PlanDetail" component={PlanDetailScreen} />
        <Stack.Screen name="PrimeMembership" component={PrimeMembershipScreen} />
        <Stack.Screen name="CategoryProducts" component={CategoryProductsScreen} />

        {/* Account Subpage Screens */}
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Garages" component={GaragesScreen} />
        <Stack.Screen name="Coupons" component={CouponsScreen} />
        <Stack.Screen name="Referral" component={ReferralScreen} />
        <Stack.Screen name="Wallet" component={WalletScreen} />
        <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
        <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
      </Stack.Navigator>
      <FloatingCartOverlay />
    </>
  );
});

MainNavigator.displayName = 'MainNavigator';

export default MainNavigator;