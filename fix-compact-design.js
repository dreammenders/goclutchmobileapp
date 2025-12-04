const fs = require('fs');

const filePath = './src/screens/ServiceDetailsScreen.js';
let content = fs.readFileSync(filePath, 'utf8');

// Reduce header padding and height
content = content.replace(
    /paddingVertical: Spacing\.M,\n    backgroundColor: '#FFFFFF',\n    borderBottomWidth: 1,\n    borderBottomColor: '#E0E0E0',/,
    `paddingVertical: Spacing.XS,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.5,
    borderBottomColor: '#F0F0F0',`
);

// Reduce header title size
content = content.replace(
    /headerTitle: {\s+fontSize: responsiveSize\(18\),/,
    `headerTitle: {
    fontSize: responsiveSize(16),`
);

// Reduce servicesNavigator padding
content = content.replace(
    /servicesNavigator: {\s+backgroundColor: '#FFFFFF',\s+paddingVertical: Spacing\.M,/,
    `servicesNavigator: {
    backgroundColor: '#FFFFFF',
    paddingVertical: Spacing.S,`
);

// Reduce navigator title size and spacing
content = content.replace(
    /navigatorTitle: {\s+fontSize: responsiveSize\(16\),\s+fontWeight: '600',\s+color: '#000000',\s+marginBottom: Spacing\.S,/,
    `navigatorTitle: {
    fontSize: responsiveSize(14),
    fontWeight: '600',
    color: '#666666',
    marginBottom: Spacing.XS,`
);

// Reduce service card sizes
content = content.replace(
    /serviceCard: {\s+alignItems: 'center',\s+backgroundColor: '#F5F5F5',\s+borderRadius: responsiveSize\(12\),\s+paddingVertical: Spacing\.S,\s+paddingHorizontal: Spacing\.M,\s+marginRight: Spacing\.S,\s+minWidth: responsiveSize\(80\),/,
    `serviceCard: {
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: responsiveSize(10),
    paddingVertical: Spacing.XS,
    paddingHorizontal: Spacing.S,
    marginRight: Spacing.XS,
    minWidth: responsiveSize(70),`
);

// Reduce service icon size
content = content.replace(
    /serviceIconContainer: {\s+width: responsiveSize\(40\),\s+height: responsiveSize\(40\),\s+borderRadius: responsiveSize\(20\),/,
    `serviceIconContainer: {
    width: responsiveSize(32),
    height: responsiveSize(32),
    borderRadius: responsiveSize(16),`
);

// Reduce service icon actual icon size
content = content.replace(
    /size={24}/g,
    'size={20}'
);

// Reduce service name font
content = content.replace(
    /serviceName: {\s+fontSize: responsiveSize\(12\),/,
    `serviceName: {
    fontSize: responsiveSize(11),`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Fixed ServiceDetailsScreen.js for world-class compact design!');
