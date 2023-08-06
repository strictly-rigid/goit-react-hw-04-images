import { useState, useEffect } from 'react';
import * as API from '../services/PixabayApi';
import SearchBar from './Searchbar/SearchBar';
import ImageGallery from '../components/ImageGallery/ImageGallery';
import Button from '../components/Button/Button';
import { Audio } from 'react-loader-spinner';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

export default function App() {
  const [searchName, setSearchName] = useState('');
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!searchName) {
      return;
    }
    addImages();
  }, [searchName, currentPage]);

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

      setImages([...images, ...normalizedImages]);
      setIsLoading(false);
      // setError('');
    } catch (error) {
      // setError('Something went wrong!');
      return Notify.failure('Something went wrong!');
    } finally {
      setIsLoading(false);
    }
  };
  const loadMore = () => {
    setCurrentPage(prevState => prevState + 1);
  };

  const handleSubmit = query => {
    setSearchName(query);
    setImages([]);
    setCurrentPage(1);
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
}
