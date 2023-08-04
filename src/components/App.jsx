import React, { useState, useEffect } from 'react';
import * as API from '../services/PixabayApi';
import SearchBar from './Searchbar/SearchBar';
import ImageGallery from '../components/ImageGallery/ImageGallery';
import Button from '../components/Button/Button';
import { Audio } from 'react-loader-spinner';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const App = () => {
  const [searchName, setSearchName] = useState('');
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Reset images when searchName changes
    setImages([]);
    setCurrentPage(1);
  }, [searchName]);

  useEffect(() => {
    addImages();
  }, [currentPage]);

  const loadMore = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const handleSubmit = query => {
    setSearchName(query);
  };

  const addImages = async () => {
    try {
      setIsLoading(true);

      const data = await API.getImages(searchName, currentPage);

      if (data.hits.length === 0) {
        return Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }

      const normalizedImages = API.normalizedImages(data.hits);

      setImages(prevImages => [...prevImages, ...normalizedImages]);
      setIsLoading(false);
      setError('');
    } catch (error) {
      setError('Something went wrong!');
      return Notify.failure('Something went wrong!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <SearchBar onSubmit={handleSubmit} />
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
      {images.length > 0 && !isLoading && <Button onClick={loadMore} />}
    </div>
  );
};

export default App;
