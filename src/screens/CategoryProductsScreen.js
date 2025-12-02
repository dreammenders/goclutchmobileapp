import React, { useState, useMemo } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import { Spacing } from '../constants/Spacing';
import { useCart } from '../context/CartContext';
import EnhancedProductCard from '../components/EnhancedProductCard';

const CATEGORY_MEDIA = {
  '1': require('../../assets/accessories/lubricant.png'),
  '2': require('../../assets/accessories/tyres.png'),
  '3': require('../../assets/accessories/battery.png'),
  '4': require('../../assets/accessories/coolant.png'),
  '5': require('../../assets/accessories/oil-filter.png'),
  '6': require('../../assets/accessories/wiper.png'),
};

const CATEGORY_STORIES = {
  default: 'Discover premium upgrades tailored for your ride.',
  '1': 'Combustion-smoothing lubricants boosting throttle response on demand.',
  '2': 'Grip-obsessed compounds sculpted for fearless corner domination.',
  '3': 'Voltage vaults that refuse to quit, even on the coldest crank.',
  '4': 'Hyper-chilled coolants engineered for mega-city traffic battles.',
  '5': 'Filtration guardians purifying every breath your engine inhales.',
  '6': 'Crystal-clear sweeps that vaporise monsoon downpours instantly.',
};

const BASE_VISUALS = {
  cardGradient: ['#FFFFFF', '#F7F7F7'],
  cardHighlightGradient: ['#FFFFFF', '#F1F1F1'],
  accent: '#FF7A3B',
  accentSoft: 'rgba(255, 122, 59, 0.16)',
  accentStrong: 'rgba(255, 122, 59, 0.24)',
};

const PRODUCTS_BY_CATEGORY = {
  '1': [
    {
      id: '1',
      name: 'Valeo Synthetic Oil 5W-40',
      price: 520,
      originalPrice: 650,
      rating: 4.6,
      benefits: ['Advanced protection', 'Better performance'],
      image: CATEGORY_MEDIA['1'],
      description: 'Track-born synthetic oil delivering ultra-low friction and blistering throttle response.',
      offer: '20% OFF',
      membershipBenefit: 'Gold members save extra 10%',
    },
    {
      id: '2',
      name: 'Castrol EDGE 5W-30',
      price: 680,
      rating: 4.8,
      benefits: ['Titanium technology', 'Premium quality'],
      image: CATEGORY_MEDIA['1'],
      description: 'Titanium-reinforced formula engineered for racers demanding relentless endurance.',
      offer: 'FREE Delivery',
      membershipBenefit: 'Prime members get it today',
    },
    {
      id: '3',
      name: 'Denso Premium Oil 10W-40',
      price: 450,
      originalPrice: 500,
      rating: 4.4,
      benefits: ['Reliable engine care', 'Wear protection'],
      image: CATEGORY_MEDIA['1'],
      description: 'Balanced viscosity blend guarding high-mileage engines through brutal city commutes.',
      offer: '10% OFF',
      membershipBenefit: 'Gold members save extra 10%',
    },
    {
      id: '4',
      name: 'Shell Helix Ultra 0W-40',
      price: 750,
      rating: 4.7,
      benefits: ['Fuel efficiency', 'Engine cleanliness'],
      image: CATEGORY_MEDIA['1'],
      description: 'Gas-to-liquid purity keeping turbocharged powertrains polished and surge-ready.',
      offer: 'Popular',
      membershipBenefit: 'Warranty included for members',
    },
    {
      id: '5',
      name: 'Motul 300V Engine Oil 5W-40',
      price: 850,
      originalPrice: 999,
      rating: 4.9,
      benefits: ['High performance', 'Race-tested'],
      image: CATEGORY_MEDIA['1'],
      description: 'Double-ester racing serum unleashing explosive acceleration lap after lap.',
      offer: '15% OFF',
      membershipBenefit: 'Priority support & returns',
    },
    {
      id: '6',
      name: 'Mobil 1 Synthetic 5W-30',
      price: 720,
      rating: 4.8,
      benefits: ['Superior protection', 'Extended drain'],
      image: CATEGORY_MEDIA['1'],
      description: 'Signature Mobil chemistry shielding internals through punishing heat cycles.',
      offer: 'Limited Stock',
      membershipBenefit: 'Price match guarantee',
    },
    {
      id: '7',
      name: 'Bosch Power Max 10W-40',
      price: 380,
      originalPrice: 420,
      rating: 4.5,
      benefits: ['Affordable premium', 'Excellent lubrication'],
      image: CATEGORY_MEDIA['1'],
      description: 'Precision-blended hybrid formula reinventing value-driven performance.',
      offer: 'Best Value',
      membershipBenefit: 'Free shipping on this item',
    },
  ],
  '2': [
    {
      id: '8',
      name: 'MRF ZVTS 185/65 R15',
      price: 3500,
      originalPrice: 4000,
      rating: 4.6,
      benefits: ['Durable grip', 'Long life'],
      image: CATEGORY_MEDIA['2'],
      description: 'Adaptive tread geometry locking onto wet asphalt for razor-stable corner exits.',
      offer: '12% OFF',
      membershipBenefit: 'Free fitment for members',
    },
    {
      id: '9',
      name: 'CEAT Milaze 185/65 R15',
      price: 3200,
      rating: 4.5,
      benefits: ['Fuel efficient', 'Smooth ride'],
      image: CATEGORY_MEDIA['2'],
      description: 'Low rolling resistance casing tuned for long-haul savings without compromising grip.',
      offer: 'Offers available',
      membershipBenefit: 'Extended warranty option',
    },
    {
      id: '10',
      name: 'Apollo Amazer 185/65 R15',
      price: 2800,
      originalPrice: 3100,
      rating: 4.4,
      benefits: ['Value for money', 'Comfortable'],
      image: CATEGORY_MEDIA['2'],
      description: 'High-silica compound smoothing out potholes while keeping steering taut.',
      offer: '10% OFF',
      membershipBenefit: 'Best Value Deal',
    },
    {
      id: '11',
      name: 'Michelin Pilot Sport 185/65 R15',
      price: 4800,
      rating: 4.8,
      benefits: ['Premium quality', 'Superior grip'],
      image: CATEGORY_MEDIA['2'],
      description: 'Dual-compound shoulders built for extreme braking loads and midnight sprints.',
      offer: 'Premium Pick',
      membershipBenefit: 'Priority support included',
    },
    {
      id: '12',
      name: 'Bridgestone Turanza 185/65 R15',
      price: 4200,
      originalPrice: 4900,
      rating: 4.7,
      benefits: ['Best performance', 'Warranty coverage'],
      image: CATEGORY_MEDIA['2'],
      description: 'Noise-cancelling rib pattern engineered for limousine-grade silence.',
      offer: '14% OFF',
      membershipBenefit: 'Lifetime balance free',
    },
    {
      id: '13',
      name: 'JK Tyres ProX 185/65 R15',
      price: 3100,
      rating: 4.5,
      benefits: ['Durability', 'Cost effective'],
      image: CATEGORY_MEDIA['2'],
      description: 'Reinforced bead package conquering rough terrain while staying feather-light.',
      offer: 'Popular Choice',
      membershipBenefit: 'Free rotation service',
    },
  ],
  '3': [
    {
      id: '14',
      name: 'Exide Xpress 50Ah Battery',
      price: 3200,
      originalPrice: 3600,
      rating: 4.5,
      benefits: ['2 years warranty', 'Reliable start'],
      image: CATEGORY_MEDIA['3'],
      description: 'Thick-plate architecture delivering unstoppable cold-crank power in seconds.',
      offer: '11% OFF',
      membershipBenefit: 'Free installation included',
    },
    {
      id: '15',
      name: 'Amaron Pro 55Ah Battery',
      price: 4500,
      rating: 4.7,
      benefits: ['3 years warranty', 'Premium quality'],
      image: CATEGORY_MEDIA['3'],
      description: 'Silver-alloy grids sustaining premium sedans through high-drain infotainment loads.',
      offer: 'Premium Quality',
      membershipBenefit: 'Replacement guarantee',
    },
  ],
  '4': [
    {
      id: '16',
      name: 'Engine Coolant 5L',
      price: 350,
      originalPrice: 400,
      rating: 4.4,
      benefits: ['Rust prevention', 'Heat dissipation'],
      image: CATEGORY_MEDIA['4'],
      description: 'Pre-mixed coolant locking in sub-zero protection with anti-corrosion additives.',
      offer: '12% OFF',
      membershipBenefit: 'Gold members save extra 5%',
    },
    {
      id: '17',
      name: 'Premium Coolant Concentrate 1L',
      price: 200,
      rating: 4.6,
      benefits: ['Concentrate formula', 'Affordable'],
      image: CATEGORY_MEDIA['4'],
      description: 'Concentrated coolant builder letting you dial bespoke freeze and boil thresholds.',
      offer: 'Best Value',
      membershipBenefit: 'Free delivery',
    },
  ],
  '5': [
    {
      id: '18',
      name: 'Air Filter',
      price: 280,
      originalPrice: 320,
      rating: 4.5,
      benefits: ['Better airflow', 'Engine protection'],
      image: CATEGORY_MEDIA['5'],
      description: 'Dual-layer filtration trapping microns while unlocking effortless airflow.',
      offer: '12% OFF',
      membershipBenefit: 'Buy 2 get 10% extra off',
    },
    {
      id: '19',
      name: 'Oil Filter Premium',
      price: 320,
      originalPrice: 380,
      rating: 4.6,
      benefits: ['Excellent filtration', 'Extends oil life'],
      image: CATEGORY_MEDIA['5'],
      description: 'Synthetic media core extending oil life and defending precision valvetrains.',
      offer: '15% OFF',
      membershipBenefit: 'Perfect with Oil pack',
    },
  ],
  '6': [
    {
      id: '20',
      name: 'Front Windshield Wipers Pair',
      price: 450,
      originalPrice: 550,
      rating: 4.5,
      benefits: ['Clear visibility', 'Durable rubber', 'Easy fit'],
      image: CATEGORY_MEDIA['6'],
      description: 'High-velocity aerofoil clearing monsoon chaos without chatter along the glass.',
      offer: '18% OFF',
      membershipBenefit: 'Free installation at service center',
    },
    {
      id: '21',
      name: 'Premium Wiper Blades',
      price: 650,
      originalPrice: 800,
      rating: 4.7,
      benefits: ['Streak-free cleaning', 'Longer life', 'Silent operation'],
      image: CATEGORY_MEDIA['6'],
      description: 'Graphite-infused blade hugging every curve even at triple-digit speeds.',
      offer: '18% OFF',
      membershipBenefit: 'Extended wear guarantee',
    },
  ],
};

const CATEGORY_NAMES = {
  '1': 'Lubricants',
  '2': 'Tyres',
  '3': 'Batteries',
  '4': 'Coolants',
  '5': 'Filters',
  '6': 'Wipers',
};

const CategoryProductsScreen = ({ navigation, route }) => {
  const categoryId = route.params?.categoryId;
  const categoryName = CATEGORY_NAMES[categoryId] || 'Products';
  const allProducts = PRODUCTS_BY_CATEGORY[categoryId] || [];
  const categoryBrands = useMemo(() => {
    if (categoryId === '1') return ['Bosch', 'Castrol', 'Denso', 'Mobil', 'Motul', 'Shell', 'Valeo'];
    if (categoryId === '2') return ['Apollo', 'Bridgestone', 'CEAT', 'JK Tyres', 'MRF'];
    if (categoryId === '3') return ['Amaron', 'Exide'];
    if (categoryId === '4') return ['Bosch', 'Castrol', 'Motul'];
    if (categoryId === '5') return ['Bosch', 'Denso'];
    if (categoryId === '6') return ['Valeo', 'Bosch'];
    return [];
  }, [categoryId]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const { cartItems, addToCart, removeFromCart } = useCart();

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      const matchesBrand = !selectedBrand || product.name.toLowerCase().includes(selectedBrand.toLowerCase());
      return matchesBrand;
    });
  }, [allProducts, selectedBrand]);

  const renderProductItem = ({ item }) => {
    return (
      <EnhancedProductCard
        id={item.id}
        name={item.name}
        price={item.price}
        originalPrice={item.originalPrice}
        rating={item.rating}
        image={item.image}
        description={item.description}
        benefits={item.benefits}
        offer={item.offer}
        membershipBenefit={item.membershipBenefit}
        cartItems={cartItems}
        onAddToCart={addToCart}
        onRemoveFromCart={removeFromCart}
        onIncrement={addToCart}
      />
    );
  };

  const renderListHeader = () => {
    if (categoryBrands.length === 0) {
      return null;
    }

    return (
      <View style={styles.listHeaderWrapper}>
        <Text style={styles.brandsSectionTitle}>Filter by Brand</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.brandsScroll}
          contentContainerStyle={styles.brandsRow}
        >
          <TouchableOpacity
            style={[styles.brandButton, !selectedBrand && styles.brandButtonActive]}
            onPress={() => setSelectedBrand(null)}
          >
            <Text style={[styles.brandButtonText, !selectedBrand && styles.brandButtonTextActive]}>All</Text>
          </TouchableOpacity>
          {categoryBrands.map((brand) => (
            <TouchableOpacity
              key={brand}
              style={[styles.brandButton, selectedBrand === brand && styles.brandButtonActive]}
              onPress={() => setSelectedBrand(selectedBrand === brand ? null : brand)}
            >
              <Text
                style={[styles.brandButtonText, selectedBrand === brand && styles.brandButtonTextActive]}
              >
                {brand}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.6}
          >
            <Ionicons name="chevron-back" size={28} color={Colors.TEXT_PRIMARY} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>{categoryName}</Text>
          </View>
        </View>

        <View style={styles.surface}>
          <FlatList
            data={filteredProducts}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            scrollIndicatorInsets={{ right: 1 }}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={renderListHeader}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.LIGHT_BACKGROUND,
  },
  safeArea: {
    flex: 1,
    backgroundColor: Colors.LIGHT_BACKGROUND,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.SCREEN_HORIZONTAL,
    paddingVertical: Spacing.M,
    paddingTop: Spacing.S,
    gap: Spacing.M,
    backgroundColor: Colors.LIGHT_BACKGROUND,
    borderBottomWidth: 1,
    borderBottomColor: Colors.BORDER_LIGHT,
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
  surface: {
    flex: 1,
  },
  listContent: {
    paddingBottom: Spacing.XXL,
    paddingHorizontal: Spacing.SCREEN_HORIZONTAL,
    paddingTop: Spacing.M,
  },
  listHeaderWrapper: {
    marginBottom: Spacing.M,
  },
  brandsSectionTitle: {
    fontSize: Typography.BODY_M,
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
    marginBottom: Spacing.S,
  },
  brandsScroll: {
    marginHorizontal: 0,
    paddingHorizontal: 0,
  },
  brandsRow: {
    paddingVertical: Spacing.S,
    alignItems: 'center',
  },
  brandButton: {
    paddingHorizontal: Spacing.M,
    paddingVertical: Spacing.XS,
    marginRight: Spacing.S,
    borderRadius: 28,
    backgroundColor: Colors.LIGHT_BACKGROUND,
    borderWidth: 1,
    borderColor: Colors.BORDER_LIGHT,
  },
  brandButtonActive: {
    backgroundColor: '#FF7A3B',
    borderColor: '#FF7A3B',
  },
  brandButtonText: {
    fontSize: Typography.BODY_S,
    fontWeight: '600',
    color: Colors.TEXT_PRIMARY,
  },
  brandButtonTextActive: {
    color: Colors.LIGHT_BACKGROUND,
  },
  productCard: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: Spacing.M,
    marginBottom: Spacing.M,
    overflow: 'hidden',
    backgroundColor: Colors.LIGHT_BACKGROUND,
    borderWidth: 1,
    borderColor: 'rgba(255, 122, 59, 0.12)',
    shadowColor: '#FF7A3B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  imageColumn: {
    width: 130,
    height: 130,
    marginRight: Spacing.L,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderRadius: 12,
    backgroundColor: 'rgba(255, 122, 59, 0.08)',
    overflow: 'hidden',
  },
  imageGlow: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    opacity: 0.4,
  },
  productImage: {
    width: 130,
    height: 130,
    resizeMode: 'contain',
  },
  detailsColumn: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: Spacing.XS,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.XS,
    gap: Spacing.M,
  },
  productName: {
    flex: 1,
    fontSize: Typography.BODY_M,
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
    lineHeight: 22,
  },
  price: {
    fontSize: Typography.BODY_L,
    fontWeight: '800',
    color: '#FF7A3B',
    minWidth: 70,
    textAlign: 'right',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: Spacing.S,
    gap: Spacing.S,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 122, 59, 0.15)',
  },
  rating: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF7A3B',
  },
  vibeBadge: {
    backgroundColor: 'rgba(255, 122, 59, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 122, 59, 0.3)',
  },
  vibeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FF7A3B',
    letterSpacing: 0.2,
  },
  productDescription: {
    fontSize: Typography.CAPTION,
    color: Colors.TEXT_SECONDARY,
    marginBottom: Spacing.S,
    lineHeight: 18,
    maxHeight: 36,
  },
  benefitsSection: {
    flexDirection: 'row',
    gap: Spacing.XS,
    marginBottom: Spacing.M,
    flexWrap: 'wrap',
  },
  benefitBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 122, 59, 0.2)',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 122, 59, 0.4)',
  },
  benefitText: {
    fontSize: 10,
    color: '#FF7A3B',
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  buttonSection: {
    marginTop: 'auto',
    paddingTop: Spacing.S,
  },
  addToCartBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: Spacing.L,
    borderRadius: 10,
    backgroundColor: '#FF7A3B',
    gap: 6,
    shadowColor: '#FF7A3B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  addToCartLabel: {
    color: Colors.LIGHT_BACKGROUND,
    fontSize: Typography.BODY_S,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.LIGHT_BACKGROUND,
    borderRadius: 10,
    paddingHorizontal: Spacing.M,
    paddingVertical: 8,
    borderWidth: 1.5,
    borderColor: '#FF7A3B',
    minHeight: 40,
    gap: 8,
  },
  quantityBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 122, 59, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 122, 59, 0.3)',
  },
  quantityValue: {
    fontSize: Typography.BODY_S,
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
    minWidth: 24,
    textAlign: 'center',
  },
  priceColumn: {
    alignItems: 'flex-end',
  },
  originalPrice: {
    fontSize: 11,
    color: Colors.TEXT_SECONDARY,
    textDecorationLine: 'line-through',
    marginTop: 2,
  },
  offerBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#FF7A3B',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 122, 59, 0.5)',
  },
  offerText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.LIGHT_BACKGROUND,
    letterSpacing: 0.2,
  },
  membershipBenefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(255, 122, 59, 0.08)',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#FF7A3B',
    marginVertical: 6,
    gap: 6,
  },
  membershipBenefitText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FF7A3B',
    flex: 1,
  },
});

export default CategoryProductsScreen;
