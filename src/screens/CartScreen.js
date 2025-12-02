import React, { useMemo, useState, useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import { Spacing } from '../constants/Spacing';
import { useCart } from '../context/CartContext';
import mobileApi from '../api/mobileApi';

const PRODUCTS_BY_CATEGORY = {
  '1': [
    {
      id: '1',
      name: 'Valeo Synthetic Oil 5W-40',
      price: 520,
      icon: '🫗',
      rating: 4.6,
      benefits: ['Advanced protection', 'Better performance'],
    },
    {
      id: '2',
      name: 'Castrol EDGE 5W-30',
      price: 680,
      icon: '🫗',
      rating: 4.8,
      benefits: ['Titanium technology', 'Premium quality'],
    },
    {
      id: '3',
      name: 'Denso Premium Oil 10W-40',
      price: 450,
      icon: '🫗',
      rating: 4.4,
      benefits: ['Reliable engine care', 'Wear protection'],
    },
    {
      id: '4',
      name: 'Shell Helix Ultra 0W-40',
      price: 750,
      icon: '🫗',
      rating: 4.7,
      benefits: ['Fuel efficiency', 'Engine cleanliness'],
    },
    {
      id: '5',
      name: 'Motul 300V Engine Oil 5W-40',
      price: 850,
      icon: '🫗',
      rating: 4.9,
      benefits: ['High performance', 'Race-tested'],
    },
    {
      id: '6',
      name: 'Mobil 1 Synthetic 5W-30',
      price: 720,
      icon: '🫗',
      rating: 4.8,
      benefits: ['Superior protection', 'Extended drain'],
    },
    {
      id: '7',
      name: 'Bosch Power Max 10W-40',
      price: 380,
      icon: '🫗',
      rating: 4.5,
      benefits: ['Affordable premium', 'Excellent lubrication'],
    },
  ],
  '2': [
    {
      id: '8',
      name: 'MRF ZVTS 185/65 R15',
      price: 3500,
      icon: '🛞',
      rating: 4.6,
      benefits: ['Durable grip', 'Long life'],
    },
    {
      id: '9',
      name: 'CEAT Milaze 185/65 R15',
      price: 3200,
      icon: '🛞',
      rating: 4.5,
      benefits: ['Fuel efficient', 'Smooth ride'],
    },
    {
      id: '10',
      name: 'Apollo Amazer 185/65 R15',
      price: 2800,
      icon: '🛞',
      rating: 4.4,
      benefits: ['Value for money', 'Comfortable'],
    },
    {
      id: '11',
      name: 'Michelin Pilot Sport 185/65 R15',
      price: 4800,
      icon: '🛞',
      rating: 4.8,
      benefits: ['Premium quality', 'Superior grip'],
    },
    {
      id: '12',
      name: 'Bridgestone Turanza 185/65 R15',
      price: 4200,
      icon: '🛞',
      rating: 4.7,
      benefits: ['Best performance', 'Warranty coverage'],
    },
    {
      id: '13',
      name: 'JK Tyres ProX 185/65 R15',
      price: 3100,
      icon: '🛞',
      rating: 4.5,
      benefits: ['Durability', 'Cost effective'],
    },
  ],
  '3': [
    {
      id: '14',
      name: 'Exide Xpress 50Ah Battery',
      price: 3200,
      icon: '🔋',
      rating: 4.5,
      benefits: ['2 years warranty', 'Reliable start'],
    },
    {
      id: '15',
      name: 'Amaron Pro 55Ah Battery',
      price: 4500,
      icon: '🔋',
      rating: 4.7,
      benefits: ['3 years warranty', 'Premium quality'],
    },
  ],
  '4': [
    {
      id: '16',
      name: 'Engine Coolant 5L',
      price: 350,
      icon: '❄️',
      rating: 4.4,
      benefits: ['Rust prevention', 'Heat dissipation'],
    },
    {
      id: '17',
      name: 'Premium Coolant Concentrate 1L',
      price: 200,
      icon: '❄️',
      rating: 4.6,
      benefits: ['Concentrate formula', 'Affordable'],
    },
  ],
  '5': [
    {
      id: '18',
      name: 'Air Filter',
      price: 280,
      icon: '🔍',
      rating: 4.5,
      benefits: ['Better airflow', 'Engine protection'],
    },
    {
      id: '19',
      name: 'Oil Filter Premium',
      price: 320,
      icon: '🔍',
      rating: 4.6,
      benefits: ['Excellent filtration', 'Extends oil life'],
    },
  ],
  '6': [
    {
      id: '14',
      name: 'Front Windshield Wipers Pair',
      price: 450,
      icon: '💨',
      rating: 4.5,
      benefits: ['Clear visibility', 'Durable rubber', 'Easy fit'],
    },
    {
      id: '15',
      name: 'Premium Wiper Blades',
      price: 650,
      icon: '💨',
      rating: 4.7,
      benefits: ['Streak-free cleaning', 'Longer life', 'Silent operation'],
    },
  ],
};

const ADD_ON_PRODUCTS = [
  {
    id: 'addon_1',
    name: 'Coolant ADD ON',
    price: 250,
    icon: '❄️',
    rating: 4.5,
    benefits: ['Engine cooling', 'Corrosion protection'],
  },
  {
    id: 'addon_2',
    name: 'Wiper Blade',
    price: 180,
    icon: '💨',
    rating: 4.3,
    benefits: ['Clear visibility', 'Weather protection'],
  },
  {
    id: 'addon_3',
    name: 'AC Filter',
    price: 120,
    icon: '🔍',
    rating: 4.4,
    benefits: ['Clean air', 'Allergen removal'],
  },
];

const AVAILABLE_COUPONS = [
  {
    id: 'go_clutch',
    title: 'Go Clutch Coupon',
    description: 'Available coins: 3000',
    discount: '₹300 off',
    type: 'coins',
    icon: '🪙',
  },
  {
    id: 'first_user',
    title: 'First User Offer',
    description: 'Special offer for new users',
    discount: '₹500 off',
    type: 'first_time',
    icon: '🎉',
  },
  {
    id: 'online_payment',
    title: 'Online Payment Bonus',
    description: 'UPI, PhonePe, or GPay payment',
    discount: '₹100 off',
    type: 'payment',
    icon: '📱',
  },
];

const CartScreen = ({ navigation }) => {
  const { cartItems, cartItemData, addToCart, removeFromCart, removeProductFromCart, getTotalPrice } = useCart();

  const [couponModalVisible, setCouponModalVisible] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [showThanksPopup, setShowThanksPopup] = useState(false);
  const [thanksAnimation] = useState(new Animated.Value(0));
  const [specialOffers, setSpecialOffers] = useState([]);
  const [activeOfferIndex, setActiveOfferIndex] = useState(0);
  const [isLoadingOffers, setIsLoadingOffers] = useState(true);
  const offerFlatListRef = useRef(null);
  const [sparkles, setSparkles] = useState([]);
  const sparkleAnimations = useRef([]);

  // Handle coupon selection with thanks popup
  const handleCouponSelect = (coupon) => {
    setSelectedCoupon(coupon);
    setCouponModalVisible(false);

    // Generate confetti particles with colors
    const confettiColors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181', '#AA96DA', '#FCBAD3', '#A8D8EA', '#FF8C94', '#FFD93D', '#FF6B9D', '#C44569', '#FFC93C', '#00D2FC'];
    const particleCount = 40;
    const newSparkles = [];
    const animations = [];
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const animValue = new Animated.Value(0);
      const rotation = Math.random() * 360;
      const randomDistance = 100 + Math.random() * 80;
      const delay = Math.random() * 50;
      
      newSparkles.push({
        id: i,
        angle,
        animValue,
        color: confettiColors[i % confettiColors.length],
        rotation,
        distance: randomDistance,
        delay,
      });
      
      animations.push(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animValue, {
            toValue: 1,
            duration: 800 + Math.random() * 400,
            useNativeDriver: true,
          }),
        ])
      );
    }
    
    setSparkles(newSparkles);
    sparkleAnimations.current = animations;
    
    // Show thanks popup with blasting animation
    setShowThanksPopup(true);
    Animated.sequence([
      Animated.parallel([
        Animated.timing(thanksAnimation, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        ...animations,
      ]),
      Animated.delay(2000), // Show for 2 seconds
      Animated.timing(thanksAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowThanksPopup(false);
      setSparkles([]);
    });
  };

  const handleProceedToCheckout = () => {
    navigation.navigate('PayNow', {
      cartItems: cartProducts,
      totalPrice,
    });
  };

  useEffect(() => {
    fetchSpecialOffers();
  }, []);

  useEffect(() => {
    if (specialOffers.length <= 1) return;

    const autoSlideInterval = setInterval(() => {
      setActiveOfferIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % specialOffers.length;
        
        if (offerFlatListRef.current) {
          offerFlatListRef.current.scrollToIndex({
            index: nextIndex,
            animated: true,
          });
        }
        
        return nextIndex;
      });
    }, 3500);

    return () => clearInterval(autoSlideInterval);
  }, [specialOffers.length]);

  const fetchSpecialOffers = async () => {
    try {
      setIsLoadingOffers(true);
      const result = await mobileApi.getSpecialOffers();

      if (result.success && result.data && result.data.offers && result.data.offers.length > 0) {
        const offerGradientOptions = [
          ['#FF6B6B', '#C92A2A'],
          ['#51CF66', '#2F9E44'],
          ['#339AF0', '#1864AB'],
          ['#DA77F2', '#9C36B5'],
          ['#FFA94D', '#E67700'],
          ['#FF8787', '#FA5252'],
        ];
        
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

  // Get all products from the static data for price calculation
  const allProducts = useMemo(() => {
    const products = [];
    Object.values(PRODUCTS_BY_CATEGORY).forEach((categoryProducts) => {
      products.push(...categoryProducts);
    });
    return products;
  }, []);

  // Create cart products by combining cart items with product data
  const cartProducts = useMemo(() => {
    console.log('CartScreen Debug:', { cartItems, cartItemData, allProductsLength: allProducts.length });
    return Object.entries(cartItems).map(([productId, quantity]) => {
      console.log('Processing cart item:', productId, quantity);
      // First try to find in cartItemData (for services and dynamic items)
      const cartItem = cartItemData[productId];
      if (cartItem) {
        console.log('Found in cartItemData:', cartItem);
        return {
          ...cartItem,
          quantity,
        };
      }
      // Fall back to static products
      const product = allProducts.find(p => p.id === productId);
      if (product) {
        console.log('Found in allProducts:', product);
        return {
          ...product,
          quantity,
        };
      }
      // If not found anywhere, return a basic product object
      console.log('Not found anywhere, using fallback');
      return {
        id: productId,
        name: 'Unknown Product',
        price: 0,
        icon: '❓',
        quantity,
      };
    });
  }, [cartItems, cartItemData, allProducts]);

  const totalPrice = useMemo(() => getTotalPrice(allProducts), [allProducts, getTotalPrice]);

  const isEmpty = cartProducts.length === 0;

  const renderOfferBanner = ({ item }) => (
    <View style={styles.offerBannerCard}>
      {item.image_url ? (
        <Image
          source={{ uri: item.image_url }}
          style={styles.offerBannerImage}
          resizeMode="cover"
        />
      ) : (
        <LinearGradient
          colors={item.gradient || ['#FF6B6B', '#C92A2A']}
          style={styles.offerBannerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.offerBannerContent}>
            <Text style={styles.offerBannerDiscount}>{item.discount}</Text>
            <Text style={styles.offerBannerTitle}>{item.title}</Text>
            <Text style={styles.offerBannerSubtitle}>{item.subtitle}</Text>
          </View>
        </LinearGradient>
      )}
    </View>
  );

  const renderOfferPaginationDots = () => (
    <View style={styles.offerPaginationContainer}>
      {specialOffers.map((_, index) => (
        <View
          key={index}
          style={[
            styles.offerPaginationDot,
            index === activeOfferIndex && styles.offerPaginationDotActive,
          ]}
        />
      ))}
    </View>
  );

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItemCard}>
      <View style={styles.itemIconSection}>
        <View style={styles.itemIconWrapper}>
          {item.image ? (
            <Image source={item.image} style={styles.itemImage} resizeMode="contain" />
          ) : (
            <Text style={styles.itemIcon}>{item.icon}</Text>
          )}
        </View>
      </View>

      <View style={styles.itemDetailsSection}>
        <View style={styles.itemHeaderRow}>
          <Text style={styles.itemName} numberOfLines={2}>
            {item.name}
          </Text>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => removeProductFromCart(item.id)}
          >
            <Ionicons name="trash" size={18} color={Colors.ERROR} />
          </TouchableOpacity>
        </View>

        <View style={styles.itemPricingRow}>
          <View style={styles.pricingContainer}>
            <Text style={styles.originalPrice}>₹{Math.round(item.price * 1.3)}</Text>
            <Text style={styles.salePrice}>₹{item.price}</Text>
          </View>
          <View style={styles.quantityControl}>
            <TouchableOpacity
              style={styles.quantityBtn}
              onPress={() => removeFromCart(item.id)}
            >
              <Ionicons name="remove" size={12} color={Colors.PRIMARY} />
            </TouchableOpacity>
            <Text style={styles.quantityValue}>{item.quantity}</Text>
            <TouchableOpacity
              style={styles.quantityBtn}
              onPress={() => addToCart(item.id)}
            >
              <Ionicons name="add" size={12} color={Colors.PRIMARY} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  const renderAddOnItem = ({ item }) => {
    const isInCart = cartItems[item.id] > 0;
    const quantity = cartItems[item.id] || 0;

    return (
      <View style={styles.addOnCard}>
        <View style={styles.addOnIconSection}>
          <View style={styles.addOnIconWrapper}>
            <Text style={styles.addOnIcon}>{item.icon}</Text>
          </View>
        </View>

        <View style={styles.addOnDetailsSection}>
          <View style={styles.addOnTopRow}>
            <Text style={styles.addOnName} numberOfLines={2}>
              {item.name}
            </Text>
            {!isInCart && (
              <TouchableOpacity
                style={[styles.addToCartBtn, styles.addToCartBtnAdjusted]}
                onPress={() => addToCart(item.id)}
              >
                <Text style={styles.addToCartText}>Add</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.addOnBottomRow}>
            <Text style={styles.addOnPrice}>₹{item.price}</Text>
            {isInCart && (
              <View style={styles.addOnQuantityControl}>
                <TouchableOpacity
                  style={styles.addOnQuantityBtn}
                  onPress={() => removeFromCart(item.id)}
                >
                  <Ionicons name="remove" size={10} color={Colors.PRIMARY} />
                </TouchableOpacity>
                <Text style={styles.addOnQuantityValue}>{quantity}</Text>
                <TouchableOpacity
                  style={styles.addOnQuantityBtn}
                  onPress={() => addToCart(item.id)}
                >
                  <Ionicons name="add" size={10} color={Colors.PRIMARY} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {isInCart && (
          <View style={styles.addOnTotalSection}>
            <Text style={styles.addOnTotal}>₹{item.price * quantity}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#f8f9fa', '#e9ecef']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={28} color={Colors.TEXT_PRIMARY} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Shopping Cart</Text>
            <Text style={styles.headerSubtitle}>
              {cartProducts.length} items in cart
            </Text>
          </View>
        </View>
      </LinearGradient>

      {isEmpty ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={80} color={Colors.TEXT_MUTED} />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>
            Add accessories from the categories to get started
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.emptyButtonText}>Continue Shopping</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.emptyButton, { backgroundColor: Colors.PRIMARY, marginTop: 10 }]}
            onPress={() => addToCart({
              id: 'test_123',
              name: 'Test Product',
              price: 100,
              image: null,
              description: 'Test description'
            })}
          >
            <Text style={styles.emptyButtonText}>Add Test Item</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Special Offers Section */}
          {specialOffers.length > 0 && (
            <View style={styles.specialOffersSection}>
              <FlatList
                ref={offerFlatListRef}
                data={specialOffers}
                renderItem={renderOfferBanner}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(event) => {
                  const contentOffsetX = event.nativeEvent.contentOffset.x;
                  const currentIndex = Math.round(contentOffsetX / event.nativeEvent.layoutMeasurement.width);
                  setActiveOfferIndex(currentIndex);
                }}
              />
              {specialOffers.length > 1 && renderOfferPaginationDots()}
            </View>
          )}

          {/* Cart Items Section */}
          <View style={styles.cartItemsContainer}>
            {cartProducts.map((item) => (
              <View key={item.id}>
                {renderCartItem({ item })}
              </View>
            ))}
          </View>

          {/* Add-ons Section */}
          <View style={styles.addOnsSection}>
            <Text style={styles.addOnsTitle}>Recommended Add-ons</Text>
            <View style={styles.addOnsListContent}>
              {ADD_ON_PRODUCTS.map((item) => (
                <View key={item.id}>
                  {renderAddOnItem({ item })}
                </View>
              ))}
            </View>
          </View>

          {/* Apply Coupons Section */}
          <View style={styles.couponsSection}>
            <TouchableOpacity
              style={styles.couponButton}
              onPress={() => setCouponModalVisible(true)}
            >
              {selectedCoupon ? (
                <LinearGradient
                  colors={['#667eea', '#764ba2']}
                  style={styles.couponButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Ionicons name="checkmark-circle" size={20} color={Colors.LIGHT_BACKGROUND} />
                  <Text style={styles.couponButtonTextApplied}>
                    Applied: {selectedCoupon.title}
                  </Text>
                  <Ionicons name="chevron-forward" size={16} color={Colors.LIGHT_BACKGROUND} />
                </LinearGradient>
              ) : (
                <View style={styles.couponButtonNormal}>
                  <Ionicons name="pricetag" size={20} color={Colors.PRIMARY} />
                  <Text style={styles.couponButtonText}>
                    Apply Coupon
                  </Text>
                  <Ionicons name="chevron-forward" size={16} color={Colors.TEXT_MUTED} />
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.bottomSection}>
            <View style={styles.priceBreakdown}>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Subtotal</Text>
                <Text style={styles.priceValue}>₹{totalPrice}</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Delivery</Text>
                <Text style={styles.priceValue}>Free</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.priceRow}>
                <Text style={styles.totalLabel}>Total Amount</Text>
                <Text style={styles.totalValue}>₹{totalPrice}</Text>
              </View>
            </View>

            <LinearGradient
              colors={Colors.PRIMARY_GRADIENT}
              style={styles.checkoutBtnGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <TouchableOpacity 
                style={styles.checkoutBtn}
                onPress={handleProceedToCheckout}
              >
                <Ionicons name="card" size={20} color={Colors.LIGHT_BACKGROUND} />
                <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
                <Ionicons name="arrow-forward" size={16} color={Colors.LIGHT_BACKGROUND} />
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </ScrollView>
      )}

      {/* Coupon Selection Modal */}
      <Modal
        visible={couponModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setCouponModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.modalHeaderGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View style={styles.modalHeader}>
                <View style={styles.modalTitleContainer}>
                  <Ionicons name="pricetag" size={24} color={Colors.LIGHT_BACKGROUND} />
                  <Text style={styles.modalTitle}>Available Coupons</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setCouponModalVisible(false)}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={24} color={Colors.LIGHT_BACKGROUND} />
                </TouchableOpacity>
              </View>
            </LinearGradient>

            <ScrollView style={styles.couponList}>
              {AVAILABLE_COUPONS.map((coupon) => (
                <TouchableOpacity
                  key={coupon.id}
                  style={styles.couponItem}
                  onPress={() => handleCouponSelect(coupon)}
                >
                  <LinearGradient
                    colors={selectedCoupon?.id === coupon.id ? ['#667eea', '#764ba2'] : ['rgba(255,255,255,0)', 'rgba(255,255,255,0)']}
                    style={styles.couponItemGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <View style={[
                      styles.couponItemContent,
                      selectedCoupon?.id !== coupon.id && styles.couponItemUnselected
                    ]}>
                      <View style={styles.couponIcon}>
                        <Text style={styles.couponIconText}>{coupon.icon}</Text>
                      </View>
                      <View style={styles.couponDetails}>
                        {selectedCoupon?.id === coupon.id ? (
                          <>
                            <Text style={styles.couponTitleSelected}>{coupon.title}</Text>
                            <Text style={styles.couponDescriptionSelected}>{coupon.description}</Text>
                            <Text style={styles.couponDiscountSelected}>{coupon.discount}</Text>
                          </>
                        ) : (
                          <>
                            <Text style={styles.couponTitle}>{coupon.title}</Text>
                            <Text style={styles.couponDescription}>{coupon.description}</Text>
                            <Text style={styles.couponDiscount}>{coupon.discount}</Text>
                          </>
                        )}
                      </View>
                      {selectedCoupon?.id === coupon.id ? (
                        <View style={styles.selectedIndicator}>
                          <Ionicons name="checkmark-circle" size={24} color={Colors.LIGHT_BACKGROUND} />
                        </View>
                      ) : (
                        <View style={styles.unselectedIndicator}>
                          <Ionicons name="radio-button-off" size={20} color={Colors.TEXT_MUTED} />
                        </View>
                      )}
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.removeCouponButton}
              onPress={() => {
                setSelectedCoupon(null);
                setCouponModalVisible(false);
              }}
            >
              <Text style={styles.removeCouponText}>Remove Applied Coupon</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Colored Confetti/Paper Pieces */}
      {sparkles.map((sparkle) => {
        const translateX = Math.cos(sparkle.angle) * sparkle.distance;
        const translateY = Math.sin(sparkle.angle) * sparkle.distance + (sparkle.animValue.__getValue?.() || 0) * 30;
        
        return (
          <Animated.View
            key={sparkle.id}
            style={[
              styles.confetti,
              {
                backgroundColor: sparkle.color,
                transform: [
                  {
                    translateX: sparkle.animValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, translateX],
                    }),
                  },
                  {
                    translateY: sparkle.animValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, translateY],
                    }),
                  },
                  {
                    rotateX: sparkle.animValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', `${sparkle.rotation}deg`],
                    }),
                  },
                  {
                    rotateZ: sparkle.animValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', `${sparkle.rotation * 4}deg`],
                    }),
                  },
                  {
                    scale: sparkle.animValue.interpolate({
                      inputRange: [0, 0.6, 1],
                      outputRange: [0.8, 1.2, 0.1],
                    }),
                  },
                ],
                opacity: sparkle.animValue.interpolate({
                  inputRange: [0, 0.2, 0.75, 1],
                  outputRange: [0.9, 1, 0.9, 0],
                }),
              },
            ]}
          />
        );
      })}

      {/* Thanks Popup */}
      {showThanksPopup && (
        <Animated.View
          style={[
            styles.thanksPopup,
            {
              opacity: thanksAnimation,
              transform: [
                {
                  scale: thanksAnimation.interpolate({
                    inputRange: [0, 0.6, 1],
                    outputRange: [0.3, 1.15, 1],
                  }),
                },
                {
                  rotate: thanksAnimation.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: ['0deg', '5deg', '0deg'],
                  }),
                },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={['#8B9FF0', '#9B7CB5']}
            style={styles.thanksPopupGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.thanksContent}>
              <Text style={styles.thanksEmoji}>🎉</Text>
              <Text style={styles.thanksTitle}>Whoo Thanks!</Text>
              <Text style={styles.thanksSubtitle}>
                {selectedCoupon?.title} applied successfully
              </Text>
              <Text style={styles.thanksDiscount}>
                You saved {selectedCoupon?.discount}
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.PAGE_BACKGROUND,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  cartItemsContainer: {
    paddingHorizontal: Spacing.SCREEN_HORIZONTAL,
    paddingVertical: Spacing.S,
  },
  headerGradient: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.BORDER_LIGHT,
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
  },
  headerTitle: {
    fontSize: Typography.HEADING_L,
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
  },
  headerSubtitle: {
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_SECONDARY,
    marginTop: Spacing.XS,
  },
  listContent: {
    paddingHorizontal: Spacing.SCREEN_HORIZONTAL,
    paddingVertical: Spacing.L,
  },
  cartItemCard: {
    backgroundColor: Colors.CARD_BACKGROUND,
    borderRadius: Spacing.BORDER_RADIUS_S,
    marginBottom: Spacing.S,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
    flexDirection: 'row',
  },
  itemIconSection: {
    width: '20%',
    backgroundColor: Colors.SECTION_BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 80,
  },
  itemIconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  itemIcon: {
    fontSize: 32,
  },
  itemImage: {
    width: 32,
    height: 32,
  },
  itemDetailsSection: {
    flex: 1,
    padding: Spacing.S,
    justifyContent: 'center',
    paddingRight: Spacing.M,
  },
  itemHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.XS,
  },
  deleteButton: {
    padding: Spacing.XS,
    marginLeft: Spacing.XS,
  },
  itemName: {
    flex: 1,
    fontSize: Typography.BODY_M,
    fontWeight: '600',
    color: Colors.TEXT_PRIMARY,
  },
  itemPricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pricingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.XS,
  },
  originalPrice: {
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_MUTED,
    textDecorationLine: 'line-through',
  },
  salePrice: {
    fontSize: Typography.HEADING_S,
    fontWeight: '700',
    color: Colors.PRIMARY,
  },

  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.XS,
    backgroundColor: Colors.SECTION_BACKGROUND,
    borderRadius: Spacing.BORDER_RADIUS_S,
    paddingHorizontal: Spacing.XS,
    paddingVertical: Spacing.XS,
  },
  quantityBtn: {
    width: 20,
    height: 20,
    borderRadius: 3,
    backgroundColor: Colors.LIGHT_BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityValue: {
    fontSize: Typography.BODY_M,
    fontWeight: '600',
    color: Colors.TEXT_PRIMARY,
    minWidth: 24,
    textAlign: 'center',
  },
  itemTotalSection: {
    paddingHorizontal: Spacing.S,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  itemTotal: {
    fontSize: Typography.HEADING_S,
    fontWeight: '700',
    color: Colors.PRIMARY,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.SCREEN_HORIZONTAL,
  },
  emptyTitle: {
    fontSize: Typography.HEADING_L,
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
    marginTop: Spacing.L,
    marginBottom: Spacing.S,
  },
  emptySubtitle: {
    fontSize: Typography.BODY_M,
    color: Colors.TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: Spacing.XL,
  },
  emptyButton: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: Spacing.M,
    paddingHorizontal: Spacing.XL,
    borderRadius: Spacing.BORDER_RADIUS_S,
  },
  emptyButtonText: {
    color: Colors.LIGHT_BACKGROUND,
    fontSize: Typography.BODY_M,
    fontWeight: '600',
    textAlign: 'center',
  },
  bottomSection: {
    backgroundColor: Colors.LIGHT_BACKGROUND,
    borderTopWidth: 1,
    borderTopColor: Colors.BORDER_LIGHT,
    paddingHorizontal: Spacing.SCREEN_HORIZONTAL,
    paddingVertical: Spacing.L,
    gap: Spacing.M,
  },
  priceBreakdown: {
    backgroundColor: Colors.SECTION_BACKGROUND,
    borderRadius: Spacing.BORDER_RADIUS_M,
    paddingHorizontal: Spacing.M,
    paddingVertical: Spacing.M,
    gap: Spacing.S,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_SECONDARY,
    fontWeight: '500',
  },
  priceValue: {
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_PRIMARY,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.BORDER_LIGHT,
    marginVertical: Spacing.S,
  },
  totalLabel: {
    fontSize: Typography.BODY_M,
    color: Colors.TEXT_PRIMARY,
    fontWeight: '700',
  },
  totalValue: {
    fontSize: Typography.HEADING_M,
    color: Colors.PRIMARY,
    fontWeight: '700',
  },
  checkoutBtnGradient: {
    borderRadius: Spacing.BORDER_RADIUS_S,
    marginTop: Spacing.M,
  },
  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.S,
    paddingVertical: Spacing.M,
  },
  checkoutBtnText: {
    color: Colors.LIGHT_BACKGROUND,
    fontSize: Typography.BODY_M,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  addOnsSection: {
    backgroundColor: Colors.PAGE_BACKGROUND,
    paddingHorizontal: Spacing.SCREEN_HORIZONTAL,
    paddingVertical: Spacing.M,
    marginTop: Spacing.XS,
    marginBottom: Spacing.L,
  },
  addOnsTitle: {
    fontSize: Typography.BODY_M,
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
    marginBottom: Spacing.S,
  },
  addOnsListContent: {
    gap: 2,
  },
  addOnCard: {
    backgroundColor: Colors.CARD_BACKGROUND,
    borderRadius: Spacing.BORDER_RADIUS_S,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
    flexDirection: 'row',
    padding: Spacing.XS,
    marginBottom: Spacing.XS,
  },
  addToCartBtn: {
    backgroundColor: Colors.PRIMARY,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Spacing.BORDER_RADIUS_S,
  },
  addToCartBtnAdjusted: {
    marginTop: 8,
  },
  addOnQuantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: Colors.SECTION_BACKGROUND,
    borderRadius: Spacing.BORDER_RADIUS_S,
    paddingHorizontal: 3,
    paddingVertical: 2,
  },
  addOnQuantityBtn: {
    width: 18,
    height: 18,
    borderRadius: 2,
    backgroundColor: Colors.LIGHT_BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addOnQuantityValue: {
    fontSize: Typography.BODY_S,
    fontWeight: '600',
    color: Colors.TEXT_PRIMARY,
    minWidth: 20,
    textAlign: 'center',
  },
  addToCartText: {
    color: Colors.LIGHT_BACKGROUND,
    fontSize: Typography.BODY_S,
    fontWeight: '600',
  },
  addOnIconSection: {
    width: '16%',
    backgroundColor: Colors.SECTION_BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 45,
    borderRadius: Spacing.BORDER_RADIUS_S,
  },
  addOnIconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  addOnIcon: {
    fontSize: 20,
  },
  addOnDetailsSection: {
    flex: 1,
    paddingHorizontal: Spacing.XS,
    justifyContent: 'center',
  },
  addOnTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  addOnName: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.TEXT_PRIMARY,
  },
  addOnBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addOnPrice: {
    fontSize: Typography.BODY_S,
    fontWeight: '700',
    color: Colors.PRIMARY,
  },
  addOnTotalSection: {
    paddingHorizontal: Spacing.XS,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  addOnTotal: {
    fontSize: Typography.BODY_S,
    fontWeight: '700',
    color: Colors.PRIMARY,
  },
  couponsSection: {
    backgroundColor: Colors.PAGE_BACKGROUND,
    paddingHorizontal: Spacing.SCREEN_HORIZONTAL,
    paddingVertical: Spacing.S,
    marginTop: Spacing.XS,
  },
  couponButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.CARD_BACKGROUND,
    borderRadius: Spacing.BORDER_RADIUS_S,
    padding: Spacing.S,
    borderWidth: 1,
    borderColor: Colors.BORDER_LIGHT,
    borderStyle: 'dashed',
  },
  couponButtonText: {
    flex: 1,
    fontSize: Typography.BODY_M,
    fontWeight: '500',
    color: Colors.TEXT_PRIMARY,
    marginLeft: Spacing.XS,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.PAGE_BACKGROUND,
    borderTopLeftRadius: Spacing.BORDER_RADIUS_L,
    borderTopRightRadius: Spacing.BORDER_RADIUS_L,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.M,
    borderBottomWidth: 1,
    borderBottomColor: Colors.BORDER_LIGHT,
  },
  modalTitle: {
    fontSize: Typography.HEADING_M,
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
  },
  closeButton: {
    padding: Spacing.XS,
  },
  couponList: {
    maxHeight: 400,
  },
  couponItem: {
    marginHorizontal: Spacing.M,
    marginVertical: Spacing.XS,
    borderRadius: Spacing.BORDER_RADIUS_M,
    overflow: 'hidden',
  },
  couponItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.M,
    borderRadius: Spacing.BORDER_RADIUS_M,
    borderWidth: 1,
    borderColor: Colors.BORDER_LIGHT,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  couponItemGradient: {
    borderRadius: Spacing.BORDER_RADIUS_M,
  },
  couponItemUnselected: {
    backgroundColor: Colors.CARD_BACKGROUND,
  },
  couponIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.SECTION_BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.M,
  },
  couponIconText: {
    fontSize: 24,
  },
  couponDetails: {
    flex: 1,
  },
  couponTitle: {
    fontSize: Typography.BODY_M,
    fontWeight: '600',
    color: Colors.TEXT_PRIMARY,
    marginBottom: Spacing.XS,
  },
  couponDescription: {
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_SECONDARY,
    marginBottom: Spacing.XS,
  },
  couponDiscount: {
    fontSize: Typography.BODY_M,
    fontWeight: '700',
    color: Colors.PRIMARY,
  },
  selectedIndicator: {
    marginLeft: Spacing.S,
  },
  removeCouponButton: {
    margin: Spacing.M,
    padding: Spacing.S,
    backgroundColor: '#FFEBEE',
    borderRadius: Spacing.BORDER_RADIUS_S,
    alignItems: 'center',
  },
  removeCouponText: {
    color: Colors.ERROR,
    fontSize: Typography.BODY_M,
    fontWeight: '600',
  },
  // Premium Modal Header Styles
  modalHeaderGradient: {
    borderTopLeftRadius: Spacing.BORDER_RADIUS_L,
    borderTopRightRadius: Spacing.BORDER_RADIUS_L,
  },
  modalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.S,
  },
  // Enhanced Coupon Item Styles
  couponTitleSelected: {
    fontSize: Typography.BODY_M,
    fontWeight: '600',
    color: Colors.LIGHT_BACKGROUND,
    marginBottom: Spacing.XS,
  },
  couponDescriptionSelected: {
    fontSize: Typography.BODY_S,
    color: Colors.LIGHT_BACKGROUND,
    opacity: 0.9,
    marginBottom: Spacing.XS,
  },
  couponDiscountSelected: {
    fontSize: Typography.BODY_M,
    fontWeight: '700',
    color: Colors.LIGHT_BACKGROUND,
  },
  unselectedIndicator: {
    marginLeft: Spacing.S,
  },
  // Enhanced Coupon Button Styles
  couponButtonNormal: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.CARD_BACKGROUND,
    borderRadius: Spacing.BORDER_RADIUS_S,
    padding: Spacing.S,
    borderWidth: 1,
    borderColor: Colors.BORDER_LIGHT,
    borderStyle: 'dashed',
  },
  couponButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Spacing.BORDER_RADIUS_S,
    padding: Spacing.S,
  },
  couponButtonTextApplied: {
    flex: 1,
    fontSize: Typography.BODY_M,
    fontWeight: '600',
    color: Colors.LIGHT_BACKGROUND,
    marginLeft: Spacing.XS,
  },
  // Thanks Popup Styles
  thanksPopup: {
    position: 'absolute',
    top: '30%',
    left: '10%',
    right: '10%',
    zIndex: 1000,
    alignItems: 'center',
  },
  thanksPopupGradient: {
    borderRadius: Spacing.BORDER_RADIUS_L,
    padding: Spacing.L,
    paddingVertical: 24,
    alignItems: 'center',
    minWidth: 260,
    maxWidth: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 15,
  },
  thanksContent: {
    alignItems: 'center',
    width: '100%',
  },
  thanksEmoji: {
    fontSize: 56,
    marginBottom: Spacing.M,
    opacity: 0.9,
  },
  thanksTitle: {
    fontSize: Typography.HEADING_M,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: Spacing.S,
    textAlign: 'center',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  thanksSubtitle: {
    fontSize: Typography.BODY_S,
    color: '#FFFFFF',
    opacity: 1,
    textAlign: 'center',
    marginBottom: Spacing.M,
    lineHeight: 18,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 0.5 },
    textShadowRadius: 2,
  },
  thanksDiscount: {
    fontSize: Typography.BODY_M,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    paddingVertical: Spacing.XS,
    paddingHorizontal: Spacing.M,
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: Spacing.BORDER_RADIUS_S,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 0.5 },
    textShadowRadius: 2,
  },
  specialOffersSection: {
    backgroundColor: Colors.PAGE_BACKGROUND,
    paddingVertical: Spacing.S,
  },
  offerBannerCard: {
    width: 320,
    height: 160,
    borderRadius: Spacing.BORDER_RADIUS_M,
    marginHorizontal: Spacing.SCREEN_HORIZONTAL,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  offerBannerImage: {
    width: '100%',
    height: '100%',
  },
  offerBannerGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.L,
  },
  offerBannerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  offerBannerDiscount: {
    fontSize: Typography.HEADING_L,
    fontWeight: '700',
    color: Colors.LIGHT_BACKGROUND,
    marginBottom: Spacing.XS,
  },
  offerBannerTitle: {
    fontSize: Typography.HEADING_M,
    fontWeight: '700',
    color: Colors.LIGHT_BACKGROUND,
    textAlign: 'center',
    marginBottom: Spacing.XS,
  },
  offerBannerSubtitle: {
    fontSize: Typography.BODY_S,
    color: Colors.LIGHT_BACKGROUND,
    textAlign: 'center',
    opacity: 0.9,
  },
  offerPaginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.M,
    gap: Spacing.S,
  },
  offerPaginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.BORDER_LIGHT,
  },
  offerPaginationDotActive: {
    backgroundColor: Colors.PRIMARY,
    width: 24,
  },
  confetti: {
    position: 'absolute',
    top: '30%',
    left: '50%',
    marginLeft: -8,
    marginTop: -8,
    width: 16,
    height: 16,
    borderRadius: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
});

export default CartScreen;
