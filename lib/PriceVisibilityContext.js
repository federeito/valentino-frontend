import { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const PriceVisibilityContext = createContext();

export const PriceVisibilityProvider = ({ children }) => {
    const { data: session, status } = useSession();
    const [canViewPrices, setCanViewPrices] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const checkPricePermission = async () => {
            // If session is still loading, keep loading state
            if (status === 'loading') {
                setIsLoading(true);
                setCanViewPrices(false);
                return;
            }

            // If no session, immediately set to false
            if (status === 'unauthenticated' || !session) {
                setCanViewPrices(false);
                setIsAdmin(false);
                setIsLoading(false);
                return;
            }

            // Only make API call if user is authenticated
            if (status === 'authenticated' && session) {
                setIsLoading(true);
                
                try {
                    const response = await fetch('/api/user/price-permission', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include'
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setCanViewPrices(data.canViewPrices === true);
                        setIsAdmin(data.isAdmin === true);
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
            }
        };

        checkPricePermission();
    }, [session, status]);

    // Only allow prices if authenticated and approved
    const safeCanViewPrices = (status === 'authenticated' && session) ? canViewPrices : false;
    const safeIsLoggedIn = status === 'authenticated' && !!session;

    return (
        <PriceVisibilityContext.Provider value={{ 
            canViewPrices: safeCanViewPrices, 
            isLoading,
            isLoggedIn: safeIsLoggedIn,
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
