import { useNavigate } from 'react-router-dom';

const PropertyCard = ({ property, onClick }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else {
            navigate(`/property/${property.id}`);
        }
    };

    return (
        <div className="property-card" onClick={handleClick}>
            <img src={property.images?.[0] || '/fallback-property.jpg'} alt={property.title} />
            <div className="property-info">
                <h3>{property.title}</h3>
                <p className="location">{property.location}</p>
                <p className="price">LKR {property.price} / month</p>
                <div className="rating">
                    <span>★ {property.rating || 'N/A'}</span>
                </div>
            </div>
        </div>
    );
};

export default PropertyCard;