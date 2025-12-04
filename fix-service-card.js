const fs = require('fs');

const filePath = './src/components/ServicePackageCard.js';
let content = fs.readFileSync(filePath, 'utf8');

// Fix 1: Add props
content = content.replace(
    '  promoOffer,\r\n  onPress,',
    '  promoOffer,\r\n  sessionalOffPrice = 0,\r\n  sessionalOffText,\r\n  onPress,'
);

// Fix 2: Add null check for originalPrice
content = content.replace(
    '<Text style={styles.originalPrice}>₹{originalPrice.toLocaleString()}</Text>',
    '{originalPrice && <Text style={styles.originalPrice}>₹{originalPrice.toLocaleString()}</Text>}'
);

// Fix 3: Add null check for discountedPrice
content = content.replace(
    '<Text style={styles.discountedPrice}>₹{discountedPrice.toLocaleString()}</Text>',
    '{discountedPrice && <Text style={styles.discountedPrice}>₹{discountedPrice.toLocaleString()}</Text>}'
);

// Fix 4: Replace hardcoded seasonal offer with dynamic
content = content.replace(
    '<Text style={styles.savingsTextContent}>Winter OFF - 200</Text>',
    `<Text style={styles.savingsTextContent}>
            {sessionalOffText ? \`\${sessionalOffText} - ₹\${sessionalOffPrice}\` : 'Winter OFF - 200'}
          </Text>`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Fixed ServicePackageCard.js successfully!');
