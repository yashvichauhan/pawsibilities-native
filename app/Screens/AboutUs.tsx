// AboutUs.tsx
import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';

export default function AboutUs() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('../../assets/images/Pawsibilities_logo.jpg')} style={styles.logo} />
      
      <Text style={styles.heading}>About Us</Text>
      <Text style={styles.description}>
        Pawsibilities is a platform aimed at connecting pet owners looking to surrender their pets with potential adopters. This project was initiated to address the growing issue of abandoned pets, which is becoming a burden for animal shelters. Our goal is to provide a seamless and secure platform that facilitates this connection and collaborates with pet shops to generate revenue.
      </Text>
      <Text style={styles.description}>
        The primary objective of Pawsibilities is to reduce the number of abandoned pets by 20%, while ensuring their safety during adoption. By introducing innovative and high-tech solutions, we aim to enhance user experience and improve the efficiency of adopter verification, making our platform both functional and attractive.
      </Text>

      <Text style={styles.heading}>Privacy Policy</Text>
      <Text style={styles.description}>
        At Pawsibilities, we are committed to protecting the privacy and personal information of our users. We collect only the data necessary to provide our services, such as basic contact information and pet adoption preferences. We do not share or sell user data to third parties without explicit consent.
      </Text>
      <Text style={styles.description}>
        User data is stored securely, and we use industry-standard encryption to safeguard all sensitive information. Our platform also complies with all applicable data protection regulations to ensure your information remains confidential.
      </Text>
      <Text style={styles.description}>
        By using Pawsibilities, you consent to our privacy practices and agree to our terms of service. We encourage you to contact us if you have any questions or concerns regarding our privacy policy.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  logo: {
    width: 100,   // Adjust the width
    height: 100,  // Adjust the height
    marginBottom: 20,
    resizeMode: 'contain',
  },
  heading: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 15,
    textAlign: 'center',  // Optional for alignment
  },
});
