
import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  Button
} from "react-native";
import * as SMS from 'expo-sms';
import MapView, {
  Marker,
  AnimatedRegion,
  Polyline,
  PROVIDER_GOOGLE
} from "react-native-maps";
import haversine from "haversine";
import GetLocation from 'react-native-get-location'
import Messenger from './WhatsAppMessenger';
import WhatsAppMessenger from "./WhatsAppMessenger";
// const LATITUDE = 29.95539;
// const LONGITUDE = 78.07513;
const LATITUDE_DELTA = 0.009;
const LONGITUDE_DELTA = 0.009;


class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      location : {},
      loading: false,
      latitude: '',
      longitude: '',
      routeCoordinates: [],
      distanceTravelled: 0,
      alertClicked : false,
      prevLatLng: {},
      coordinate: new AnimatedRegion({
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0,
        longitudeDelta: 0,
        location: null
      }), initialPosition: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0,
        longitudeDelta: 0,
      }
    };
   // this.sendSms = this.sendSms.bind(this);
  }

  _requestLocation = () => {
    this.setState({ loading: true, location: null });
    navigator.geolocation.getCurrentPosition(
      (position) => this.setState({location:position}),
      (err) => console.log(err),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 10000 }
    );
        
}

 async _sendSms(){
      console.log("Alert");
      const loc = _requestLocation;
      const contacts = ['0671791758', '0730241920'] ;
      const isAvailable = SMS.isAvailableAsync();
      const msg = 'Hi I am in trouble, please help me. I am at '+ loc ;
     
      if (isAvailable) {
            // do your SMS stuff here
            console.log("sms is available");
            var smsRes = await SMS.sendSMSAsync(
              contacts,
              msg
            );

            if(smsRes.result.status == '200'){
                //send via whatsapp
                WhatsAppMessenger(contacts,msg);
            }else{
              //display could not inform your friends
            }
      } else {
            // misfortune... there's no SMS available on this device
            console.log("sms is not available");
      }
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition((position) => {
      var lat = parseFloat(position.coords.latitude)
      var long = parseFloat(position.coords.longitude)
      var initialRegion = {
        latitude: lat,
        longitude: long,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }

      this.setState({ initialPosition: initialRegion })
    },
      (error) => alert(JSON.stringify(error)),
      { enableHighAccuracy: true, timeout: 20000, timeout: 20000 });
    const { coordinate } = this.state;
    this.watchID = navigator.geolocation.watchPosition(
      position => {
        const { routeCoordinates, distanceTravelled } = this.state;
        const { latitude, longitude } = position.coords;

        const newCoordinate = {
          latitude,
          longitude
        };

        if (Platform.OS === "android") {
          
          if (this.marker) {
            // this.marker._component.animateMarkerToCoordinate(
            //   newCoordinate,
            //   500
            // );
          }
        } else {
          coordinate.timing(newCoordinate).star
          t();
        }

        this.setState({
          latitude,
          longitude,
          routeCoordinates: routeCoordinates.concat([newCoordinate]),
          distanceTravelled:
            distanceTravelled + this.calcDistance(newCoordinate),
          prevLatLng: newCoordinate
        });
      },
      error => console.log(error),
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
        distanceFilter: 10
      }
    );
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
    this._requestLocation();
  }

  getMapRegion = () => ({
    latitude: this.state.initialPosition.latitude,
    longitude: this.state.initialPosition.longitude,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA
  });

  calcDistance = newLatLng => {
    const { prevLatLng } = this.state;
    return haversine(prevLatLng, newLatLng) || 0;
  };

  render() {
    return (
      <View style={styles.container} id="HomeMapId">
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          showUserLocation
          followUserLocation
          loadingEnabled
          region={this.getMapRegion()}
        >
          <Polyline coordinates={this.state.routeCoordinates} strokeWidth={5} />
          <Marker.Animated
            ref={marker => {
              this.marker = marker;
            }}
            coordinate={this.state.coordinate}
          />
        </MapView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.bubble, styles.button]}>
            <Text style={styles.bottomBarContent}>
              {parseFloat(this.state.distanceTravelled).toFixed(2)} km
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.containerButtonAlertFriends}>
          <View style={styles.buttonContainerFriends}>
            <Button color='red' 
            title="Alert" 
            textStyle={{ color: "#FFFFFF" }}
            onPress={() => this._sendSms()}
             />
          </View>
          <View style={styles.buttonContainerAlert}>
            <Button color='#bada55' title="Friends(0)" onPress={() =>
              this.props.navigation.navigate('ListItem')
            } />
          </View>
        </View>
       
    <View>

    </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  bubble: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.7)",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20
  },
  latlng: {
    width: 200,
    alignItems: "stretch"
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: "center",
    marginHorizontal: 10
  },
  buttonContainer: {
    flexDirection: "row",
    marginVertical: 20,
    backgroundColor: "transparent"
  },
  containerButtonAlertFriends: {
    paddingTop: 450,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonContainerFriends: {
    flex: 1
  }
  , buttonContainerAlert: {
    flex: 1,
    backgroundColor: 'red'
  }
});


export default Home;
