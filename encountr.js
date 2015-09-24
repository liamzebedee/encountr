var people = new Meteor.Collection('people');

class Person {
  constructor() {
    var defaults = {
      id: null,
      full_name: "",
      whereareyoufrom: "Sydney, Australia",
      whereareyoufrom_lat: -33.865143,
      whereareyoufrom_lng: 151.209900,

      displaypic: "", // base64 encoded

      profile_linkedin: "",
      profile_facebook: "",
      profile_twitter: "",
      profile_number: "",

      squads: ["Everyone"],

      catchups: [new Date]
    };
  }

  first_name() {
    return full_name.split(' ')[0];
  }

  last_name() {
    return full_name.split(' ')[1];
  }

}

if (Meteor.isClient) {
  
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
