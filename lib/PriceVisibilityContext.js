import { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const PriceVisibilityContext = createContext();

export const PriceVisibilityProvider = ({ children }) => {
    const { data: session } = useSession();
    const [canViewPrices, setCanViewPrices] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const checkPricePermission = async () => {
            setIsLoading(true);
            
            if (!session) {
                // Guest users cannot see prices
                setCanViewPrices(false);
                setIsAdmin(false);
                setIsLoading(false);
                return;
            }

            try {
                // Check if user is approved to see prices
                const response = await fetch('/api/user/price-permission', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setCanViewPrices(data.canViewPrices);
                    setIsAdmin(data.isAdmin || false);
                } else {
                    setCanViewPrices(false);
                    setIsAdmin(false);
                }
            } catch (error) {
                console.error('Error checking price permission:', error);
                setCanViewPrices(false);
                setIsAdmin(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkPricePermission();
    }, [session]);

    return (
        <PriceVisibilityContext.Provider value={{ 
            canViewPrices, 
            isLoading,
            isLoggedIn: !!session,
            isAdmin
        }}>
            {children}
        </PriceVisibilityContext.Provider>
    );
};

export const usePriceVisibility = () => {
    const context = useContext(PriceVisibilityContext);
    if (!context) {
        throw new Error('usePriceVisibility must be used within a PriceVisibilityProvider');
    }
    return context;
};
