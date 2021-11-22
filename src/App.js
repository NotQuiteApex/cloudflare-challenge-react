import logo from './logo.svg';
import './App.css';
import React from 'react';
import axios from 'axios';

class Post extends React.Component {
  render() {
    return (
      <div className="boxed">
        <h3 className="Post-text">"{this.props.title}"</h3>
        <h5 className="Post-text">by `{this.props.username}`</h5>
        <p className="Post-text">{this.props.content}</p>
      </div>
    )
  }
}

class PostMaker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inpUser: '',
      inpTitle: '',
      inpContent: '',
      error: ''
    }
  }

  updateUser(event) {
    this.setState({
      inpUser: event.target.value
    });
  }

  updateTitle(event) {
    this.setState({
      inpTitle: event.target.value
    });
  }

  updateContent(event) {
    this.setState({
      inpContent: event.target.value
    });
  }

  postContent() {
    this.setState({
      error: ""
    });
    // Make sure each field is filled...
    if (this.state.inpUser.length === 0) {
      this.setState({
        error: "Username cannot be blank!"
      });
      return;
    }
    if (this.state.inpTitle.length === 0) {
      this.setState({
        error: "Title cannot be blank!"
      });
      return;
    }
    if (this.state.inpContent.length === 0) {
      this.setState({
        error: "Content cannot be blank!"
      });
      return;
    }
    // do an axios post...
    axios.post('http://backrust.lhickokd.workers.dev/posts', {
      username: this.state.inpUser,
      title: this.state.inpTitle,
      content: this.state.inpContent,
    }, { headers: {
      "Access-Control-Max-Age": 600
    }})
    .then((resp) => {
      // on completion, refresh this page...
      window.location.reload();
    })
    .catch((err) => {
      this.setState({
        error: "Failed to make post, please try again later!"
      });
      console.log(err);
    });
  }

  render() {
    return (
      <div className="boxed">
        <p className="Error-text">{this.state.error}</p>
        <label className="Label-text">Username:</label>
        <input value={this.state.inpUser} onChange={(evt) => this.updateUser(evt)}></input>
        <br /><br />

        <label className="Label-text">Title:</label>
        <input value={this.state.inpTitle} onChange={(evt) => this.updateTitle(evt)}></input>
        <br /><br />

        <label className="Label-text">Content:</label>
        <input value={this.state.inpContent} onChange={(evt) => this.updateContent(evt)}></input>
        <br /><br />

        <button onClick={() => this.postContent()}>Post!</button>
        <br />
      </div>
    );
  }
}

class PosterBoard extends React.Component {
  constructor(props) {
    super(props);

    this.posts = [];
    this.state = {posts: []};
  }

  componentDidMount() {
    axios.get('http://backrust.lhickokd.workers.dev/posts')
    .then((resp) => {
      this.setState({posts: resp.data});
      //console.log(this.posts);
    })
    .catch((err) => {
      console.log(err);
    });
  }

  showPosts() {
    let postlist = [];
    this.state.posts.forEach((post) => {
      postlist.unshift(
        <Post className="Post" title={post.title} content={post.content} username={post.username} key={post.title} />
      );
    });
    return postlist;
  }

  render() {
    return (
      <div className="PosterBoard">
        <PostMaker />
        { this.showPosts() }
      </div>
    )
  }
}

function App() {
  return (
    <div className="App">
      <PosterBoard/>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
    </div>
  );
}

export default App;
