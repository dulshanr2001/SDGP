import { useNavigate } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import "./Home.css";

import { useEffect, useState } from "react";
import { Eye, RotateCw, Search, Star, Users, Heart, X } from "lucide-react";
import apiService from "../../services/api-service";
import { getImage } from "../../utils/image-resolver";
import useAuthStore from "../../store/auth-store";

function Home() {
  const navigate = useNavigate();
  const [propertyData, setPropertyData] = useState([]);
  const [favoriteProperties, setFavoriteProperties] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [searchInput, setSearchInput] = useState({
    location: "",
    type: "",
    priceRange: "",
  });
  
  const authStore = useAuthStore();
  const user = authStore.user;

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = async(e) => {
    e.preventDefault();
    
    // Parse price range to get minPrice and maxPrice
    let minPrice = null;
    let maxPrice = null;
    
    if (searchInput.priceRange) {
      const [min, max] = searchInput.priceRange.split('-');
      minPrice = min;
      maxPrice = max === '+' ? null : max;
    }

    const rs =  await apiService.get("/properties/search", { location: searchInput.location, type: searchInput.type, minPrice, maxPrice });
    console.log("rs",rs);
    if (rs.status === 200) {
      const data = rs.data;
      setPropertyData(data);
    }
    
  };

  const handlePropertyClick = (propertyId) => {
    navigate(`/property/${propertyId}`);
  };

  const handleViewFavourites = async () => {
    if (!user) {
      alert('Please log in to view favorites');
      return;
    }

    if (user.userType === "LANDLORD") {
      alert('Landlords cannot view favorites');
      return;
    }

    // Get favorite property IDs from localStorage
    const favoriteIds = [];
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(`favorite_${user.id}_`) && localStorage.getItem(key) === 'true') {
        const propertyId = key.replace(`favorite_${user.id}_`, '');
        favoriteIds.push(parseInt(propertyId));
      }
    });

    if (favoriteIds.length === 0) {
      setShowFavorites(true);
      setFavoriteProperties([]);
      return;
    }

    // Fetch property details for favorite IDs
    try {
      const favoritePropertiesData = [];
      for (const propertyId of favoriteIds) {
        const response = await apiService.get(`/properties/${propertyId}`);
        if (response.status === 200) {
          favoritePropertiesData.push(response.data);
        }
      }
      setFavoriteProperties(favoritePropertiesData);
      setShowFavorites(true);
    } catch (error) {
      console.error('Error fetching favorite properties:', error);
      alert('Error loading favorites');
    }
  };

  const closeFavorites = () => {
    setShowFavorites(false);
    setFavoriteProperties([]);
  };

  const removeFromFavorites = (propertyId) => {
    const favoriteKey = `favorite_${user.id}_${propertyId}`;
    localStorage.removeItem(favoriteKey);
    setFavoriteProperties(prev => prev.filter(prop => prop.id !== propertyId));
  };

  const fetchProperties = async () => {
    const rs = await apiService.get("/properties");
    if (rs.status === 200) {
      const data = rs.data;
      setPropertyData(data);
    }
  };

  const resetSearch = () => {
    setSearchInput({
      location: "",
      type: "",
      priceRange: "",
    });
    fetchProperties();
  }

  return (
    <div>
      <div className="background-home flex flex-col gap-4 py-4 px-4">
        <TypeAnimation
          sequence={[
            "Finding Your Place, Made Easy",
            2000,
            "",
            500,
            "Your Perfect Match, Just a Click Away!",
            2000,
            "",
            500,
            "Finding Your Place, Made Easy",
          ]}
          wrapper="h1"
          className="main"
          cursor={true}
          repeat={Infinity}
        />

        <h4 className="mainsub">
          Let us help you discover secure, safe, comfortable, and verified accommodations near top universities and
          <br /> bustling city hubs, stress-free and tailored for you!
        </h4>

        {/* Search Section */}
        <div id="find-place">
          <div className="search-box">
            <div className="search-input">
              <div className="search-input-group">
                <label className="search-input-label">Location</label>
                <select 
                  name="location"
                  value={searchInput.location} 
                  onChange={handleChange}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Enter city or area
                  </option>
                  <option value="Bambalapitiya">Colombo</option>
                  <option value="Wallewatta">Dehiwala</option>
                  <option value="Boardwalk">Boralesgamuwa</option>
                  <option value="Kirulapone">Kirulapone</option>
                  <option value="Mount-Lavinia">Mount Lavinia</option>
                </select>
              </div>
            </div>
            <div className="search-input">
              <div className="search-input-group">
                <label className="search-input-label">Room Type</label>
                <select 
                  name="type"
                  value={searchInput.type} 
                  onChange={handleChange}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select type
                  </option>
                  <option value="single">Single Room</option>
                  <option value="shared">Shared Room</option>
                  <option value="annex">Annex</option>
                </select>
              </div>
            </div>
            <div className="search-input">
              <div className="search-input-group">
                <label className="search-input-label">Price Range</label>
                <select 
                  name="priceRange"
                  value={searchInput.priceRange} 
                  onChange={handleChange}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Set your budget
                  </option>
                  <option value="0-10000">Rs. 0 - 10,000</option>
                  <option value="10000-20000">Rs. 10,000 - 20,000</option>
                  <option value="20000-30000">Rs. 20,000 - 30,000</option>
                  <option value="30000-+">Rs. 30,000+</option>
                </select>
              </div>
            </div>
            <button className="search-button flex gap-2 items-center" onClick={handleSearch}>
              <Search size={18} />
              Search Now
            </button>
            <button className="search-button flex gap-2 items-center" onClick={resetSearch}>
              <RotateCw size={18} />
            </button>
            <button className="search-button flex gap-2 items-center" onClick={handleViewFavourites}>
              <Heart size={18} />
              View Favourites
            </button>
          </div>
        </div>
      </div>

      {/* Favorites Modal Overlay */}
      {showFavorites && (
        <div className="favorites-modal-overlay">
          <div className="favorites-modal">
            <div className="favorites-modal-header">
              <h2>My Favorite Properties ({favoriteProperties.length})</h2>
              <button className="close-favorites-btn" onClick={closeFavorites}>
                <X size={24} />
              </button>
            </div>
            
            <div className="favorites-modal-content">
              {favoriteProperties.length === 0 ? (
                <div className="no-favorites">
                  <Heart size={48} />
                  <p>No favorite properties found</p>
                </div>
              ) : (
                <div className="favorites-grid">
                  {favoriteProperties.map((property) => (
                    <div key={property.id} className="favorite-property-card">
                      <div className="favorite-card-image">
                        <img src={getImage(property)} alt={property.title} />
                        <button 
                          className="remove-favorite-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromFavorites(property.id);
                          }}
                        >
                          <Heart size={16} fill="red" />
                        </button>
                      </div>
                      
                      <div className="favorite-card-info" onClick={() => handlePropertyClick(property.id)}>
                        <h3>{property.title}</h3>
                        <p className="location">{property.location}</p>
                        <p className="price">{property.price} LKR</p>
                        <div className="property-stats">
                          <span><Eye size={16} /> {property.views}</span>
                          <span><Users size={16} /> {property.inquiries}</span>
                          <span><Star size={16} /> {property.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mostviewed-props">
        {propertyData && propertyData.length === 0 ? (
          <div className="flex justify-center h-[60vh] min-h-[60vh] font-bold" style={{ paddingTop: "100px" }}>
            <p>No Data</p>
          </div>
        ) : (
          <div className="property-grid min-h-[60vh]" style={{ padding: "10px" }}>
            {propertyData.map((property) => (
              <div key={property.id} className="property-card" onClick={() => handlePropertyClick(property.id)}>
                <img src={getImage(property)} alt={property.title} style={{margin: 0}}/>
                <div className="property-info">
                  <h3>{property.title}</h3>
                  <p className="location">{property.location}</p>
                  <p className="price">{property.price} LKR</p>
                  <div className="property-stats">
                    <span><Eye size={16} /> {property.views}</span>
                    <span><Users size={16} /> {property.inquiries}</span>
                    <span><Star size={16} /> {property.rating}</span>
                    
                  </div>
                  <div className="status-badge">{property.status}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;