People = new Meteor.Collection('people');

Person = class Person {

  constructor(props)
  {
    defaults = {
      _id: Random.id(),
      full_name: "",
      whereareyoufrom: "Sydney, Australia",
      whereareyoufrom_lat: -33.865143,
      whereareyoufrom_lng: 151.209900,

      displaypic: "",

      whenWeMet: new Date(),

      profile_linkedin: "",
      profile_facebook: "",
      profile_twitter: "",
      profile_number: "",
      profile_email: "",

      squads: ["Everyone"],

      catchups: []
    };
    props = $.extend({}, defaults, props);

    with(props) {
      this._id = _id
      this.full_name = full_name
      this.whereareyoufrom = whereareyoufrom
      this.whereareyoufrom_lat = whereareyoufrom_lat
      this.whereareyoufrom_lng = whereareyoufrom_lng

      this.displaypic = displaypic // base64 encoded

      this.profile_linkedin = profile_linkedin
      this.profile_facebook = profile_facebook
      this.profile_twitter = profile_twitter
      this.profile_number = profile_number
      this.profile_email = profile_email

      this.squads = ["Everyone"]

      this.catchups = catchups;
    }
  }

  static create() {
    arguments._id = null;
    return new Person(...arguments);
  }

  save() {
    People.upsert({ _id: this._id }, { $set: {
      full_name: this.full_name,
      whereareyoufrom: this.whereareyoufrom,
      whereareyoufrom_lat: this.whereareyoufrom_lat,
      whereareyoufrom_lng: this.whereareyoufrom_lng,

      displaypic: this.displaypic,
      
      profile_linkedin: this.profile_linkedin,
      profile_facebook: this.profile_facebook,
      profile_twitter: this.profile_twitter,
      profile_number: this.profile_number,
      profile_email: this.profile_email,

      squads: this.squads,

      catchups: this.catchups
    }});
  }

  static load(_id) {
    return new Person(People.findOne({ _id: _id }));
  }

  first_name() {
    return this.full_name.split(' ')[0];
  }

  last_name() {
    return this.full_name.split(' ')[1];
  }
}

if (Meteor.isClient) {
  //var garry = new Person({full_name: 'Garry Visontay', profile_number: '0403330688', profile_email: 'garry@sydneyseedfund.com.au', squads: ["Project Pitch 2015", "Investors", "Sydney"]});
  //garry.save();

  Meteor.startup(function () {
    // Use Meteor.startup to render the component after the page is ready
    React.render(<App />, document.getElementById("app"));
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    Meteor.publish("people", function () {
      return People.find({});
    });
  });
}
