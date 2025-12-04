/**
 * Service gradient color definitions
 * Used to create visually appealing service cards with dynamic gradients
 */

const SERVICE_GRADIENTS = [
    ['#6366F1', '#8B5CF6'], // Indigo to Purple
    ['#EC4899', '#F43F5E'], // Pink to Rose
    ['#10B981', '#059669'], // Emerald to Green
    ['#F59E0B', '#EF4444'], // Amber to Red
    ['#3B82F6', '#06B6D4'], // Blue to Cyan
    ['#8B5CF6', '#D946EF'], // Purple to Fuchsia
    ['#14B8A6', '#06B6D4'], // Teal to Cyan
    ['#F97316', '#DC2626'], // Orange to Red
];

/**
 * Get gradient colors for a service based on its index
 * @param {number} index - The service index
 * @returns {Array<string>} Array of two hex color strings [startColor, endColor]
 */
export const getServiceGradient = (index) => {
    return SERVICE_GRADIENTS[index % SERVICE_GRADIENTS.length];
};

export default { getServiceGradient };
