import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Eye, Star, Users, Heart } from "lucide-react";
import apiService from "../../services/api-service";
import { getImage } from "../../utils/image-resolver";
import "./Home.css"; // Reuse Home.css for consistent styling

function Favourites() {
  const navigate = useNavigate();
  const [favouriteProperties, setFavouriteProperties] = useState([]);

  useEffect(() => {
    fetchFavourites();
  }, []);

  const fetchFavourites = async () => {
    try {
      const rs = await apiService.get("/properties/favourites");
      if (rs.status === 200) {
        const data = rs.data;
        setFavouriteProperties(data);
      }
    } catch (error) {
      console.error("Error fetching favourites:", error);
      setFavouriteProperties([]);
    }
  };

  const handlePropertyClick = (propertyId) => {
    navigate(`/property/${propertyId}`);
  };

  return (
    <div>
      <div className="background-home flex flex-col gap-4 py-4 px-4">
        <h1 className="main">Your Favourite Properties</h1>
        <h4 className="mainsub">
          Browse through your saved accommodations, ready for you to explore or book!
        </h4>
      </div>

      <div className="mostviewed-props">
        {favouriteProperties && favouriteProperties.length === 0 ? (
          <div className="flex justify-center h-[60vh] min-h-[60vh] font-bold" style={{ paddingTop: "100px" }}>
            <p>No Favourites Yet</p>
          </div>
        ) : (
          <div className="property-grid min-h-[60vh]" style={{ padding: "10px" }}>
            {favouriteProperties.map((property) => (
              <div key={property.id} className="property-card" onClick={() => handlePropertyClick(property.id)}>
                <img src={getImage(property)} alt={property.title} style={{ margin: 0 }} />
                <div className="property-info">
                  <h3>{property.title}</h3>
                  <p className="location">{property.location}</p>
                  <p className="price">{property.price} LKR</p>
                  <div className="property-stats">
                    <span><Eye size={16} /> {property.views}</span>
                    <span><Users size={16} /> {property.inquiries}</span>
                    <span><Star size={16} /> {property.rating}</span>
                    <span><Heart size={16} /> {property.favourites}</span>
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

export default Favourites;