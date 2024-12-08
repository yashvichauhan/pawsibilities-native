import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PetCard from '../PetCard';
import Toast from 'react-native-toast-message';

jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
}));

describe('PetCard Component', () => {
  const petMock = {
    id: 1,
    name: 'Buddy',
    status: 'Available',
    image: 'https://example.com/cat.jpg',
  };

  it('renders correctly with pet details', () => {
    const { getByText, getByTestId } = render(<PetCard pet={petMock} />);

    expect(getByText('Buddy')).toBeTruthy();
    expect(getByText('Available')).toBeTruthy();
    // expect(getByTestId('pet-image')).toBeTruthy();
  });

  // it('toggles favorite state and shows appropriate toast', () => {
  //   const { getByTestId } = render(<PetCard pet={petMock} />);
  //   const favoriteButton = getByTestId('favorite-button');

  //   // Add to favorites
  //   fireEvent.press(favoriteButton);
  //   expect(Toast.show).toHaveBeenCalledWith({
  //     type: 'success',
  //     text1: 'Added to Favorites',
  //     text2: 'Buddy has been added to your favorites.',
  //   });

  //   // Remove from favorites
  //   fireEvent.press(favoriteButton);
  //   expect(Toast.show).toHaveBeenCalledWith({
  //     type: 'info',
  //     text1: 'Removed from Favorites',
  //     text2: 'Buddy has been removed from your favorites.',
  //   });
  // });
});
