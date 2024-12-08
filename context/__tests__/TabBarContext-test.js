import React from 'react';
import { Text, Button } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { TabBarProvider, useTabBarVisibility } from '../TabBarContext';

describe('TabBarContext (React Native)', () => {
  const TestComponent = () => {
    const context = useTabBarVisibility();

    if (!context) {
      return <Text>Context not available</Text>;
    }

    const {
      showTabBar,
      setShowTabBar,
      role,
      setRole,
      username,
      setUsername,
      userId,
      setUserId,
    } = context;

    return (
      <>
        <Text testID="showTabBar">{showTabBar ? 'Visible' : 'Hidden'}</Text>
        <Text testID="role">{role || 'No role'}</Text>
        <Text testID="username">{username || 'No username'}</Text>
        <Text testID="userId">{userId || 'No userId'}</Text>
        <Button title="Show Tab Bar" onPress={() => setShowTabBar(true)} />
        <Button title="Set Role" onPress={() => setRole('Admin')} />
        <Button title="Set Username" onPress={() => setUsername('JohnDoe')} />
        <Button title="Set UserId" onPress={() => setUserId('12345')} />
      </>
    );
  };

  it('provides default values', () => {
    const { getByTestId } = render(
      <TabBarProvider>
        <TestComponent />
      </TabBarProvider>,
    );

    expect(getByTestId('showTabBar').props.children).toBe('Hidden');
    expect(getByTestId('role').props.children).toBe('No role');
    expect(getByTestId('username').props.children).toBe('No username');
    expect(getByTestId('userId').props.children).toBe('No userId');
  });

  it('updates context values correctly', () => {
    const { getByTestId, getByText } = render(
      <TabBarProvider>
        <TestComponent />
      </TabBarProvider>,
    );

    // Update showTabBar
    fireEvent.press(getByText('Show Tab Bar'));
    expect(getByTestId('showTabBar').props.children).toBe('Visible');

    // Update role
    fireEvent.press(getByText('Set Role'));
    expect(getByTestId('role').props.children).toBe('Admin');

    // Update username
    fireEvent.press(getByText('Set Username'));
    expect(getByTestId('username').props.children).toBe('JohnDoe');

    // Update userId
    fireEvent.press(getByText('Set UserId'));
    expect(getByTestId('userId').props.children).toBe('12345');
  });
});
