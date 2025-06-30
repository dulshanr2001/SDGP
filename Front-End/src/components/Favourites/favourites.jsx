import { Heart, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiService from '../../services/api-service';
import useAuthStore from '../../store/auth-store';
import './Favourites.css';

const Favourites = () => {
  const navigate = useNavigate();
  const authStore = useAuthStore();
  const user = authStore.user;
  const [favourites, setFavourites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch favorite properties on component mount
  useEffect(() => {
    if (!user || user.userType === 'LANDLORD') {
      toast.error('Only students can view favorites');
      navigate('/');
      return;
    }
    fetchFavourites();
  }, [user, navigate]);

  const fetchFavourites = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.get(`/favourites/${user.id}`);
      if (response.status === 200) {
        setFavourites(response.data);
      } else {
        toast.error('Failed to fetch favorites');
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast.error('An error occurred while fetching favorites');
    } finally {
      setIsLoading(false);
    }
  };

  const removeFavourite = async (propertyId) => {
    setIsLoading(true);
    try {
      const response = await apiService.delete(`/favourites/${user.id}/${propertyId}`);
      if (response.status === 200) {
        setFavourites(favourites.filter(fav => fav.id !== propertyId));
        toast.success('Removed from favorites');
      } else {
        toast.error('Failed to remove from favorites');
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('An error occurred while removing favorite');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePropertyClick = (propertyId) => {
    navigate(`/property/${propertyId}`);
  };

  if (isLoading) {
    return <div className="favourites-container">Loading...</div>;
  }

  return (
    <div className="favourites-container">
      <h1>My Favourites</h1>
      {favourites.length === 0 ? (
        <p className="no-favourites">No favourite properties found.</p>
      ) : (
        <div className="favourites-grid">
          {favourites.map(property => (
            <div key={property.id} className="favourite-card">
              <img
                src={property.image ? `http://localhost:8080/api/properties/images/${property.image}` : '/fallback-property.jpg'}
                alt={property.title}
                className="favourite-image"
                onClick={() => handlePropertyClick(property.id)}
              />
              <div className="favourite-info">
                <h3>{property.title}</h3>
                <p className="favourite-address">{property.address}</p>
                <p className="favourite-price">LKR {property.price.toLocaleString()}</p>
                <button
                  className="remove-favourite-btn"
                  onClick={() => removeFavourite(property.id)}
                  disabled={isLoading}
                >
                  <Trash2 size={20} /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favourites;