import * as AuthSession from 'expo-auth-session';
import jwtDecode from 'jwt-decode';
import * as React from 'react';
import { Alert, Button, Platform, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './App/components/Home';
import Friends from './App/components/Friends';
import ListItem from './App/components/ListItem';
import Avatar from './App/components/Avatar';
import SearchBar from './App/components/SearchBar';
const Stack = createStackNavigator();

// You need to swap out the Auth0 client id and domain with the one from your Auth0 client.
// In your Auth0 client, you need to also add a url to your authorized redirect urls.
//
// For this application, I added https://auth.expo.io/@arielweinberger/with-auth0 because I am
// signed in as the 'arielweinberger' account on Expo and the name/slug for this app is 'with-auth0'.
//
// You can open this app in the Expo client and check your logs to find out your redirect URL.

const auth0ClientId = "Rt_jRlDmb4jeayvCdmjLRHcIc8ijeXp-l1z6x6l8tOTKw2sCdOH4vCcy6BFj9pdq";
const authorizationEndpoint = "https://dev-a39g3hi3.au.auth0.com/authorize";

const useProxy = Platform.select({ web: false, default: true });
const redirectUri = AuthSession.makeRedirectUri({ useProxy });

export default function App() {
  const [name, setName] = React.useState(null);

  const [request, result, promptAsync] = AuthSession.useAuthRequest(
    {
      redirectUri,
      clientId: auth0ClientId,
      // id_token will return a JWT token
      responseType: 'id_token',
      // retrieve the user's profile
      scopes: ['openid', 'profile'],
      extraParams: {
        // ideally, this will be a random value
        nonce: 'nonce',
      },
    },
    { authorizationEndpoint }
  );

  // Retrieve the redirect URL, add this to the callback URL list
  // of your Auth0 application.
  console.log(`Redirect URL: ${redirectUri}`);

  React.useEffect(() => {
    if (result) {
      if (result.error) {
        Alert.alert(
          'Authentication error',
          result.params.error_description || 'something went wrong'
        );
        return;
      }
      if (result.type === 'success') {
        // Retrieve the JWT token and decode it
        const jwtToken = result.params.id_token;
        const decoded = jwtDecode(jwtToken);

        const { name } = decoded;
        setName(name);
      }
    }
  }, [result]);

  return (
    <NavigationContainer>
        <Stack.Navigator>
        <Stack.Screen
            name="Home"
            component={Home}
          />
          <Stack.Screen
            name="Friends"
            component={Friends}
          />
          <Stack.Screen
            name="ListItem"
            component={ListItem}
          />
           <Stack.Screen
            name="Avatar"
            component={Avatar}
          />
           <Stack.Screen
            name="SearchBar"
            component={SearchBar}
          />
          
        </Stack.Navigator>
      </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 40,
  },
});
