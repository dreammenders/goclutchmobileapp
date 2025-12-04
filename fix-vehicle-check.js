const fs = require('fs');

const filePath = './src/screens/HomeScreen.js';
let content = fs.readFileSync(filePath, 'utf8');

// Replace handleServicePress function with vehicle check
const oldFunction = `  const handleServicePress = (service) => {
    navigation.navigate('ServiceDetails', { service });
  };`;

const newFunction = `  const handleServicePress = (service) => {
    // Check if vehicle is selected
    if (!selectedVehicle || !selectedVehicle.model || !selectedVehicle.variant) {
      Alert.alert(
        'Select Your Vehicle',
        'Please select your car model and variant to view accurate service pricing.',
        [
          { text: 'Select Vehicle', onPress: () => navigation.navigate('BrandSelection') },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
      return;
    }

    // Navigate with model and variant IDs for dynamic pricing
    navigation.navigate('ServiceDetails', { 
      service,
      modelId: selectedVehicle.model.id,
      variantId: selectedVehicle.variant.id
    });
  };`;

content = content.replace(oldFunction, newFunction);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Added vehicle selection check to HomeScreen.js!');
