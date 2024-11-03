import { StyleSheet, Button, TouchableOpacity } from 'react-native';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TabOneScreen() {
  const navigation = useNavigation();


  // const username = await AsyncStorage.getItem('username');

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Dashboard</Text>
      {/* <Text style={styles.title}>Howdy, {username}! </Text> */}
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="app/Screens/index.tsx" />
      {/* Section 1: View Previously Posted Pets */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>View Previously Posted Pets</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ViewPets' as never)}>
          <Text style={styles.buttonText}>View Pets</Text>
        </TouchableOpacity>
      </View>

      {/* Section 2: Post New Pet for Adoption */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Post a New Pet for Adoption</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('PostNewPet' as never)}>
          <Text style={styles.buttonText}>Post a Pet</Text>
        </TouchableOpacity>
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20, 
    paddingVertical: 10, 
    height: '100%'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  heading: {
    fontSize: 38,
    fontWeight: '700',
    marginHorizontal: 6,
    marginTop: 8,
    marginBottom: 11
  },
  section: {
    marginVertical: 20,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#f5f5f5', // Customize this color as needed
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  button: {
    paddingVertical: 10,
    backgroundColor: '#6200ee', // Customize button color as needed
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
