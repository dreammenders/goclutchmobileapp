import React from 'react';
import { View } from 'react-native';
import ServicePackageCard from './ServicePackageCard';

const PlansList = ({ 
  plans, 
  service, 
  calculateFinalPrice, 
  handleViewDetails 
}) => {
  if (!Array.isArray(plans) || plans.length === 0) {
    return null;
  }

  return (
    <View>
      {plans.map((plan, index) => {
        if (!plan || !plan.id) return null;
        
        const pricing = calculateFinalPrice(plan);
        
        const planData = {
          id: plan.id,
          isRecommended: plan.is_popular ? true : false,
          serviceTitle: String(plan.name || 'Service Plan'),
          features: (plan.description && typeof plan.description === 'string') 
            ? plan.description.split('\n').filter(item => item?.trim?.().length > 0).map(f => String(f))
            : [],
          originalPrice: pricing.cutoffPrice || 0,
          discountedPrice: pricing.finalPrice || 0,
          discountPercentage: plan.discount_percentage || 0,
          imageUrl: plan.image_url || '',
          sessionalOffText: String(plan.sessional_off_text || ''),
          sessionalOffPrice: Number(plan.sessional_off_price) || 0,
          promoOffer: {
            title: (plan.duration_months && plan.warranty_months) 
              ? `Validity: ${plan.duration_months} months | Warranty: ${plan.warranty_months} months`
              : 'Service Package',
            cashback: "Go Clutch Coin Cashback",
            finalPrice: pricing.finalPrice || 0
          }
        };
        
        return (
          <ServicePackageCard
            key={`${service?.id}-${plan.id}-${pricing.finalPrice}`}
            {...planData}
            onPress={() => handleViewDetails(plan)}
          />
        );
      })}
    </View>
  );
};

export default PlansList;
