//People = new Meteor.Collection('people');
CSSTransitionGroup = React.addons.CSSTransitionGroup;

App = React.createClass({
  mixins: [ReactMeteorData],

  getInitialState: function() {
    return {
      searchQuery: "",
      squadsSearchQuery: new Set(['Everyone']),
      addingEncounter: false,
      editingEncounter: false
    };
  },

  getMeteorData: function() {
    var handle = Meteor.subscribe("people");

    var searchItems = People.find({}, {fields: {
      squads: 1, 
      catchups: 1
    }}).fetch();

    var searchItemsSet = new Set();
    var searchItemTally = {};
    searchItems.forEach(function(item){
      item.squads.forEach(function(squadName){
        searchItemsSet.add(squadName);

        if(squadName in searchItemTally) {
          searchItemTally[squadName]++;
        } else {
          searchItemTally[squadName] = 1;
        }
      });
    });

    return {
      loaded: handle.ready(),
      people: People.find(this.searchForPeopleSelector()).fetch(),
      searchItems: {
        items: searchItemsSet,
        tallys: searchItemTally
      }
    }
  },

  searchForPeopleSelector: function(){
    var peopleRegex = {
      $or: [
        { full_name: this.state.searchQuery ? new RegExp(this.state.searchQuery, 'gi') : { $exists: true } }
      ],
    };

    let squadsArray = Array.from(this.state.squadsSearchQuery);
    if(squadsArray.length > 0){
      peopleRegex.squads = { $all: squadsArray };
    }

    return peopleRegex;
  },

  searchAndFilter: function(event){
    var searchQuery = event.target.value;
    this.setState({ searchQuery: searchQuery });
  },

  
  addEncounter: function(){
    this.setState({ addingEncounter: true });
  },

  closeAddEncounter: function(){
    this.setState({ addingEncounter: false });
  },


  

  editEncounter: function(person_id){
    this.setState({ editingEncounter: { person_id } });
  },

  closeEditEncounter: function(){
    this.setState({ editingEncounter: false });
  },

  toggleSearchItem: function(item){
    squadsSearchQuery = this.state.squadsSearchQuery
    if(squadsSearchQuery.has(item)) {
      squadsSearchQuery.delete(item);
    } else {
      squadsSearchQuery.add(item);
    }
    this.setState({ squadsSearchQuery: squadsSearchQuery })
  },

  render: function() {
    var self = this;
    if (!this.data.loaded) {
      return <LoadingSpinner />;
    }

    return (
      <div>

        <CSSTransitionGroup transitionName="moveDown">
          <AddEditEncounterForm shown={this.state.addingEncounter} close={this.closeAddEncounter}/>
          <AddEditEncounterForm shown={this.state.editingEncounter} person_id={this.state.editingEncounter.person_id} close={this.closeEditEncounter}/>

          <section style={(this.state.addingEncounter || this.state.editingEncounter) ? {display:'none'} : {display:'block'}}>
            <nav className="ui stackable menu" style={{ marginTop: 0 }}>
              <div className="item" id="first-menu-item">
                <strong style={{ fontFamily: "'Unica One', cursive" }}>encountr</strong>
              </div>

              <div className="ui item" style={{ flex: 1 /* how does this even work */ }}>
                <div className="ui transparent icon input">
                  <input className="prompt" type="text" placeholder="name, dates, location, groups"  onChange={ this.searchAndFilter }/>
                  <i className="search link icon"></i>
                </div>
              </div>
              
              <div className="item">
                <div className="ui positive icon circular button" onClick={this.addEncounter}><i className="plus icon"></i></div>
              </div>
            </nav>

            <div className="ui   padded labels">
              { Array.from(this.data.searchItems.items).map(function(searchItem, i){
                var active = self.state.squadsSearchQuery.has(searchItem) ? 'blue' : "";

                return (
                  <a key={i} className={"ui label "+active} onClick={self.toggleSearchItem.bind(self, searchItem)}>
                    {searchItem}
                    <div className="detail">{self.data.searchItems.tallys[searchItem]}</div>
                  </a>);
              })}
            </div>

            <h4 className="ui horizontal divider header">
              <i className="people icon"></i>
              People
            </h4>

            <span>{'' + this.data.people.length == 0 ? "No results" : '' }</span>

            <div className="ui three column doubling grid padded cards">
                { this.data.people.map(function(person, i) {
                    return (<PersonCard key={i} {...person} openEditForm={self.editEncounter.bind(self, person._id)}/>);
                  }) }
            </div>
            </section>
        </CSSTransitionGroup>

      </div>


    );
  }
});


var AddEditEncounterForm = React.createClass({
  mixins: [React.addons.LinkedStateMixin],

  getInitialState: function(){
    return {
      resetKey: (+new Date()), // oh I'm naughty

      person_id: void(0),

      full_name: "",
      whereareyoufrom: "",

      displaypic: "",

      whenWeMet: new Date(),

      profile_linkedin: "",
      profile_number: "",
      profile_email: "",

      _squads: ""
    };
  },

  onComponentMount: function(){
    if(this.props.person_id){
      this.loadPerson(this.props.person_id);
    }
  },

  componentWillReceiveProps: function(nextProps){
    if(nextProps.person_id){
      this.loadPerson(nextProps.person_id);
    }
  },

  loadPerson: function(person_id){
    let state = Object.assign({}, this.state, Person.load(person_id));
    state._squads = state.squads.join(',');
    this.setState(state);
  },

  addEncounter: function(){
    let personData = Object.assign({}, this.state);
    personData.squads = personData._squads.split(',');
    let person = new Person(personData);
    person.save();
    this.clearForm();
    this.props.close();
  },

  clearForm: function() {
    this.replaceState(this.getInitialState());
   },

  render: function(){
    return (
      <div key={this.state.resetKey} className={"ui segment green"} style={this.props.shown ? {display:'block'} : {display:'none'}}>
          <header className="header">

            Add new encounter

            <button className="ui labeled icon button" onClick={this.props.close}>
              <i className="left chevron icon"></i>
              Back
            </button>

          </header>
          
          <div className="content">
            <div className="ui form">
              <div className="field">
                <label>Name</label>
                <input type="text" valueLink={this.linkState('full_name')} placeholder="Dave Davidson"/>
              </div>
              <div className="field">
                <label>Squads</label>
                <input type="text" valueLink={this.linkState('_squads')} placeholder="Party people, Hackers"/>
              </div>
              <div className="field">
                <label>Location</label>
                <input type="text" valueLink={this.linkState('whereareyoufrom')} placeholder="Sydney, Australia"/>
              </div>
              <div className="field">
                <label>Email</label>
                <input type="email" valueLink={this.linkState('profile_email')} placeholder="dave@example.com"/>
              </div>
              <div className="field">
                <label>Phone</label>
                <input type="tel" valueLink={this.linkState('profile_number')} placeholder="dave@example.com"/>
              </div>
              <div className="field">
                <label>Twitter</label>
                <input type="text" valueLink={this.linkState('profile_twitter')} placeholder="@dave"/>
              </div>
              
              <button className="ui button" onClick={this.addEncounter}>Submit</button>
            </div>
          </div>
        </div>
    );
  }
});

var PersonCard = React.createClass({
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
                <button className="ui secondary button" onClick={this.props.openEditForm}>Edit</button>
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
      <div style={{ transition: 'background-color .5s linear' }} className={"ui inverted dimmer transition" + (this.props.dimmed ? "visible active" : "hidden")}>
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