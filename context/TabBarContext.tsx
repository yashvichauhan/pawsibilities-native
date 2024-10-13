import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the types for the context state
interface TabBarContextType {
  showTabBar: boolean;
  setShowTabBar: React.Dispatch<React.SetStateAction<boolean>>;
}

// Create context with a default value of `undefined`
const TabBarVisibilityContext = createContext<TabBarContextType | undefined>(undefined);

// Create a provider component that will wrap the app
export const TabBarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [showTabBar, setShowTabBar] = useState(false);

  return (
    <TabBarVisibilityContext.Provider value={{ showTabBar, setShowTabBar }}>
      {children}
    </TabBarVisibilityContext.Provider>
  );
};

// Custom hook to use the TabBarVisibilityContext
export function useTabBarVisibility(): TabBarContextType {
  const context = useContext(TabBarVisibilityContext);
  if (!context) {
    throw new Error('useTabBarVisibility must be used within a TabBarProvider');
  }
  return context;
}
