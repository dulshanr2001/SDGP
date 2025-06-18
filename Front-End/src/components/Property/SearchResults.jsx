
import { useSearchParams, Link } from 'react-router-dom';
import { propertyData } from '../../data/propertyData';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  
  // Get search parameters
  const university = searchParams.get('university');
  const location = searchParams.get('location');
  const gender = searchParams.get('gender');
  const priceRange = searchParams.get('priceRange');
  const roomType = searchParams.get('roomType');

  // Filter properties based on search criteria
  const filteredProperties = propertyData.filter(property => {
    return (
      (!university || property.university === university) &&
      (!location || property.location === location) &&
      (!gender || property.gender === gender) &&
      (!priceRange || property.price <= parseInt(priceRange)) &&
      (!roomType || property.roomType === roomType)
    );
  });

  return (
    <div className="container mt-4">
      <h2>Search Results</h2>
      <div className="row">
        {filteredProperties.map(property => (
          <div key={property.id} className="col-md-4 mb-4">
            <div className="card">
              <img src={property.images[0]} className="card-img-top" alt={property.name} />
              <div className="card-body">
                <h5 className="card-title">{property.name}</h5>
                <p className="card-text">
                  {property.location} • {property.roomType}
                  <br />
                  LKR {property.price} / month
                </p>
                <Link to={`/properties/${property.id}`} className="btn btn-primary">
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;