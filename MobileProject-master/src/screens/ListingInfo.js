import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions
} from "react-native";
import { Constants } from "expo";
import { Header, Icon, ListItem } from "react-native-elements";
import * as firebase from "firebase";
import MapView from "react-native-maps";
import {GetNotification, PostNotification} from './Notifications';
var height = Dimensions.get("window").height;
var width = Dimensions.get("window").width;

export default class ListingInfo extends React.Component {
  constructor(props) {
    super(props);
    const listing = this.props.navigation.getParam("listing");
    this.state = {
      list: [
        {
          name: "Title",
          leftIcon: { name: "title", color: "fff", type: "material" },
          subtitle: listing.title
        },
        {
          name: "Address",
          leftIcon: { name: "address", color: "fff", type: "entypo" },
          subtitle: listing.address
        },
        {
          name: "Sale/Rent",
          leftIcon: { name: "home", color: "fff", type: "entypo" },
          subtitle: listing.type
        },
        {
          name: "Price",
          leftIcon: { name: "attach-money", color: "fff", type: "material" },
          subtitle: listing.price
        },
        {
          name: "Bedrooms",
          leftIcon: { name: "bed", color: "fff", type: "font-awesome" },
          subtitle: listing.bedrooms
        },
        {
          name: "Bathrooms",
          leftIcon: { name: "bath", color: "fff", type: "font-awesome" },
          subtitle: listing.bathrooms
        }
      ],
      leaseruid: listing.uid,
      currentuid: firebase.auth().currentUser.uid,
      key: listing.key,
      favorite_by: listing.favorite_by,
      title: listing.title
    };
    console.log("favourite info:",this.state.favorite_by)
    console.log(
      "compare value: ",
      this.state.currentuid.localeCompare(this.state.leaseruid)
    );
    console.log("leaseruid: ", this.state.leaseruid);
    console.log("currentuid: ", this.state.currentuid);
  }

  _delete = key => {
    if(this.state.favorite_by!=undefined){
      favorite_persons = Object.keys(this.state.favorite_by);
      console.log("Info in favorite_persons:", favorite_persons)
      for (i = 0; i < favorite_persons.length; i++){
        console.log("uid?: ",favorite_persons[i])
        PostNotification(favorite_persons[i],`Your favorite list '${this.state.title}' has been deleted by the Owner.`);
      }
    }
    firebase
      .database()
      .ref("listings")
      .child("" + key)
      .remove()
      .then(
        this.props.navigation.navigate("Main")
      )
      .catch(error => console.log(error));
  };

  componentDidMount() {
    var address = this.props.navigation
      .getParam("listing")
      .address.split(" ")
      .join("+");
    var url =
      "https://maps.googleapis.com/maps/api/geocode/json?address=" +
      address +
      "&key=AIzaSyCmWHiB6lswkIG4nGhEpVlt4rubIn1h7uo";
    return fetch(url)
      .then(res => res.json())
      .then(res => {
        console.log(res.results[0].geometry.location);
        var location = res.results[0].geometry.location;
        this.setState({
          geoLoco: { lat: location.lat, long: location.lng },
          coordReady: true
        });
      })
      .catch(error => {
        alert(error);
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <View>
          <Header
            containerStyle={{
              backgroundColor: "#fff"
            }}
            centerComponent={{
              text: "More Info",
              style: { color: "#3498db", fontWeight: "bold", fontSize: 18 }
            }}
            leftComponent={
              <Icon
                name="md-arrow-back"
                type="ionicon"
                color="#3498db"
                onPress={() => this.props.navigation.pop()}
                underlayColor={"#64b5f6"}
              />
            }
            rightComponent={
              this.state.currentuid.localeCompare(this.state.leaseruid) == 0 ? (
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate("EditListing", {
                      key: this.state.key
                    })
                  }
                  transparent
                  style={{ backgroundColor: "transparent" }}
                >
                  <Text style={{ textAlign: "center", color: "#3498db" }}>
                    {" "}
                    Edit{" "}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate("MessageBox", {
                      leaseruid: this.state.leaseruid,
                    })
                  }
                  transparent
                  style={{ backgroundColor: "transparent" }}
                >
                  <Text style={{ textAlign: "center", color: "#3498db" }}>
                    {" "}
                    Message{" "}
                  </Text>
                </TouchableOpacity>
              )
            }
          />
        </View>
        <ScrollView
          onScroll={this.handleScroll}
          style={{ marginTop: 15, marginBottom: 15 }}
        >
          {this.state.coordReady ? (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: this.state.geoLoco.lat,
                longitude: this.state.geoLoco.long,
                longitudeDelta: 10,
                latitudeDelta: 10
              }}
              onMapReady={() => {
                this.setState({ mapReady: true });
              }}
            >
              {this.state.mapReady ? (
                <MapView.Marker
                  coordinate={{
                    latitude: this.state.geoLoco.lat,
                    longitude: this.state.geoLoco.long
                  }}
                />
              ) : null}
            </MapView>
          ) : null}
          <View style={{ marginTop: height * 0.52 }}>
            {this.state.list.map((u, i) => {
              if (this.state.list.length != 0) {
                console.log("key value of the info",{i})
                return (
                  <ListItem
                    topDivider={true}
                    bottomDivider={true}
                    style={{ paddingBottom: 2 }}
                    leftIcon={u.leftIcon}
                    key={i}
                    title={u.name}
                    subtitle={u.subtitle}
                  />
                );
              }
            })}
          </View>
          {this.state.currentuid.localeCompare(this.state.leaseruid) == 0 && (
            <TouchableOpacity
              onPress={() => this._delete(this.state.key)}
              transparent
              style={[styles.buttonContainer, { backgroundColor: "#2980b9" }]}
            >
              <Text style={{ textAlign: "center", color: "#FF0000" }}>
                {" "}
                Delete{" "}
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3498db",
    justifyContent: "center",
    paddingTop: Constants.statusBarHeight
  },
  topMenu: {
    backgroundColor: "rgba(255,255,255,0.2)"
  },
  errors: {
    backgroundColor: "#FF0000",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    width: width * 0.8,
    padding: 5,
    marginTop: 10,
    color: "#fff",
    height: height * 0.05,
    marginBottom: height * 0.01
  },
  buttonContainer: {
    backgroundColor: "#2980b9",
    paddingVertical: 15
  },
  buttonText: {
    textAlign: "center",
    color: "#FFFFFF"
  },
  map: {
    position: "absolute",
    height: height * 0.5,
    width: width,
    flex: 1
  }
});
