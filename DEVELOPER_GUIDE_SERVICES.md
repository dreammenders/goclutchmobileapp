# Developer Guide - Service Plan Integration

## Quick Start

### 1. Understanding the Integration

The modern service plan comparison UI is integrated into `ServiceDetailsScreen.js`:

```javascript
// User navigates to service
HomeScreen → (click service) → ServiceDetailsScreen
                                    ↓
                            Fetch plans via API
                                    ↓
                            Display with new design
                                    ↓
                            User selects plan → Checkout
```

### 2. Key Component Flow

```javascript
// 1. Component mounts
<ServiceDetailsScreen service={serviceData} />

// 2. Fetch plans on mount
useEffect(() => {
  fetchServicePlans(); // Calls mobileApi.getPlansByService(service.id)
}, [service.id]);

// 3. Display plans based on count
if (plans.length >= 2) {
  // Render modern side-by-side comparison
  renderModernComparisonCard(plans[0], 0, false);  // Standard
  renderModernComparisonCard(plans[1], 1, true);   // Premium
}

if (plans.length > 2) {
  // Render additional plans in classic format
  renderLegacyPlanCard(plans[2], index);
}

// 4. Handle selection
handleSelectPlan(plan) → Alert → Navigate to Checkout
```

---

## Code Examples

### Example 1: Accessing the Component

```javascript
import ServiceDetailsScreen from '../screens/ServiceDetailsScreen';

// In your navigator
<Stack.Navigator>
  <Stack.Screen 
    name="ServiceDetails" 
    component={ServiceDetailsScreen}
    options={{ headerShown: false }}
  />
</Stack.Navigator>

// Navigate to it
navigation.navigate('ServiceDetails', {
  service: {
    id: 1,
    name: 'General Service',
    description: 'Professional car maintenance'
  }
});
```

### Example 2: Plan Object Structure

```javascript
// API returns plans with this structure:
const plan = {
  id: 101,                              // Unique identifier
  name: 'Standard Service',              // Display name
  description: 'Complete engine maintenance',  // Description
  price: 3999,                          // Current selling price
  discount_price: 2799,                 // Discounted price (if on sale)
  original_price: 3999,                 // Original price (if different)
  discount_percentage: 30,              // Optional discount percentage
  warranty_months: 12,                  // Warranty period
  duration_months: 12,                  // Plan validity period
  coverage: 'Full Coverage',            // Coverage type
  is_popular: false,                    // Popular flag
  features: [...],                      // Feature list
};
```

### Example 3: Rendering Logic

```javascript
// Main render logic
{plans.length >= 2 && (
  <View style={styles.modernComparisonContainer}>
    <View style={styles.modernComparison}>
      {/* First plan - Standard style */}
      {renderModernComparisonCard(plans[0], 0, false)}
      
      {/* Second plan - Premium style */}
      {renderModernComparisonCard(plans[1], 1, true)}
    </View>
    
    {/* Comparison note */}
    <View style={styles.comparisonNote}>
      <MaterialCommunityIcons
        name="information-outline"
        size={16}
        color={Colors.PRIMARY}
      />
      <Text style={styles.comparisonNoteText}>
        Compare available plans to find the best option for your needs
      </Text>
    </View>
  </View>
)}

{/* Additional plans below */}
{plans.length > 2 && (
  <View style={styles.additionalPlansSection}>
    <Text style={styles.additionalPlansTitle}>More Plans</Text>
    {plans.slice(2).map((plan, index) => (
      <View key={plan.id}>
        {renderLegacyPlanCard({ item: plan, index: index + 2 })}
      </View>
    ))}
  </View>
)}
```

### Example 4: Handling Plan Selection

```javascript
const handleSelectPlan = (plan) => {
  // Update UI state
  setSelectedPlan(plan);
  setSelectedPlanId(plan.id);
  
  // Show confirmation alert
  Alert.alert(
    'Plan Selected',
    `${plan.name} - ₹${plan.discount_price || plan.price} selected. Proceeding to checkout...`,
    [
      {
        text: 'Continue',
        onPress: () => {
          // Navigate with plan and service context
          navigation.navigate('Checkout', { 
            plan,                    // Full plan object
            service: service         // Service context
          });
        },
      },
      {
        text: 'Cancel',
        style: 'cancel',
        onPress: () => setSelectedPlanId(null),  // Clear selection
      }
    ]
  );
};
```

### Example 5: Discount Calculation

```javascript
// Helper function to calculate discount percentage
const getDiscountPercentage = (plan) => {
  const displayPrice = plan.discount_price || plan.price;
  const originalPrice = plan.original_price || plan.price;
  
  // Use provided percentage or calculate
  return plan.discount_percentage || 
    Math.round(((originalPrice - displayPrice) / originalPrice) * 100);
};

// Usage in render
const discountPercent = getDiscountPercentage(plan);

<View style={styles.discountBadgeModern}>
  <Text style={styles.discountTextModern}>{discountPercent}%</Text>
  <Text style={styles.discountLabelModern}>OFF</Text>
</View>
```

---

## Styling Examples

### Example 1: Modern Plan Card Styling

```javascript
const styles = StyleSheet.create({
  // Card wrapper
  modernPlanCard: {
    flex: 1,
    backgroundColor: Colors.CARD_BACKGROUND,  // '#FAFAFA'
    borderRadius: Spacing.BORDER_RADIUS_L,    // 16px
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.BORDER_LIGHT,         // '#EEEEEE'
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  
  // Premium variant - enhanced styling
  modernPlanCardPremium: {
    borderWidth: 2,
    borderColor: '#6366F1',                   // Indigo
    shadowOpacity: 0.15,                      // Darker shadow
    shadowRadius: 12,
    elevation: 5,                             // Higher elevation
  },
});
```

### Example 2: Discount Badge Styling

```javascript
const styles = StyleSheet.create({
  discountBadgeModern: {
    width: 56,
    height: 56,
    borderRadius: 28,                         // Circular
    backgroundColor: Colors.PRIMARY,         // '#fe5110'
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,                       // Strong shadow
    shadowRadius: 8,
    elevation: 4,
  },
  
  discountTextModern: {
    fontSize: Typography.HEADING_S,           // 20px
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: Typography.LINE_HEIGHT_TIGHT, // 1.2
  },
  
  discountLabelModern: {
    fontSize: Typography.BODY_XS,             // 12px
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
```

### Example 3: Premium Badge Styling

```javascript
const styles = StyleSheet.create({
  premiumBadge: {
    position: 'absolute',
    top: Spacing.M,                           // 16px
    right: Spacing.M,
    backgroundColor: '#6366F1',               // Indigo
    paddingHorizontal: Spacing.M,             // 16px
    paddingVertical: Spacing.XS,              // 4px
    borderRadius: Spacing.BORDER_RADIUS_M,    // 12px
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 20,                               // Always on top
  },
  
  premiumBadgeText: {
    fontSize: Typography.BODY_XS,             // 12px
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,                         // Spaced out letters
  },
});
```

---

## API Integration

### Example 1: Fetching Plans

```javascript
// Component setup
useEffect(() => {
  fetchServicePlans();
}, [service.id]);

// Fetch function
const fetchServicePlans = async () => {
  try {
    setIsLoadingPlans(true);

    // Call API
    const result = await mobileApi.getPlansByService(service.id);

    if (result.success && result.data && result.data.plans) {
      // Sort or manipulate plans if needed
      setPlans(result.data.plans);
    } else {
      throw new Error(result.message || 'Failed to fetch plans');
    }
  } catch (error) {
    // Show error to user
    Alert.alert(
      'Error Loading Plans',
      'Unable to load service plans. Please try again.',
      [
        { text: 'Retry', onPress: fetchServicePlans },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  } finally {
    setIsLoadingPlans(false);
  }
};
```

### Example 2: Expected API Response

```javascript
// API Response structure
{
  success: true,
  data: {
    plans: [
      {
        id: 101,
        name: 'Standard Service',
        price: 3999,
        discount_price: 2799,
        discount_percentage: 30,
        warranty_months: 12,
        duration_months: 12,
        description: 'Engine oil and filter change',
        coverage: 'Full Coverage',
        is_popular: false,
        features: ['Oil Change', 'Filter Change', 'Inspection']
      },
      {
        id: 102,
        name: 'Premium Service',
        price: 5999,
        discount_price: 4199,
        discount_percentage: 30,
        warranty_months: 24,
        duration_months: 12,
        description: 'Comprehensive maintenance',
        coverage: 'Full Coverage',
        is_popular: true,
        features: ['Full Synthetic Oil', 'Comprehensive Check', 'Warranty Extension']
      }
    ]
  }
}
```

---

## State Management

### Example 1: Local State Setup

```javascript
const ServiceDetailsScreen = ({ navigation, route }) => {
  const { service } = route.params;
  
  // State management
  const [plans, setPlans] = useState([]);              // Fetched plans
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);  // Loading state
  const [selectedPlan, setSelectedPlan] = useState(null);      // Selected plan
  const [selectedPlanId, setSelectedPlanId] = useState(null);  // For UI highlighting
  
  // Example with Redux (alternative)
  // const plans = useSelector(state => state.plans.data);
  // const dispatch = useDispatch();
};
```

### Example 2: Using with Redux

```javascript
// Redux actions
export const fetchServicePlans = (serviceId) => async (dispatch) => {
  dispatch({ type: 'PLANS_LOADING' });
  try {
    const result = await mobileApi.getPlansByService(serviceId);
    dispatch({ 
      type: 'PLANS_SUCCESS', 
      payload: result.data.plans 
    });
  } catch (error) {
    dispatch({ 
      type: 'PLANS_ERROR', 
      payload: error.message 
    });
  }
};

// In component
const plans = useSelector(state => state.plans.data);
const loading = useSelector(state => state.plans.loading);

useEffect(() => {
  dispatch(fetchServicePlans(service.id));
}, [service.id, dispatch]);
```

---

## Navigation Integration

### Example 1: Navigation Setup

```javascript
// In navigation configuration
const Stack = createNativeStackNavigator();

export function ServiceNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="ServiceDetails" 
        component={ServiceDetailsScreen}
      />
      <Stack.Screen 
        name="Checkout" 
        component={CheckoutScreen}
        options={{
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
}
```

### Example 2: Passing Data to Checkout

```javascript
navigation.navigate('Checkout', {
  plan: {
    id: 101,
    name: 'Standard Service',
    price: 2799,
    originalPrice: 3999,
    discount: 30,
    warranty: 12,
    features: [...]
  },
  service: {
    id: 1,
    name: 'General Service',
    description: 'Professional maintenance'
  }
});

// In Checkout screen
const { plan, service } = route.params;
```

---

## Error Handling

### Example 1: Comprehensive Error Handling

```javascript
const fetchServicePlans = async () => {
  try {
    setIsLoadingPlans(true);
    setError(null);

    if (!service || !service.id) {
      throw new Error('Invalid service ID');
    }

    const result = await mobileApi.getPlansByService(service.id);

    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch plans');
    }

    if (!result.data || !Array.isArray(result.data.plans)) {
      throw new Error('Invalid response format');
    }

    if (result.data.plans.length === 0) {
      setPlans([]);
      setError('No plans available for this service');
      return;
    }

    setPlans(result.data.plans);
  } catch (error) {
    console.error('Error fetching plans:', error);
    setError(error.message);
    
    Alert.alert(
      'Error',
      error.message || 'Unable to load service plans',
      [
        { text: 'Retry', onPress: fetchServicePlans },
        { text: 'Go Back', onPress: () => navigation.goBack() }
      ]
    );
  } finally {
    setIsLoadingPlans(false);
  }
};
```

---

## Performance Optimization

### Example 1: Memoizing Cards

```javascript
import React, { useMemo } from 'react';

// Memoize comparison cards rendering
const memoizedComparison = useMemo(() => {
  if (plans.length < 2) return null;
  
  return (
    <View style={styles.modernComparison}>
      {renderModernComparisonCard(plans[0], 0, false)}
      {renderModernComparisonCard(plans[1], 1, true)}
    </View>
  );
}, [plans.length, selectedPlanId]);
```

### Example 2: Lazy Loading

```javascript
// Show only first 5 plans initially
const [visiblePlansCount, setVisiblePlansCount] = useState(5);

const displayedPlans = plans.slice(0, visiblePlansCount);

{displayedPlans.length < plans.length && (
  <TouchableOpacity 
    onPress={() => setVisiblePlansCount(prev => prev + 5)}
  >
    <Text>Load More</Text>
  </TouchableOpacity>
)}
```

---

## Testing Examples

### Example 1: Unit Test

```javascript
import { render, fireEvent } from '@testing-library/react-native';

test('should display 2 modern comparison cards for 2+ plans', () => {
  const mockPlans = [
    { id: 1, name: 'Plan 1', price: 100 },
    { id: 2, name: 'Plan 2', price: 200 },
  ];
  
  const { getByText } = render(
    <ServiceDetailsScreen 
      route={{ params: { service: { id: 1 } } }}
      plans={mockPlans}
    />
  );
  
  expect(getByText('Plan 1')).toBeTruthy();
  expect(getByText('Plan 2')).toBeTruthy();
});
```

### Example 2: Integration Test

```javascript
test('should navigate to checkout on plan selection', async () => {
  const mockNavigation = { navigate: jest.fn() };
  const mockPlans = [{ id: 1, name: 'Test Plan', price: 100 }];
  
  const { getByText } = render(
    <ServiceDetailsScreen 
      navigation={mockNavigation}
      route={{ params: { service: { id: 1 } } }}
      plans={mockPlans}
    />
  );
  
  fireEvent.press(getByText('Book Now'));
  
  // After alert confirmation
  expect(mockNavigation.navigate).toHaveBeenCalledWith('Checkout', expect.any(Object));
});
```

---

## Debugging Tips

### 1. Console Logging

```javascript
const handleSelectPlan = (plan) => {
  console.log('Plan selected:', plan);
  console.log('Plan ID:', plan.id);
  console.log('Plan Price:', plan.price);
  console.log('Selected Plan ID state:', selectedPlanId);
};
```

### 2. React DevTools

```bash
# Install React DevTools
npm install --save-dev react-devtools

# In your app, add:
import 'react-devtools';
```

### 3. Network Debugging

```javascript
// Add request logging
mobileApiClient.interceptors.request.use((config) => {
  console.log('API Request:', config.url, config.params);
  return config;
});

mobileApiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);
```

---

## Common Issues & Solutions

### Issue 1: Plans not rendering

**Diagnosis:**
```javascript
console.log('Plans length:', plans.length);
console.log('Plans data:', plans);
console.log('Is loading:', isLoadingPlans);
```

**Solution:**
- Verify API returns valid data
- Check network tab for API response
- Ensure service.id is valid

### Issue 2: Styling not applying

**Diagnosis:**
```javascript
// Check if styles are being imported
console.log('Styles object:', styles);
console.log('Card style:', styles.modernPlanCard);
```

**Solution:**
- Verify StyleSheet.create() contains all styles
- Check for typos in style names
- Ensure Colors constant is imported

### Issue 3: Navigation not working

**Diagnosis:**
```javascript
console.log('Navigation object:', navigation);
console.log('Attempting navigation to:', 'Checkout');
```

**Solution:**
- Verify route exists in navigator
- Check navigation prop is passed
- Ensure correct route name

---

## Advanced Customization

### Example 1: Custom Plan Colors

```javascript
const getPlanGradient = (plan) => {
  // Custom logic per plan
  if (plan.name.includes('Premium')) {
    return ['#6366F1', '#8B5CF6']; // Indigo
  }
  if (plan.name.includes('Basic')) {
    return ['#FF8C42', '#FFA044']; // Orange
  }
  return ['#10B981', '#059669']; // Green default
};
```

### Example 2: Conditional Features

```javascript
// Show different UI based on plan type
{plan.is_popular && (
  <View style={styles.premiumBadge}>
    <MaterialCommunityIcons name="crown" size={12} />
    <Text>MOST POPULAR</Text>
  </View>
)}

{plan.discount_price && (
  <View style={styles.discountBadgeModern}>
    <Text>{getDiscountPercentage(plan)}%</Text>
  </View>
)}
```

---

## Next Steps

1. ✅ Review the component code
2. ✅ Test with real API data
3. ✅ Verify navigation works end-to-end
4. ✅ Test on multiple device sizes
5. ✅ Implement in your app
6. ✅ Monitor analytics and user feedback
7. ✅ Iterate based on feedback

---

**File Reference**: `src/screens/ServiceDetailsScreen.js`

**Total Lines Changed**: ~350 lines

**Key Functions Added**:
- `getDiscountPercentage()`
- `renderModernComparisonCard()`
- `renderLegacyPlanCard()`

**Styles Added**: 50+

---

For design documentation, see `SERVICE_PLAN_DESIGN_GUIDE.md`  
For implementation details, see `SERVICE_PLAN_IMPLEMENTATION.md`  
For transformation overview, see `SERVICE_PAGES_TRANSFORMATION.md`
