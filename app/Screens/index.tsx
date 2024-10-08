import { StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Dashboard</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="app/Screens/index.tsx" />
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
});
