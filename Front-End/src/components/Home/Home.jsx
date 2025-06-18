import { useNavigate } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
// import { propertyData } from "../../data/propertyData";
import "./Home.css";
import { useEffect, useState } from "react";
import { Eye, RotateCw, Search, Star, Users } from "lucide-react";
import apiService from "../../services/api-service";
import { getImage } from "../../utils/image-resolver";

function Home() {
  const navigate = useNavigate();
  const [propertyData, setPropertyData] = useState([]);
  const [searchInput, setSearchInput] = useState({
    location: "",
    type: "",
    priceRange: "",
  });

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
                  <option value="Boralesgamuwa">Boralesgamuwa</option>
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
            <RotateCw />
            </button>
          </div>
        </div>
      </div>

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