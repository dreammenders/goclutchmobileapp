import { useState, useEffect } from 'react';
import mobileApi from '../../api/mobileApi';

/**
 * Custom hook to fetch and manage home screen data
 * Fetches services, promotional banners, and special offers
 * 
 * @returns {Object} { services, banners, offers, isLoading, error, refetch }
 */
export const useHomeData = () => {
    const [services, setServices] = useState([]);
    const [banners, setBanners] = useState([]);
    const [offers, setOffers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch services from API
    const fetchServices = async () => {
        try {
            const result = await mobileApi.getServices({ limit: 50 });
            if (result.success) {
                setServices(result.data.services || []);
            }
        } catch (err) {
            console.error('Error fetching services:', err);
            setError(err);
        }
    };

    // Fetch promotional banners from API
    const fetchBanners = async () => {
        try {
            const result = await mobileApi.getPromotionalBanners({ limit: 10 });
            if (result.success) {
                const activeBanners = (result.data.banners || []).filter(
                    banner => banner.is_active
                );
                setBanners(activeBanners);
            }
        } catch (err) {
            console.error('Error fetching banners:', err);
        }
    };

    // Fetch special offers from API
    const fetchOffers = async () => {
        try {
            const result = await mobileApi.getSpecialOffers({ limit: 10 });
            if (result.success) {
                const activeOffers = (result.data.offers || []).filter(
                    offer => offer.is_active
                );
                setOffers(activeOffers);
            }
        } catch (err) {
            console.error('Error fetching offers:', err);
        }
    };

    // Fetch all data
    const fetchAllData = async () => {
        setIsLoading(true);
        setError(null);

        await Promise.all([
            fetchServices(),
            fetchBanners(),
            fetchOffers(),
        ]);

        setIsLoading(false);
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    return {
        services,
        banners,
        offers,
        isLoading,
        error,
        refetch: fetchAllData,
    };
};

export default useHomeData;
