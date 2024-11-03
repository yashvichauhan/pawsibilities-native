import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function Favorites() {
  return (
    <View style={styles.container}>
      <FontAwesome name="heart" size={64} color="#FF6F61" style={styles.icon} />
      <Text style={styles.heading}>Favorites</Text>
      <Text style={styles.message}>Coming Soon!</Text>
      <Image
        source={{
          uri: 'https://m.media-amazon.com/images/I/518YhOo6OWL._AC_UF894,1000_QL80_.jpg',
        }}
        style={styles.image}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  icon: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  message: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
    resizeMode: 'contain',
  },
});
