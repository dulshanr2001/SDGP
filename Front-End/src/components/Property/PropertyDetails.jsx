import { Bath, Bed, Calendar, ChevronLeft, ChevronRight, Home, Key, MapPin, Phone, Star, Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiService from '../../services/api-service';
import useAuthStore from '../../store/auth-store';
import PropertyChatButton from '../Chatapp/PropertyChatButton';
import ReviewForm from '../Review&Rating/ReviewForm';
import ReviewList from '../Review&Rating/ReviewList';
import './PropertyDetails.css';

const PropertyDetails = () => {
  const { id } = useParams();
  const propertyId = parseInt(id);
  const [property, setProperty] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('10:00');
  const [isLoading, setIsLoading] = useState(false);
  const [isFavourited, setIsFavourited] = useState(false);
  const navigate = useNavigate();
  const authStore = useAuthStore();
  const user = authStore.user;

  // Fetch property data and favourite status on initial render
  useEffect(() => {
    fetchProperty();
    if (user && user.userType !== "LANDLORD") {
      checkFavouriteStatus();
    }
  }, []);

  // Fetch reviews and average rating when property ID is available
  useEffect(() => {
    const fetchReviewsAndRating = async () => {
      try {
        const reviewsResponse = await fetch(`http://localhost:8080/api/properties/${propertyId}/reviews`);
        if (!reviewsResponse.ok) {
          throw new Error('Failed to fetch reviews');
        }
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData);

        const ratingResponse = await fetch(`http://localhost:8080/api/properties/${propertyId}/reviews/average-rating`);
        if (!ratingResponse.ok) {
          throw new Error('Failed to fetch average rating');
        }
        const averageRating = await ratingResponse.json();
        setAverageRating(averageRating);
      } catch (error) {
        console.error('Error fetching reviews or rating:', error);
      }
    };

    fetchReviewsAndRating();
  }, [propertyId]);

  // Function to check if the property is favourited by the user
  const checkFavouriteStatus = async () => {
    try {
      const response = await apiService.get(`/favourites/${user.id}/${propertyId}`);
      if (response.status === 200) {
        setIsFavourited(response.data.isFavourited);
      }
    } catch (error) {
      console.error('Error checking favourite status:', error);
    }
  };

  // Function to toggle favourite status
  const toggleFavourite = async () => {
    try {
      setIsLoading(true);
      const endpoint = isFavourited
        ? `/favourites/${user.id}/${propertyId}`
        : '/favourites';
      const method = isFavourited ? 'delete' : 'post';
      const payload = !isFavourited ? { userId: user.id, propertyId } : {};

      const response = await apiService[method](endpoint, payload);
      if (response.status === 200 || response.status === 201) {
        setIsFavourited(!isFavourited);
        toast.success(isFavourited ? 'Removed from favourites' : 'Added to favourites');
        // Update property's favourite count
        setProperty((prev) => ({
          ...prev,
          favourites: isFavourited ? prev.favourites - 1 : prev.favourites + 1,
        }));
      } else {
        toast.error('Failed to update favourite status');
      }
    } catch (error) {
      console.error('Error toggling favourite:', error);
      toast.error('An error occurred while updating favourites');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch property details from backend
  const fetchProperty = async () => {
    const rs = await apiService.get(`/properties/${propertyId}`);
    if (rs.status === 200) {
      const data = rs.data;
      console.log("data", data);
      setProperty(data);
    }
  };

  // If property not loaded yet, show fallback message
  if (!property) return <div className="container mt-5">Property Not Found</div>;

  // Handle images in slider
  const nextSlide = () => {
    const images = getImagesList(property);
    if (!images || images.length === 0) return;
    setCurrentImage(current => (current === images.length - 1 ? 0 : current + 1));
  };

  const prevSlide = () => {
    const images = getImagesList(property);
    if (!images || images.length === 0) return;
    setCurrentImage(current => (current === 0 ? images.length - 1 : current - 1));
  };

  const bookTour = () => {
    setIsModalOpen(true);
  };

  const handleBookTourSubmit = async () => {
    if (!selectedDate || !selectedTime) {
      toast.warn('Please select both date and time');
      return;
    }

    setIsLoading(true);

    const [hours, minutes] = selectedTime.split(':').map(Number);
    const tourDateTime = new Date(selectedDate);
    tourDateTime.setHours(hours, minutes, 0, 0);

    try {
      const response = await apiService.post('/properties/bookATour', {
        propertyId,
        studentId: user.id,
        tourDateTime: tourDateTime.toISOString(),
      });

      if (response.status === 200 || response.status === 201) {
        toast.success('Tour booked successfully!');
        setIsModalOpen(false);
      } else {
        toast.error('Failed to book tour. Please try again.');
      }
    } catch (error) {
      console.error('Error booking tour:', error);
      toast.error('An error occurred while booking the tour. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 9; hour <= 17; hour++) {
      const hourStr = hour.toString().padStart(2, '0');
      times.push(`${hourStr}:00`);
      times.push(`${hourStr}:30`);
    }
    return times;
  };

  const handleDateChange = (e) => {
    const date = new Date(e.target.value);
    setSelectedDate(date);
  };

  const handleBookProperty = () => {
    navigate(`/property/${id}/payments`);
  };

  const handleReviewSubmit = async (review) => {
    try {
      const response = await fetch(`http://localhost:8080/api/properties/${propertyId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...review,
          user: user?.username || 'Anonymous',
          date: new Date().toISOString().split('T')[0],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      const newReview = await response.json();
      setReviews([...reviews, newReview]);

      const ratingResponse = await fetch(`http://localhost:8080/api/properties/${propertyId}/reviews/average-rating`);
      if (!ratingResponse.ok) {
        throw new Error('Failed to fetch updated average rating');
      }
      const updatedAverageRating = await ratingResponse.json();
      setAverageRating(updatedAverageRating);
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const getImagesList = (property) => {
    if (property.images) {
      return property.images.map((image) => `http://localhost:8080/api/properties/images/${image}`);
    }
    if (property.image) {
      return [`http://localhost:8080/api/properties/images/${property.image}`];
    }
    if (property.imagesList) {
      const imgRefs = property.imagesList.split(',');
      return imgRefs.map((imgRef) => `http://localhost:8080/api/properties/images/${imgRef}`);
    }
    return ['/fallback-property.jpg'];
  };

  return (
    <div className="property-details-container">
      <div className="property-info-section">
        <div className="property-header">
          <h1>{property.title}</h1>
          <div className="property-location">
            <MapPin size={20} />
            <span>{property.address}</span>
          </div>
          <div className="property-type-price">
            <span className="property-type">{property.type}</span>
            <span className="property-price">LKR {property.price.toLocaleString()}</span>
          </div>
        </div>

        <div className="property-quick-info">
          <div className="info-item"><Bed size={24} /><span>{property.bedrooms} beds</span></div>
          <div className="info-item"><Home size={24} /><span>{property.rooms} rooms</span></div>
          <div className="info-item"><Bath size={24} /><span>{property.bathrooms} bathrooms</span></div>
          <div className="info-item"><Phone size={24} /><span>{property.contactNumber}</span></div>
        </div>

        {user && user.userType !== "LANDLORD" && (
          <div className="booking-section">
            <button onClick={bookTour} className="book-tour-btn">
              <Calendar size={20} /> Book a tour
            </button>
            <button className="book-now" onClick={handleBookProperty}>
              <Key size={20} /> Book Now
            </button>
            <button
              className={`favourite-btn ${isFavourited ? 'favourited' : ''}`}
              onClick={toggleFavourite}
              disabled={isLoading}
            >
              <Heart size={20} fill={isFavourited ? 'red' : 'none'} /> {isFavourited ? 'Remove Favourite' : 'Add to Favourites'}
            </button>
            <PropertyChatButton
              propertyId={property.id}
              landlordId={property.landlordId}
              studentId={user.id}
            />
          </div>
        )}

        <div className="rating-container">
          <Star className="star" size={20} />
          <span>{averageRating.toFixed(1)}</span>
        </div>

        <div className="property-description">
          <h2>Description</h2>
          <p>{property.description || "No description available."}</p>
        </div>

        <div className="property-facilities">
          <h2>Facilities</h2>
          {property.facilities?.length > 0 ? (
            <ul>{property.facilities.map((facility, index) => <li key={index}>{facility}</li>)}</ul>
          ) : (
            <p>No facility information available</p>
          )}
        </div>

        <div className="property-university">
          <h2>Nearest University</h2>
          <p>{property.university}</p>
        </div>

        {property.map && (
          <div className="property-map">
            <h2>Location</h2>
            <iframe
              src={property.map}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Property Location"
            ></iframe>
          </div>
        )}

        <div className="review-section">
          <h2>Reviews</h2>
          {user && user.userType !== "LANDLORD" && <ReviewForm onSubmit={handleReviewSubmit} />}
          <ReviewList reviews={reviews} />
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="tour-booking-modal">
            <h2>Book a Property Tour</h2>
            <p>Select a date and time for your property tour</p>

            <div className="modal-form">
              <div className="form-group">
                <label htmlFor="tour-date">Select Date:</label>
                <input
                  type="date"
                  id="tour-date"
                  min={new Date().toISOString().split('T')[0]}
                  onChange={handleDateChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="tour-time">Select Time:</label>
                <select
                  id="tour-time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                >
                  {generateTimeOptions().map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>

              <div className="property-tour-info">
                <p><strong>Property:</strong> {property.title}</p>
                <p><strong>Address:</strong> {property.address}</p>
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="book-btn"
                onClick={handleBookTourSubmit}
                disabled={isLoading}
              >
                {isLoading ? 'Booking...' : 'Book Tour'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="property-image-section">
        {property && (
          <div className="image-slider">
            {getImagesList(property).length > 0 ? (
              <>
                <img
                  src={getImagesList(property)[currentImage]}
                  alt={`${property.title || 'Property'} - image ${currentImage + 1}`}
                  className="main-image"
                />
                <button className="slider-button prev" onClick={prevSlide}>
                  <ChevronLeft size={24} />
                </button>
                <button className="slider-button next" onClick={nextSlide}>
                  <ChevronRight size={24} />
                </button>
                <div className="image-counter">{currentImage + 1} / {getImagesList(property).length}</div>
              </>
            ) : (
              <div className="no-image">No images available</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyDetails;