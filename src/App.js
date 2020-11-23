import React, { Component } from 'react';
import Particles from 'react-tsparticles';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import './App.css';

const particlesOptions = {
  fpsLimit: 60,
  interactivity: {
    detectsOn: "window",
    events: {
      onClick: {
        enable: true,
        mode: "push",
      },
      onHover: {
        enable: true,
        mode: "repulse",
      },
      resize: true,
    },
    modes: {
      bubble: {
        distance: 400,
        duration: 2,
        opacity: 0.8,
        size: 40,
      },
      push: {quantity: 4,},
      repulse: {
        distance: 200,
        duration: 0.4,
      },
    },
  },
  particles: {color: {value: "#ffffff",},
    links: {
      color: "#ffffff",
      distance: 150,
      enable: true,
      opacity: 0.5,
      width: 1,
    },
    collisions: {enable: true,},
    move: {
      direction: "none",
      enable: true,
      outMode: "bounce",
      random: false,
      speed: 6,
      straight: false,
    },
    number: {
      density: {
        enable: true,
        value_area: 800,
      },
      value: 60,
    },
    opacity: {value: 0.5,},
    shape: {type: "circle",},
    size: {
      random: true,
      value: 5,
    },
  },
  detectRetina: true,
}

const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data => {
    const { id, name, email, entries, joined } = data;
    this.setState({user: {
      id: id,
      name: name,
      email: email,
      entries: entries,
      joined: joined
    }});
  });

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = async () => {
    this.setState({imageUrl: this.state.input});
    try {
      const responsePost = await fetch('https://powerful-lowlands-92139.herokuapp.com/imageurl', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          input: this.state.input
        })
      });
      const response = await responsePost.json();
      if (response) {
        try {
          const responsePut = await fetch('https://powerful-lowlands-92139.herokuapp.com/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          });
          const count = await responsePut.json();
          this.setState(Object.assign(this.state.user, { entries: count}))
        } catch (err) {
          console.log('Small block err', err);
        }
      }
      this.displayFaceBox(this.calculateFaceLocation(response))
    } catch(err) {
      console.log('Big block err', err);
    }
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState)
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route});
  }

  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
    const { name, entries } = this.state.user;
    return (
      <div className="App">
        <Particles className='particles'
              params={particlesOptions}
          />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        {
          route === 'home' 
          ? <>
              <Logo />
              <Rank name={name} entries={entries} />
              <ImageLinkForm 
                onInputChange={this.onInputChange} 
                onButtonSubmit={this.onButtonSubmit}
              />
              <FaceRecognition box={box} imageUrl={imageUrl} />
            </>
            : (
                route === 'signin' 
                ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
                : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
              )     
        }
      </div>
    );
  }
}

export default App;