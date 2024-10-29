import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

import { useTabBarVisibility } from '@/context/TabBarContext'; // Import the context hook

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const { showTabBar, role } = useTabBarVisibility(); // Use context to get the tab visibility state

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
        tabBarStyle: { display: showTabBar ? 'flex' : 'none' }, // Hide/show the tab bar
      }}>

    { showTabBar ? 
      <Tabs.Screen
        name="home"
        options={{
          title: role === 'Pet Owner' ? 'Owner Home' : 'Adopter Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
        :
        <Tabs.Screen
        name="home"
        options={{ href: null, }}
        />
      }

    { showTabBar ? 
      <Tabs.Screen
        name="Account"
        options={{
          title: role === 'Pet Owner' ? 'Owner Profile' : 'Adopter Profile',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
        :
        <Tabs.Screen
        name="Account"
        options={{ href: null, }}
        />
    }

      <Tabs.Screen
          name="Login"
          options={{ href: null, }}
        />

      <Tabs.Screen
          name="SignUp"
          options={{ href: null, }}
        />

 
    </Tabs>
  );
}
