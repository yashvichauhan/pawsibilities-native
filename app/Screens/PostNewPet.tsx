import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Button, View, Text, Alert, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PostNewPet() {
  const navigation = useNavigation();

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

  const handleSubmit = async () => {
    try {
      const owner = await AsyncStorage.getItem('userID');
      console.log('Owner ID:',owner);

      if (!owner) {
        Alert.alert('Error', 'User ID not found. Please log in.');
        return;
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
  
      const response = await fetch('https://pawsibilities-api.onrender.com/api/pets', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
  
      if (response.ok) {
        Alert.alert('Success', 'Pet posted successfully');
        navigation.goBack();
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

      <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Species" value={species} onChangeText={setSpecies} />
      <TextInput style={styles.input} placeholder="Breed" value={breed} onChangeText={setBreed} />
      <TextInput style={styles.input} placeholder="Age" value={age} onChangeText={setAge} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Color" value={color} onChangeText={setColor} />
      <TextInput style={styles.input} placeholder="Description" value={description} onChangeText={setDescription} />

      {/* Image Picker Section */}
      <View style={styles.imageSection}>
        <Button title="Select Image" onPress={handleSelectImage} />
        {imageUri && <Image source={{ uri: imageUri }} style={styles.imagePreview} />}
      </View>

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
});
