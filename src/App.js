import React, { Component } from 'react'
import './App.css'
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import axios from 'axios'

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      search: "",
      venues: [],
      markers: [],
      filteredVenues: [],
      marker: [],
      open: false
    }
  }

  componentDidMount = () => {
    this.getVenues()
  }

  // To open and close the drawer
  toggleDrawer = () => {
    this.setState({
      open: !this.state.open,
    });
  }

  renderMap = () => {
    loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyCfyj4GhsCZ0jzkzYnNJbfTG22iK2YONI8&callback=initMap")
    window.initMap = this.initMap
  }

  // To fetch FourSquare using axios
  // Credit to Yahya Elharony https://www.youtube.com/watch?v=dAhMIF0fNpo
  getVenues = () => {
    const endPoint = "https://api.foursquare.com/v2/venues/explore?"
    const parameters = {
      client_id: "AC5USOA1IBRZ5UEEQ0EIRZ2JTVSAFCZRWYGJ0WPM0LR54KOO",
      client_secret: "TD2FQ5VOIONTZUZIMDKWJJ3UHEMHYHMTUFSV3GN1K111T55M",
      query: "thrift",
      near: "Chicago",
      v: "20180211"
    }
    axios.get(endPoint + new URLSearchParams(parameters))
      .then(response => {
        this.setState({
          venues: response.data.response.groups[0].items
        }, this.renderMap())
      })
      .catch(error => {
        console.log("ERROR!! " + error)
      })
  }

  initMap = () => {

    // Create the Map
    var map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 41.9231, lng: -87.7093},
      zoom: 11
    })

    var infowindow = new window.google.maps.InfoWindow()

    const allMarkers = [];

    this.state.venues.map(venue => {

      // Venue's name and address to display on the info window
      var name = `${venue.venue.name}`
      var address = `${venue.venue.location.address}`

      // To create a marker based on the locations of the venues
      var marker = new window.google.maps.Marker({
        position: {lat: venue.venue.location.lat , lng: venue.venue.location.lng},
        map: map,
        title: venue.venue.name,
        id: venue.venue.id,
        animation: window.google.maps.Animation.DROP
      })

      // To add functions when marker is clicked
      marker.addListener('click', function() {

        // To add animation to the clicked marker
        if (marker.getAnimation() !== null) { marker.setAnimation(null); }
        else { marker.setAnimation(window.google.maps.Animation.BOUNCE); }
        setTimeout(() => { marker.setAnimation(null) }, 1000);

        // To add venue's name and address to the info window
        infowindow.setContent('<h3>'+name+'</br></br>'+address+'</h3>')

        // To open the info window
        infowindow.open(map, marker)
      })
      allMarkers.push(marker);
      return venue;
    });
    this.setState({ markers: allMarkers });
  }


  filterFunction(search) {

    const filteredVenues = [];

    let f = this.venues.filter(venue => venue.venue.name.toLowerCase().includes(search.toLowerCase()));

        this.markers.forEach(marker => {
          marker.title.toLowerCase().includes(search.toLowerCase()) == true ?
          marker.setVisible(true) :
          marker.setVisible(false);

        });
        this.setState({ filteredVenues: f });
    }


  //To filter venues
      filterFunction = search => {

        const filteredVenues = [];

        this.state.venues.forEach(venue => {

          //To display selected markers when there's a query
          if (venue.venue.name.toLowerCase().includes(search.toLowerCase())) {

            this.state.markers.forEach(marker => {

              if (marker.title.toLowerCase().includes(search.toLowerCase())) {
                marker.setVisible(true);
                filteredVenues.push(venue);
              } else {
                marker.setVisible(false);
              }//else
            });
              this.setState({
              search: search,
              filteredVenues: filteredVenues
              });

        }

          //To display all markers when there's no query
          if (search === "") {
            this.setState({
              filteredVenues: this.state.venues
            });
            this.state.markers.forEach(marker => {
              marker.setVisible(true);
            })
          }

        })
      }

    clickListItem = (venue) => {
      this.setState({ open: !this.state.open });
      let selected = this.state.markers.find(
        marker => marker.id === venue.venue.id
      );
      window.google.maps.event.trigger(selected, 'click');
      //this.map.setCenter(marker.position);
    }

  render() {
    return (

      <main>
        <div id="map"></div>

        <div>
          <Header />
          <button
            className="menu-button"
            onClick={this.toggleDrawer}
          >
            <i className="fa fa-bars"></i>
          </button>
        </div>

        <Sidebar

          open={this.state.open}
          toggleDrawer={this.toggleDrawer} // To open and close drawer
          clickListItem={this.clickListItem}
          // venues={this.state.venues} // To display list of venues on drawer
          filterFunction = {this.filterFunction}
          filteredVenues={this.filteredVenues}
          {...this.state}
        />

      </main>
    )
  }
}

// To display map without external dependency
// Credit to Yahya Elharony https://www.youtube.com/watch?v=W5LhLZqj76s
function loadScript(url) {
  var index  = window.document.getElementsByTagName("script")[0]
  var script = window.document.createElement("script")
  script.src = url
  script.async = true
  script.defer = true
  index.parentNode.insertBefore(script, index)
}

export default App;
