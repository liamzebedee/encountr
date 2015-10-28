const ENCOUNTR = {
  version: "0.0.0"
};

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

      catchups: [],

      notes: []
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

      this.squads = props.squads

      this.catchups = catchups;
      this.notes = notes;
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

      catchups: this.catchups,

      notes: this.notes
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

  generate_blurb(){
    var info = {};
    if(this.profile_email) {
      info.domain = this.profile_email.split('@')[1];
    }
    return info;
  }
}

if (Meteor.isClient) {
  Meteor.startup(function () {

// RouteHandler = ReactRouter.RouteHandler;


App = React.createClass({
  render: function() {
    return (
      <div>
        <div className="container">
          <div className="ui page">
          <div className="column">
              <Dashboard/>
          </div>
          </div>
        </div>
      </div>
    );
  }
});


      
// Route = ReactRouter.Route;
// DefaultRoute = ReactRouter.DefaultRoute;

// var routes = (
//   <Route handler={App} path="/">
//     <Route name="dashboard" path="dashboard" handler={Dashboard}/>
//     <Route name="login" path="login" handler={Login} />
//     <DefaultRoute handler={Login} />
//   </Route>
// );


// ReactRouter.run(routes, function (Handler) {
//   React.render(<Handler/>, document.getElementById("app"));
// });

React.render((
  <App/>  
), document.getElementById("app"));

    // backupOrDumpDataToJSON = function(){
    //   var backup = {
    //     version: ENCOUNTR.version
    //   };
    //   backup.People = JSON.stringify(People);
    //   console.log(backup);
    // };
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    Meteor.publish("people", function () {
      return People.find({});
    });
  });
}
