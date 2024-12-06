/**
 * Post a New Pet Screen for Pet Owners
 * Allows users to post a new pet for adoption
 * Uses AI to predict species and breed based on the image
 */
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Button,
  View,
  Text,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useTabBarVisibility } from '@/context/TabBarContext';

export default function PostNewPet() {
  const navigation = useNavigation();
  const { userId } = useTabBarVisibility();

  // State variables for each form field
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Unknown');
  const [size, setSize] = useState('Medium');
  const [color, setColor] = useState('');
  const [description, setDescription] = useState('');
  const [available, setAvailable] = useState(true);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [labels, setLabels] = useState<string[]>([]);
  const [address, setAddress] = useState('');

  // Reset the form when the component mounts
  useEffect(() => {
    return () => resetForm();
  }, []);

  const resetForm = () => {
    setName('');
    setSpecies('');
    setBreed('');
    setAge('');
    setGender('Unknown');
    setSize('Medium');
    setColor('');
    setDescription('');
    setImageUri(null);
    setLabels([]);
    setAddress('');
  };

  /**
   * Handle selecting an image from the device
   * Uses the ImagePicker API to select an image
   * and sets the image URI to state
   * @returns void
   */
  const handleSelectImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
        console.log('Image selected successfully:', result.assets[0].uri);
      } else {
        console.log('User cancelled image picker');
      }
    } catch (error) {
      console.error('Unexpected error in handleSelectImage:', error);
    }
  };

  /**
   * Get AI prediction for the selected image
   */
  const popularPets = {
    dog: [
      'Labrador Retriever',
      'German Shepherd',
      'Golden Retriever',
      'Bulldog',
      'Poodle',
      'Husky',
      'Shih-Tzu',
      'Beagle',
      'Boxer',
      'Chihuahua',
      'Dachshund',
      'Rottweiler',
      'Cocker Spaniel',
      'Doberman',
      'Pomeranian',
      'Schnauzer',
      'Border Collie',
      'Yorkshire Terrier',
      'French Bulldog',
    ],
    cat: [
      'Persian',
      'Maine Coon',
      'Siamese',
      'Ragdoll',
      'Bengal',
      'British Shorthair',
      'Abyssinian',
      'Sphynx',
      'Scottish Fold',
      'Russian Blue',
    ],
    rabbit: [
      'Netherland Dwarf',
      'Lionhead',
      'Rex',
      'Flemish Giant',
      'Himalayan',
      'Holland Lop',
      'Mini Rex',
      'English Angora',
      'Mini Lop',
    ],
    bird: [
      'Parrot',
      'Canary',
      'Cockatiel',
      'Budgerigar',
      'Macaw',
      'Finch',
      'Pigeon',
      'Lovebird',
      'Cockatoo',
      'Conure',
      'African Grey',
      'Quaker Parrot',
    ],
    fish: [
      'Goldfish',
      'Betta Fish',
      'Guppy',
      'Angelfish',
      'Cichlid',
      'Neon Tetra',
      'Oscar',
      'Platies',
      'Tetra',
      'Barbs',
      'Koi',
      'Discus',
      'Rainbow Fish',
    ],
    reptile: [
      'Turtle',
      'Iguana',
      'Gecko',
      'Chameleon',
      'Bearded Dragon',
      'Snake',
      'Crocodile',
      'Alligator',
      'Lizard',
      'Anole',
      'Skink',
    ],
    hamster: [
      'Syrian Hamster',
      'Dwarf Hamster',
      'Roborovski Hamster',
      'Campbell’s Hamster',
    ],
  };

  /**
   * Get AI prediction for the selected image
   * Uses the combined API endpoint to upload the image
   * and get the prediction labels and auto-fill the form fields
   * @returns prediction labels
   */
  const handleGetAIPrediction = async () => {
    if (!imageUri) {
      Alert.alert('Error', 'Please select an image first.');
      return;
    }

    try {
      // Prepare image data for upload
      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'pet.jpg',
      } as any);

      // Upload image and perform analysis using the combined API endpoint
      const uploadResponse = await fetch(
        `https://pawsibilities-api.onrender.com/api/upload-and-analyze`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        },
      );

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        console.error('Upload failed:', errorData);
        Alert.alert('Error', 'Failed to upload and analyze image.');
        return;
      }

      const { imageUrl, labels } = await uploadResponse.json();

      // Match the labels with the species and breed
      let detectedSpecies: keyof typeof popularPets | null = null;
      let detectedBreed = '';

      // Loop through labels to find species and breed
      const speciesMatches = Object.keys(
        popularPets,
      ) as (keyof typeof popularPets)[]; // Type it as an array of species keys
      speciesMatches.forEach((species) => {
        // Check if species is present in the labels
        if (
          labels.some((label: string) => label.toLowerCase().includes(species))
        ) {
          detectedSpecies = species;

          // Check for breed match in the labels
          popularPets[species].forEach((breed) => {
            if (
              labels.some((label: string) =>
                label.toLowerCase().includes(breed.toLowerCase()),
              )
            ) {
              detectedBreed = breed; // Set the breed if a match is found
            }
          });

          // If no breed is found, set the first breed as default
          if (!detectedBreed) {
            detectedBreed = popularPets[species][0]; // Set the first breed from the list
          }
        }
      });

      // If no species detected, clear the fields
      if (!detectedSpecies) {
        setSpecies('');
        setBreed('');
      } else {
        setSpecies(detectedSpecies); // Set the detected species
        setBreed(detectedBreed); // Set the breed (either matched or first one)
      }
      // Set the labels to state or do further processing
      setLabels(labels);
      console.log('Labels:', labels);

      Alert.alert('AI Prediction', 'Labels retrieved successfully!');
    } catch (error) {
      console.error('Error getting AI prediction:', error);
      Alert.alert('Error', 'An error occurred while getting AI predictions.');
    }
  };

  // Function to handle fetching latitude and longitude using the address
  const fetchCoordinates = async (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=AIzaSyBxXioMJUvVMDtH41PZvLPuuampjxftOyg`;

    try {
      const response = await fetch(geocodeUrl);
      const data = await response.json();

      if (data.status === 'OK') {
        const location = data.results[0].geometry.location;
        return {
          latitude: location.lat,
          longitude: location.lng,
        };
      } else {
        throw new Error('Unable to fetch coordinates');
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      throw error;
    }
  };

  /**
   * Submit the form data to the backend
   * @returns void
   */
  const handleSubmit = async () => {
    if (
      !name ||
      !species ||
      !breed ||
      !age ||
      !color ||
      !description ||
      !imageUri
    ) {
      Alert.alert('Error', 'Please fill out all fields and select an image.');
      return;
    }

    try {
      const owner = userId;

      if (!owner) {
        Alert.alert('Error', 'User ID not found. Please log in.');
        return;
      }

      const { latitude, longitude } = await fetchCoordinates(address);

      if (!longitude || !latitude) {
        Alert.alert(
          'Error',
          'Unable to fetch coordinates for the provided address. Please check and correct the address.',
        );
      }

      const petData = {
        name,
        species,
        breed,
        age: parseInt(age),
        gender,
        size,
        color,
        description,
        available,
        owner,
        longitude,
        latitude,
      };

      const formData = new FormData();
      formData.append('data', JSON.stringify(petData));

      if (imageUri) {
        const imageFile = {
          uri: imageUri,
          type: 'image/jpeg',
          name: 'pet.jpg',
        } as any;
        formData.append('image', imageFile);
      }

      const response = await fetch(
        `https://pawsibilities-api.onrender.com/api/pets`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        },
      );

      if (response.ok) {
        Alert.alert('Success', 'Pet posted successfully');
        navigation.goBack();
        resetForm();
      } else {
        const errorData = await response.json();
        console.error('Failed to post pet:', errorData);
        Alert.alert('Error', errorData.message || 'Failed to post pet');
      }
    } catch (error) {
      console.error('Error posting pet:', (error as Error).message || error);
      Alert.alert('Error', 'An error occurred while posting the pet');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.heading}>Post a New Pet</Text>

      {/* Image Picker Section */}
      <View style={styles.imageSection}>
        <TouchableOpacity
          style={styles.imageButton}
          onPress={handleSelectImage}
        >
          <Text style={styles.buttonText}>Select Image</Text>
        </TouchableOpacity>
        {imageUri && (
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
        )}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleGetAIPrediction}
        >
          <Text style={styles.buttonText}>Get AI Prediction</Text>
        </TouchableOpacity>
        {labels.length > 0 && (
          <View style={styles.labelsContainer}>
            <Text>Detected Labels:</Text>
            {labels.map((label, index) => (
              <Text key={index}>- {label}</Text>
            ))}
          </View>
        )}
      </View>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Species"
        value={species}
        onChangeText={setSpecies}
      />
      <TextInput
        style={styles.input}
        placeholder="Breed"
        value={breed}
        onChangeText={setBreed}
      />
      <TextInput
        style={styles.input}
        placeholder="Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Color"
        value={color}
        onChangeText={setColor}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Address"
        value={address}
        onChangeText={setAddress}
      />

      {/* Gender and Size Fields */}
      <Text style={styles.label}>Gender</Text>
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[styles.button, gender === 'Male' && styles.selectedButton]}
          onPress={() => {
            setGender('Male');
            console.log('Gender set to Male');
          }}
        >
          <Text style={styles.buttonText}>Male</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, gender === 'Female' && styles.selectedButton]}
          onPress={() => {
            setGender('Female');
            console.log('Gender set to Female');
          }}
        >
          <Text style={styles.buttonText}>Female</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, gender === 'Unknown' && styles.selectedButton]}
          onPress={() => {
            setGender('Unknown');
            console.log('Gender set to Unknown');
          }}
        >
          <Text style={styles.buttonText}>Unknown</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Size</Text>
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[styles.button, size === 'Small' && styles.selectedButton]}
          onPress={() => {
            setSize('Small');
            console.log('Size set to Small');
          }}
        >
          <Text style={styles.buttonText}>Small</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, size === 'Medium' && styles.selectedButton]}
          onPress={() => {
            setSize('Medium');
            console.log('Size set to Medium');
          }}
        >
          <Text style={styles.buttonText}>Medium</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, size === 'Large' && styles.selectedButton]}
          onPress={() => {
            setSize('Large');
            console.log('Size set to Large');
          }}
        >
          <Text style={styles.buttonText}>Large</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  heading: {
    fontSize: 38,
    fontWeight: '700',
    marginHorizontal: 6,
    marginTop: 8,
    marginBottom: 11,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    width: '100%',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 5,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#6200ee',
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#3700b3', // Different color to indicate selection
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    marginTop: 20,
    paddingVertical: 15,
    backgroundColor: '#6200ee',
    borderRadius: 8,
    alignItems: 'center',
  },
  imageSection: {
    marginBottom: 15,
    alignItems: 'center',
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 10,
  },

  imageButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#6200ee',
    borderRadius: 8,
    alignItems: 'center',
  },
  labelsContainer: {
    marginTop: 16,
  },
  coordinatesText: {
    marginTop: 10,
    fontSize: 16,
    color: 'green',
  },
});
