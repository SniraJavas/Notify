export default function Messenger(cellNumber,whatsAppMessage){

  console.log("inside");
    if (cellNumber.length != 10) {
      Alert.alert('Please Enter Correct WhatsApp Number');
      return;
    }
    // Here we are using 91 which is India Country Code.
    // You can change country code.
    let URL = 'whatsapp://send?text=' +  whatsAppMessage + '&phone=27' + cellNumber;

    Linking.openURL(URL)
      .then((data) => {
        console.log('WhatsApp Opened');
      })
      .catch(() => {
        Alert.alert('Make sure Whatsapp installed on your device');
      });

}