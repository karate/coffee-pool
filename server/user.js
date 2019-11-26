const availableAnimals = [
  {name: 'mouse', icon: '🐭'},
  {name: 'mouse', icon: '🐹'},
  {name: 'cow', icon: '🐮'},
  {name: 'tiger', icon: '🐯'},
  {name: 'cat', icon: '🐱'},
  {name: 'rabbit', icon: '🐰'},
  {name: 'pig', icon: '🐷'},
  {name: 'dog', icon: '🐶'},
  {name: 'wolf', icon: '🐺'},
  {name: 'bear', icon: '🐻'},
  {name: 'koala', icon: '🐨'},
  {name: 'panda', icon: '🐼'},
  {name: 'monkey', icon: '🐵'},
  {name: 'frog', icon: '🐸'},
  {name: 'fox', icon: '🦊'},
  {name: 'gorilla', icon: '🦍'}
];

const availableAdjectives = [
  'fast', 'slow', 'big', 'small', 'smart', 'dumb', 'selfish', 'playfull', 'happy', 'sad'
];

module.exports = class User {
  constructor (name, icon) {
    if (!name || !icon) {
      var animal = this.getRandomAnimal()
      var adjective = this.getRandomAdjective();
      this.name = adjective + ' ' + animal.name;
      this.icon = animal.icon;
    }
    else {
      this.name = name;
      this.icon = icon;
    }
  }

  // Select a random emoji from the list
  getRandomAnimal() {
    // Select random emoji
    var randomIndex = Math.floor(Math.random() * availableAnimals.length);
    var animal = availableAnimals[randomIndex];
    // If there are more emojis left, remove current to prevent it from
    // beeing selected again. Otherwise we leave it there.
    if (availableAnimals.length > 1) {
      availableAnimals.splice(randomIndex, 1);
    }
    return animal;
  }

  getRandomAdjective() {
    var randomIndex = Math.floor(Math.random() * availableAdjectives.length);
    return availableAdjectives[randomIndex];
  }
}

//export default User;
