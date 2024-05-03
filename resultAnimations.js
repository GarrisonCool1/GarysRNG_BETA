// This script is not for use yet.
// I will add in a later update!





function stopParticles() {
  document.getElementById('particles-js').innerHTML = ''; // Clear the particles container
}


function createParticles(rarity) {
  console.log(rarity)
  if (rarity === "Divine") {
    particlesJS('particles-js', {
      "particles": {
        "number": {
          "value": 30,
          "density": {
            "enable": true,
            "value_area": 800
          }
        },
        "color": {
          "value": "#ADD8E6"
        },
        "shape": {
          "type": "circle",
          "stroke": {
            "width": 0,
            "color": "#ADD8E6"
          },
          "polygon": {
            "nb_sides": 5
          }
        },
        "size": {
          "value": 5,
          "random": true,
          "anim": {
            "enable": false,
            "speed": 40,
            "size_min": 0.1,
            "sync": false
          }
        },
        "line_linked": {
          "enable": false
        },
        "move": {
          "enable": true,
          "speed": 3,
          "direction": "bottom",
          "random": false,
          "straight": true,
          "out_mode": "out",
          "bounce": false
        }
      },
      "interactivity": {
        "events": {
          "onhover": {
            "enable": false,
            "mode": "repulse"
          }
        },
        "modes": {
          "repulse": {
            "distance": 100,
            "duration": 0.4
          }
        }
      }
    });
  }//Divine end

  else if (rarity === "Celestial") {
    particlesJS('particles-js', {
      "particles": {
        "number": {
          "value": 400,
          "density": {
            "enable": true,
            "value_area": 800
          }
        },
        "color": {
          "value": "#ffffff"
        },
        "shape": {
          "type": "circle",
          "stroke": {
            "width": 0,
            "color": "#ffffff"
          },
          "polygon": {
            "nb_sides": 5
          }
        },
        "size": {
          "value": 5,
          "random": true,
          "anim": {
            "enable": false,
            "speed": 40,
            "size_min": 0.1,
            "sync": false
          }
        },
        "line_linked": {
          "enable": false
        },
        "move": {
          "enable": true,
          "speed": 3,
          "direction": "bottom",
          "random": false,
          "straight": true,
          "out_mode": "out",
        }
      },
      "interactivity": {
        "events": {
          "onhover": {
            "enable": false,
            "mode": "repulse"
          }
        },
        "modes": {
          "repulse": {
            "distance": 100,
            "duration": 0.4
          }
        }
      }
    });
  }//Celestial end
    
  else if (rarity === "Jackpot") {
    particlesJS('particles-js', {
      "particles": {
        "number": {
          "value": 300,
          "density": {
            "enable": true,
            "value_area": 800
          }
        },
        "color": {
          "value": "#7cfc00"
        },
        "shape": {
          "type": "star",
          "stroke": {
            "width": 0,
            "color": "#7cfc00"
          },
          "polygon": {
            "nb_sides": 5
          }
        },
        "size": {
          "value": 5,
          "random": true,
          "anim": {
            "enable": false,
            "speed": 40,
            "size_min": 0.1,
            "sync": false
          }
        },
        "rotate": {
          "value": 360,
          "random": true,
          "direction": "clockwise",
          "speed": 6
        },
        "line_linked": {
          "enable": false
        },
        "move": {
          "enable": true,
          "speed": 3,
          "direction": "bottom",
          "random": true,
          "straight": false,
          "out_mode": "out",
        }
      },
      "interactivity": {
        "events": {
          "onhover": {
            "enable": false,
            "mode": "repulse"
          }
        },
        "modes": {
          "repulse": {
            "distance": 100,
            "duration": 0.4
          }
        } 
      }
    });
  }//Jackpot end
    
  else if (rarity === "True Luck") {
    particlesJS('particles-js', {
      "particles": {
        "number": {
          "value": 150,
          "density": {
            "enable": true,
            "value_area": 800
          }
        },
        "color": {
          "value": "#008B8B"
        },
        "shape": {
          "type": "circle",
          "polygon": {
            "nb_sides": 5
          }
        },
        "size": {
          "value": 20,
          "random": true,
          "anim": {
            "enable": false,
            "speed": 40,
            "size_min": 2,
            "sync": false
          }
        },
        "line_linked": {
          "enable": false
        },
        "move": {
          "enable": true,
          "speed": 3,
          "direction": "bottom",
          "random": true,
          "straight": false,
          "out_mode": "out",
        }
      },
      "interactivity": {
        "events": {
          "onhover": {
            "enable": false,
            "mode": "repulse"
          }
        },
        "modes": {
          "repulse": {
            "distance": 100,
            "duration": 0.4
          }
        }
      }
    });
  }//True Luck end

















}//function end