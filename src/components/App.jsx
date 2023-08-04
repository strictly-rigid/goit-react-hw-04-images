import { Component } from 'react';
import * as API from '../services/PixabayApi';
import SearchBar from './Searchbar/SearchBar';
import ImageGallery from '../components/ImageGallery/ImageGallery';
import Button from '../components/Button/Button';
import { Audio } from 'react-loader-spinner';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

class App extends Component {
  state = {
    searchName: '',
    images: [],
    currentPage: 1,
    error: null,
    isLoading: false,
    totalPages: 0,
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.searchName !== this.state.searchName ||
      prevState.currentPage !== this.state.currentPage
    ) {
      this.addImages();
    }
  }

  loadMore = () => {
    this.setState(prevState => ({
      currentPage: prevState.currentPage + 1,
    }));
  };

  handleSubmit = query => {
    this.setState({
      searchName: query,
      images: [],
      currentPage: 1,
    });
  };

  addImages = async () => {
    const { searchName, currentPage } = this.state;
    try {
      this.setState({ isLoading: true });

      const data = await API.getImages(searchName, currentPage);

      if (data.hits.length === 0) {
        return Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }

      const normalizedImages = API.normalizedImages(data.hits);

      this.setState(state => ({
        images: [...state.images, ...normalizedImages],
        isLoading: false,
        error: '',
      }));
    } catch (error) {
      this.setState({ error: 'Something went wrong!' });
      return Notify.failure('Something went wrong!');
    } finally {
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { images, isLoading } = this.state;

    return (
      <div>
        <SearchBar onSubmit={this.handleSubmit} />
        {images.length > 0 && <ImageGallery images={images} />}
        {isLoading && (
          <Audio
            height="120"
            width="120"
            radius="9"
            color="blue"
            ariaLabel="loading"
          />
        )}
        {images.length > 0 && !isLoading && <Button onClick={this.loadMore} />}
      </div>
    );
  }
}

export default App;
