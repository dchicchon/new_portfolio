import React from "react";

// Firebase
import { storage } from "../../Utils/firebaseConfig";
import "./style.css";

// Bootstrap stuff
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";

// https://firebase.google.com/docs/storage/web/list-files
// https://stackoverflow.com/questions/37335102/how-to-get-a-list-of-all-files-in-cloud-storage-in-a-firebase-app

// Components
import Navbar from "../../Components/Navbar";
import Photo from "../../Components/Photo";
// import Footer from "../../Components/Footer";

class Photography extends React.Component {
  state = {
    photos: [],
    loading: true
  };

  // Listing all the urls
  listAllFiles = () => {
    let unsplashRef = storage.ref("Unsplash");
    let urlsList = [];
    unsplashRef
      .listAll()
      .then(result => {
        result.items.forEach(imageRef => {
          imageRef.getDownloadURL().then(url => {
            // If the url exists, push the url to the urlList
            if (url) {
              let image = {
                url,
                name: imageRef.name
              };
              urlsList.push(image);
            }

            // Have a better way of doing this in the future
            if (urlsList.length > 5) {
              this.setState({
                photos: urlsList,
                loading: false
              });
            }
          });
        });
      })
      .catch(err => {
        console.error(err);
      });
  };

  componentDidMount() {
    this.listAllFiles();
  }

  render() {
    return (
      <div id="photography">
        <Navbar />
        <Container>
          <Row>
            <Col className="m-5">
              <h2>Photography</h2>
            </Col>
          </Row>
          {this.state.loading ? (
            <Row>
              <Col>
                <Spinner animation="border" variant="info" />
              </Col>
            </Row>
          ) : (
            <Row>
              {this.state.photos.map((photo, i) => (
                <Photo src={photo.url} key={i} alt={photo.name} />
              ))}
            </Row>
          )}
        </Container>
        {/* <Footer /> */}
      </div>
    );
  }
}

export default Photography;
