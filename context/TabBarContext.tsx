import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the types for the context state
interface TabBarContextType {
  showTabBar: boolean;
  setShowTabBar: React.Dispatch<React.SetStateAction<boolean>>;
  role: string | null;
  setRole: React.Dispatch<React.SetStateAction<string | null>>;
  username: string | null;
  setUsername: React.Dispatch<React.SetStateAction<string | null>>;
  userId: string | null;
  setUserId: React.Dispatch<React.SetStateAction<string | null>>;
}

// Create context with a default value of `undefined`
const TabBarVisibilityContext = createContext<TabBarContextType | undefined>(
  undefined,
);

// Create a provider component that will wrap the app
export const TabBarProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [showTabBar, setShowTabBar] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  return (
    <TabBarVisibilityContext.Provider
      value={{
        showTabBar,
        setShowTabBar,
        role,
        setRole,
        username,
        setUsername,
        userId,
        setUserId,
      }}
    >
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
