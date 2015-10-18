//People = new Meteor.Collection('people');

App = React.createClass({
  mixins: [ReactMeteorData],

  getInitialState: function() {
    return {
      searchQuery: "",
      addingEncounter: false
    };
  },

  getMeteorData: function() {
    var handle = Meteor.subscribe("people");

    return {
      loaded: handle.ready(),
      people: People.find(this.searchForPeopleSelector()).fetch()
    }
  },

  searchForPeopleSelector: function(){
    var peopleRegex = {
      $or: [
        { full_name: this.state.searchQuery ? new RegExp(this.state.searchQuery, 'gi') : { $exists: true } }
      ]
    };
    return peopleRegex;
  },

  searchAndFilter: function(event){
    var searchQuery = event.target.value;
    this.setState({ searchQuery: searchQuery });
  },

  addEncounter: function(){
    this.setState({ addingEncounter: true });
    $('#addEncounterModel').modal('show')
  },

  render: function() {
    if (!this.data.loaded) {
      return <LoadingSpinner />;
    }

    return (
      <div className={this.state.addingEncounter ? 'visible' : 'hidden'}>
        <div id="addEncounterModel" className="ui modal">
          <div className="header">Header</div>
          <div className="content">
            <form className="ui form">
              <div className="field">
                <label>First Name</label>
                <input type="text" name="first-name" placeholder="First Name"/>
              </div>
              <div className="field">
                <label>Last Name</label>
                <input type="text" name="last-name" placeholder="Last Name"/>
              </div>
              <div className="field">
                <div className="ui checkbox">
                  <input type="checkbox" tabindex="0" className="hidden"/>
                  <label>I agree to the Terms and Conditions</label>
                </div>
              </div>
              <button className="ui button" type="submit">Submit</button>
            </form>
          </div>
        </div>

        <nav className="ui stackable menu">
          <div className="item" id="first-menu-item">
            <strong style={{ fontFamily: "'Unica One', cursive" }}>encountr</strong>
          </div>
          <div className="ui category search item">
            <div className="ui transparent icon input">
              <input className="prompt" type="text" placeholder="name, dates, location, groups"  onChange={ this.searchAndFilter }/>
              <i className="search link icon"></i>
            </div>
          </div>
          <div className="right item">
            <div className="ui positive icon circular button" onClick={this.addEncounter}><i className="plus icon"></i></div>
          </div>
        </nav>

        <span>{'' + this.data.people.length == 0 ? "No results" : '' }</span>

        <div className="ui three column doubling grid padded cards">
            { this.data.people.map(function(person, i) {
                return (<Person key={i} {...person}/>);
              }) }
          </div>
      </div>
    );
  }
});


var Person = React.createClass({
  getInitialState: function(){
    return { askToDelete: false };
  },

  askToDelete: function(){
    this.setState({ askToDelete: true });
  },

  edit: function(){
    this.setState({ askToDelete: false });
  },

  delete: function(){
    People.remove(this.props._id);
    this.setState({ askToDelete: false });
  },

  renderControls: function(){
    return (
      <div className="extra center content">
      <div className="ui two buttons">
        <div className="ui green button" onClick={this.edit}>Approve</div>
        <div className="ui red button" onClick={this.delete}>Decline</div>
      </div>
      </div>);
  },

  render: function() {
    return (
      <Dimmable className="card" dimmed={this.state.askToDelete} controls={this.renderControls()}>
      
        <div className="image">
          <img src="/images/avatar2/large/molly.png" />
        </div>

        <div className="content">
          <div className="header">{this.props.full_name}</div>
          <div className="meta">
            <span className="date">{this.props.shortDesc || ""}</span>
          </div>
          <div className="description">
            {this.props.squads.join(", ")}
          </div>
        </div>

        <footer className="extra content">
          <span className="right floated">
                {this.props.whereareyoufrom}
              </span>
          <span>
                <i className="user icon"></i>
                35 Friends
                <button onClick={this.askToDelete}>delete</button>
              </span>
        </footer>
      
      </Dimmable>
      );
  }
});

Dimmable = React.createClass({
  render: function(){
    var whenDimmed = "ui blurring dimmable dimmed";
    var whenNotDimmed = "ui blurring dimmable";

    return (<div className={(this.props.dimmed ? whenDimmed : whenNotDimmed) + " " + this.props.className }>
      <div style={{ transition: 'background-color .5s linear' }}className={"ui inverted dimmer transition" + (this.props.dimmed ? "visible active" : "hidden")}>
        {this.props.controls}
      </div>
      {this.props.children}
    </div>);
  }
});

LoadingSpinner = React.createClass({
  render: function(){
    return (<div className="ui segment">
      <div className="ui active inverted dimmer">
        <div className="ui text loader">Loading</div>
      </div>
      <p></p>
    </div>);
  }
});