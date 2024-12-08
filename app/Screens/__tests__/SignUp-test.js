import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SignUp from '../SignUp';
import { useNavigation } from '@react-navigation/native';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

describe('SignUp Component', () => {
  it('renders the sign-up screen correctly', () => {
    const { getByPlaceholderText, getByText } = render(
      <SignUp path="testPath" />,
    );

    expect(getByPlaceholderText('Enter your username')).toBeTruthy();
    expect(getByPlaceholderText('Enter your email')).toBeTruthy();
    expect(getByPlaceholderText('Enter your password')).toBeTruthy();
    expect(getByText('Sign Up')).toBeTruthy();
  });

  it('updates input fields on change', () => {
    const { getByPlaceholderText } = render(<SignUp path="testPath" />);

    const usernameInput = getByPlaceholderText('Enter your username');
    const emailInput = getByPlaceholderText('Enter your email');
    const passwordInput = getByPlaceholderText('Enter your password');

    fireEvent.changeText(usernameInput, 'TestUser');
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'securepassword');

    expect(usernameInput.props.value).toBe('TestUser');
    expect(emailInput.props.value).toBe('test@example.com');
    expect(passwordInput.props.value).toBe('securepassword');
  });

  it('toggles user type between Pet Owner and Pet Adopter', () => {
    const { getByText } = render(<SignUp path="testPath" />);

    const petOwnerButton = getByText('Pet Owner');
    const petAdopterButton = getByText('Pet Adopter');

    // Initial state should be Pet Owner
    fireEvent.press(petAdopterButton);
    expect(getByText('Pet Adopter')).toBeTruthy();

    fireEvent.press(petOwnerButton);
    expect(getByText('Pet Owner')).toBeTruthy();
  });
});
