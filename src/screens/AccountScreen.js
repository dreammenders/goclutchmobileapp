import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import { Spacing } from '../constants/Spacing';
import RotatingCoin from '../components/RotatingCoin';

const QUICK_ACCESS_CARDS = [
  {
    id: 'services',
    label: 'My Services',
    icon: require('../../assets/services.jpeg'),
    gradient: ['#6366F1', '#8B5CF6'],
  },
  {
    id: 'vehicles',
    label: 'My Vehicles',
    icon: require('../../assets/karts.jpeg'),
    gradient: ['#EC4899', '#F43F5E'],
  },
  {
    id: 'gold',
    label: 'Prime Gold',
    icon: require('../../assets/gold.jpeg'),
    gradient: ['#F59E0B', '#EF4444'],
  },
];

const MENU_SECTIONS = [
  {
    title: 'Account',
    items: [
      { id: 'profile', label: 'My Profile', icon: 'person' },
    ],
  },
  {
    title: 'Services',
    items: [
      { id: 'coupons', label: 'Coupons & Offers', icon: 'ticket' },
      { id: 'referral', label: 'Refer & Earn', icon: 'share-social' },
    ],
  },
  {
    title: 'Payments',
    items: [
      { id: 'wallet', label: 'My Wallet', icon: 'wallet' },
      { id: 'payments', label: 'Payment Methods', icon: 'card' },
    ],
  },
  {
    title: 'Support',
    items: [
      { id: 'support', label: 'Help & Support', icon: 'help-circle' },
      { id: 'privacy', label: 'Privacy Policy', icon: 'shield' },
    ],
  },
];

const getIconColor = (itemId) => {
  return itemId === 'logout' ? '#EF4444' : Colors.PRIMARY;
};

const AccountScreen = ({ navigation }) => {
  const [activeCard, setActiveCard] = useState(null);
  const [pressedItem, setPressedItem] = useState(null);
  const [userName, setUserName] = useState('User');
  const [userPhone, setUserPhone] = useState('');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const phone = await AsyncStorage.getItem('@user_phone');
      const name = await AsyncStorage.getItem('@user_name');
      
      if (phone) setUserPhone(phone);
      if (name) setUserName(name);
    } catch (error) {
      // Error loading user data silently handled
    }
  };

  const handleCardPress = (cardId) => {
    setActiveCard(cardId);
    setTimeout(() => setActiveCard(null), 300);
  };

  const handleMenuPress = (menuId) => {
    switch (menuId) {
      case 'profile':
        navigation.navigate('Profile');
        break;
      case 'coupons':
        navigation.navigate('Coupons');
        break;
      case 'referral':
        navigation.navigate('Referral');
        break;
      case 'wallet':
        navigation.navigate('Wallet');
        break;
      case 'payments':
        navigation.navigate('PaymentMethods');
        break;
      case 'support':
        navigation.navigate('HelpSupport');
        break;
      case 'privacy':
        navigation.navigate('PrivacyPolicy');
        break;
      case 'logout':
        handleLogout();
        break;
      default:
        break;
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('@user_phone');
      await AsyncStorage.removeItem('@user_name');
      navigation.navigate('Auth', { screen: 'MobileNumber' });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleMenuItemPressIn = (itemId) => {
    setPressedItem(itemId);
  };

  const handleMenuItemPressOut = () => {
    setPressedItem(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={Colors.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Account</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        scrollEventThrottle={16}
      >
        {/* Quick Access Cards */}
        <View style={styles.quickAccessSection}>
          <View style={styles.cardsRow}>
            {QUICK_ACCESS_CARDS.map((card) => (
              <TouchableOpacity
                key={card.id}
                activeOpacity={0.8}
                style={[
                  styles.quickCard,
                  activeCard === card.id && styles.quickCardActive,
                ]}
                onPress={() => handleCardPress(card.id)}
              >
                <View style={styles.cardGlassLayer} />
                <LinearGradient
                  colors={[...card.gradient, 'transparent']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.cardGradientBg}
                />
                <View style={styles.cardContent}>
                  <View style={styles.cardImageContainer}>
                    <LinearGradient
                      colors={[...card.gradient.map((c) => c + '15')]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.imageBackdrop}
                    />
                    <Image
                      source={card.icon}
                      style={styles.cardIcon}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={styles.cardLabel}>{card.label}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* GoClutch Coins Section */}
        <View style={styles.coinsSection}>
          <View style={styles.coinsCard}>
            <View style={styles.coinsBadge}>
              <RotatingCoin size={48} />
            </View>
            <View style={styles.coinsInfo}>
              <Text style={styles.coinsLabel}>GoClutch Coins</Text>
            </View>
            <Text style={styles.coinsValue}>2,450 Coins</Text>
          </View>
        </View>

        {/* Menu Sections */}
        <View style={styles.menusContainer}>
          {MENU_SECTIONS.map((section, sectionIndex) => (
            <View key={section.title} style={styles.menuSection}>
              <View style={styles.menuGroup}>
                {section.items.map((item, itemIndex) => (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.6}
                    style={[
                      styles.menuItem,
                      pressedItem === item.id && styles.menuItemPressed,
                    ]}
                    onPressIn={() => handleMenuItemPressIn(item.id)}
                    onPressOut={handleMenuItemPressOut}
                    onPress={() => handleMenuPress(item.id)}
                  >
                    <View style={styles.menuItemLeft}>
                      <Ionicons name={item.icon} size={24} color={getIconColor(item.id)} />
                      <Text style={styles.menuItemLabel}>{item.label}</Text>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color={Colors.TEXT_SECONDARY}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

          {/* Logout Button */}
          <View style={[styles.menuSection, styles.logoutSection]}>
            <TouchableOpacity
              activeOpacity={0.6}
              style={[
                styles.menuItem,
                pressedItem === 'logout' && styles.menuItemPressed,
              ]}
              onPressIn={() => handleMenuItemPressIn('logout')}
              onPressOut={handleMenuItemPressOut}
              onPress={() => handleMenuPress('logout')}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name="log-out" size={24} color={getIconColor('logout')} />
                <Text style={[styles.menuItemLabel, styles.logoutLabel]}>Logout</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.TEXT_SECONDARY} />
            </TouchableOpacity>

            {/* Footer - Powered by DreamMenders */}
            <View style={styles.footerContainer}>
              <View style={styles.footerTextContainer}>
                <Text style={styles.poweredByText}>Powered by </Text>
                <Text style={styles.dreamMendersText}>DreamMenders</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.SCREEN_HORIZONTAL,
    paddingVertical: Spacing.M,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  backButton: {
    marginRight: Spacing.M,
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(254, 81, 16, 0.08)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
    letterSpacing: 0.3,
  },
  scrollContent: {
    paddingTop: Spacing.S,
    paddingBottom: Spacing.XL * 1.5,
    flexGrow: 1,
  },
  quickAccessSection: {
    paddingHorizontal: Spacing.SCREEN_HORIZONTAL,
    paddingVertical: Spacing.M,
    minHeight: 140,
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  quickCard: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    minHeight: 105,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    position: 'relative',
    alignItems: 'center',
  },
  quickCardActive: {
    opacity: 0.85,
    transform: [{ scale: 0.95 }],
  },
  cardGlassLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(10px)',
  },
  cardGradientBg: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    opacity: 0.15,
  },
  cardContent: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: Spacing.XS,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    zIndex: 2,
  },
  cardImageContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  imageBackdrop: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  cardIcon: {
    width: '85%',
    height: '85%',
    zIndex: 2,
  },
  cardLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
    textAlign: 'center',
    letterSpacing: 0.2,
    flexWrap: 'wrap',
  },
  coinsSection: {
    paddingHorizontal: Spacing.SCREEN_HORIZONTAL,
    paddingVertical: Spacing.M,
  },
  coinsCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: Spacing.M,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  coinsBadge: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  coinsInfo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginLeft: Spacing.S,
  },
  coinsLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
    letterSpacing: 0.3,
  },
  coinsValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.PRIMARY,
    letterSpacing: 0.3,
  },
  menusContainer: {
    paddingHorizontal: Spacing.SCREEN_HORIZONTAL,
    paddingTop: Spacing.M,
  },
  menuSection: {
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.TEXT_SECONDARY,
    textTransform: 'uppercase',
    letterSpacing: 1.3,
    marginBottom: Spacing.M,
    opacity: 0.6,
  },
  menuGroup: {
    backgroundColor: 'transparent',
    borderRadius: 0,
    overflow: 'visible',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 0,
    backgroundColor: 'transparent',
  },
  menuItemPressed: {
    backgroundColor: 'transparent',
  },
  menuItemBorder: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.L,
    flex: 1,
  },
  menuIconContainer: {
    width: 0,
    height: 0,
    display: 'none',
  },
  menuItemLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.TEXT_PRIMARY,
    letterSpacing: 0.2,
  },
  logoutIconContainer: {
    display: 'none',
  },
  logoutLabel: {
    color: '#EF4444',
    fontWeight: '600',
  },
  logoutSection: {
    marginTop: Spacing.S,
    marginBottom: Spacing.L,
  },
  footerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.M,
    paddingHorizontal: Spacing.SCREEN_HORIZONTAL,
    backgroundColor: 'transparent',
    marginHorizontal: 0,
    marginTop: Spacing.S,
    borderRadius: 0,
  },
  footerTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  poweredByText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.TEXT_PRIMARY,
    letterSpacing: 0.3,
  },
  dreamMendersText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B9FF3A',
    letterSpacing: 0.3,
  },
});

export default AccountScreen;