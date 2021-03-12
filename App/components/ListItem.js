import React, { useEffect, useState } from 'react';
import * as Contacts from 'expo-contacts';
import { SectionList, StyleSheet, View, Text, FlatList } from 'react-native'
import Avatar from '../components/Avatar';
import Messenger from '../components/WhatsAppMessenger';
export default function ListItem() {
  const [contacts, setContacts] = useState([])
  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts({
          fields: [Contacts.Fields.PhoneNumbers],
        });

        if (data.length > 0) {
          setContacts(data)
        }
      }
    })();
  }, []);



  return (
    <View style={styles.container}>
      <FlatList
        data={contacts}
        renderItem={({ item }) => {
          return (
           <View style={{ minHeight: 70, padding: 5,borderColor: 'black',
           borderWidth: 2 }} >
      <Text style={{ color: '#bada55', fontWeight: 'bold', fontSize: 26 }}>
        {item.firstName + ' '}
        {item.lastName}
      </Text>
      <Text style={{ color: 'black', fontWeight: 'bold' }}>
      {`${item.phoneNumbers ? item.phoneNumbers[0].number : ''}`}
      </Text>
    </View>
          )
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
   
  },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'rgba(247,247,247,1.0)',
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
    backgroundColor: "grey"
  },
});
