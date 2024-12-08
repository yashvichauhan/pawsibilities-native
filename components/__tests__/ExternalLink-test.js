import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ExternalLink } from '../ExternalLink';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';

jest.mock('expo-web-browser');

describe('ExternalLink Component', () => {
  it('should not prevent the default behavior on the web platform', () => {
    Platform.OS = 'web'; // Mocking the platform as web
    const preventDefaultMock = jest.fn();

    const { getByText } = render(
      <ExternalLink href="https://example.com">Click Me</ExternalLink>,
    );

    const linkElement = getByText('Click Me');
    fireEvent.press(linkElement, {
      nativeEvent: { preventDefault: preventDefaultMock },
    });

    expect(preventDefaultMock).not.toHaveBeenCalled();
  });
});
