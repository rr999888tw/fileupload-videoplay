import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ReactPlayer from 'react-player';
// import { KSYVideo } from 'react-native-ksyvideo';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
// paddingTop: 32,
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';



const styles = {
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
};



class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      // socket: null,
      value: '',
      files: null
    };
  }

  

  handleTextChange = (event) => {
    this.setState({ value: event.target.value });
  }

  // handleTextSubmit = (event) => {

  //   const data = {
  //     url: this.state.value
  //   }
  //   const url = '/uploadText'
  //   let options = {
  //     method: "POST",
  //     body: JSON.stringify(data),
  //     headers: {
  //       "Content-Type": "application/json"
  //     },
  //   };
  //   fetch(url, options)
  //     .then((response) => response.json())
  //     .then((resjson) => { console.log(resjson); })
  //     .catch((err) => { console.error(err) });


  //   event.preventDefault();

  //   this.setState({
  //     value: ""
  //   })

  // }

  handleFilesUpload = (filearr) => {
    var formData = new FormData();

    for (let i = 0; i < filearr.length; ++i) {
      console.log({
        fileName: filearr[i].name
      })
      formData.append(filearr[i].name, filearr[i]);
    }

    fetch('/uploadFiles', {
      method: 'PUT',
      body: formData
    })
      .then(response => {
        console.log(response);
      })
      .catch(error => { console.error('Error:', error) });
  }

  handleFilesChange = (e) => {
    // console.log({ eTarget: e.target.value})
    this.setState({ files: e.target.files })
  }


  handleFilesSubmit = (e) => {
    e.preventDefault(); // Stop form submit
    this.handleFilesUpload(this.state.files);
    this.setState({
      files: null
    });
    e.target[0].value = "";

  }

  render() {
    const { classes } = this.props;
    const myplaceholder = "...type in the file you want to play...";

    return (
      <div>

        <form className={classes.root}
          onSubmit={(e) => { this.handleFilesSubmit(e) }}>
          <Input type="file" className={classes.root}
            onChange={(e) => { this.handleFilesChange(e) }}
            inputProps={{
              multiple: true,
            }} />
          <Button type="submit" className={classes.root} variant='raised'> Upload </Button>
        </form>


        <form className={classes.root} onSubmit={(event) => { this.handleTextSubmit(event) }}>
          <Input className={classes.root}
            fullWidth={true}
            placeholder={myplaceholder}
            onChange={(event) => { this.handleTextChange(event) }}
            value={this.state.value} />
        </form>


        <ReactPlayer 
          url= {`/video/${this.state.value}`}  
          // url= 'http://10.117.227.124:1935/vod/mp4:sample.mp4/manifest.mpd'
          playing = {false}
          controls = {true}
        />


      </div>
    );
  }
}

export default withStyles(styles)(App);
