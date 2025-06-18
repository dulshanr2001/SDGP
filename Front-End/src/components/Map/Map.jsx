import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import apiService from "../../services/api-service"
import "./Map.css"
import { MapPin } from "lucide-react"

// Marker icon
const markerIcon = new L.icon({
  iconUrl: "/marker.png",
  iconSize: [30, 30],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

const extractLatLng = (mapUrl) => {
  if (!mapUrl || typeof mapUrl !== "string") {
    console.error("Invalid map URL:", mapUrl)
    return null
  }

  // Handle format: https://maps.google.com/?q=6.9271,79.8612
  if (mapUrl.includes("maps.google.com") && mapUrl.includes("?q=")) {
    try {
      // Extract coordinates from the q parameter
      const qParam = mapUrl.split("?q=")[1].split("&")[0]

      // Check if it's a simple lat,lng format
      if (qParam.includes(",")) {
        const [lat, lng] = qParam.split(",").map((coord) => Number.parseFloat(coord))
        if (!isNaN(lat) && !isNaN(lng)) {
          return { lat, lng }
        }
      }
    } catch (error) {
      console.error("Error parsing Google Maps URL:", error)
    }
  }


  // Match standard coordinates (!2d and !3d)
  let regex = /!2d([-+]?\d*\.\d+)!3d([-+]?\d*\.\d+)/
  let match = mapUrl.match(regex)

  // If no match, check for encoded format (!2z)
  if (!match) {
    regex = /!2z([^!]+)/
    match = mapUrl.match(regex)

    if (match) {
      const decoded = match[1].replace(/N|E/g, "").split(" ")
      if (decoded.length === 2) {
        return { lat: Number.parseFloat(decoded[0]), lng: Number.parseFloat(decoded[1]) }
      }
    }
  }

  if (match) {
    return { lat: Number.parseFloat(match[2]), lng: Number.parseFloat(match[1]) } // lat, lng
  }

  console.error("Coordinates not found in URL:", mapUrl)
  return null
}

const Map = () => {
    const navigate = useNavigate()
  
    // States for properties and form input
    const [filteredProperties, setFilteredProperties] = useState([])
    const [allProperties, setAllProperties] = useState([])
    const [formInput, setFormInput] = useState({
      location: "",
      roomType: "",
      monthlyBudget: 9000,
      bedrooms: "",
      bathrooms: "",
      amenities: [],
    })
    const [loading, setLoading] = useState(false)
  
    // Location options
    const locations = [
      { value: "Colombo", label: "Colombo" },
      { value: "Dehiwala", label: "Dehiwala" },
      { value: "Nugegoda", label: "Nugegoda" },
      { value: "Boralesgamuwa", label: "Boralesgamuwa" },
      { value: "Mount Lavinia", label: "Mount Lavinia" },
      { value: "Kirulapana", label: "Kirulapana" },
      { value: "Colombo 06", label: "Colombo 06" },
      { value: "Colombo 05", label: "Colombo 05" },
      { value: "Colombo 04", label: "Colombo 04" },
      { value: "Wellawatte", label: "Wellawatte" },
      { value: "Bambalapitiya", label: "Bambalapitiya" },
      { value: "Kollupitiya", label: "Kollupitiya" },
      { value: "Rathmalana", label: "Rathmalana" },
      { value: "Pepiliyana", label: "Pepiliyana" },
      { value: "Zoyzapura", label: "Zoyzapura" },
      { value: "Katubedda", label: "Katubedda" },
      { value: "Kalubowila", label: "Kalubowila" },
      { value: "Wijerama", label: "Wijerama" },
    ]
  
    // Room type options
    const roomTypes = [
      { value: "single", label: "Single Room" },
      { value: "double", label: "Double Room" },
      { value: "share", label: "Shared Room" },
    ]
  
    // Fetch properties from backend
    useEffect(() => {
      const fetchProperties = async () => {
        setLoading(true)
        try {
          const response = await apiService.get("/properties")
          setAllProperties(response.data)
          setFilteredProperties(response.data)
  
          // Log the map URLs for debugging purposes
          response.data.forEach((property) => {
            console.log("Property Map URL:", property.mapLink)
            const coordinates = extractLatLng(property.mapLink)
            if (coordinates) {
              console.log("Extracted Coordinates:", coordinates)
            }
          })
        } catch (error) {
          console.error("Error fetching properties:", error)
        } finally {
          setLoading(false)
        }
      }
  
      fetchProperties()
    }, [])
  
    // Handle form input changes
    const handleChange = (field, value) => {
      setFormInput((prev) => {
        return { ...prev, [field]: value }
      })
    }
  
    // Handle room type button clicks
    const handleRoomTypeClick = (field, value) => {
      setFormInput((prev) => {
        return { ...prev, [field]: value }
      })
    }
  
    // Handle amenities checkbox changes
    const handleAmenitiesChange = (e, amenitiesList) => {
      const isChecked = e.target.checked
      setFormInput((prev) => {
        const updatedAmenities = isChecked
          ? [...prev.amenities, amenitiesList]
          : prev.amenities.filter((item) => item !== amenitiesList)
  
        return {
          ...prev,
          amenities: updatedAmenities,
        }
      })
    }
  
    // Filter properties based on form input
    const handleFilter = (event) => {
      event.preventDefault()
  
      const results = allProperties.filter((property) => {
        // Basic filters (location and price)
        const locationMatch =
          !formInput.location || property.location.toLowerCase().includes(formInput.location.toLowerCase())
        const priceMatch = property.price <= Number(formInput.monthlyBudget)
  
        // Room type filter
        const roomTypeMatch = !formInput.roomType || property.roomType === formInput.roomType
  
        // Bedrooms filter
        const bedroomsMatch = !formInput.bedrooms || property.bedrooms === formInput.bedrooms
  
        // Bathrooms filter
        const bathroomsMatch = !formInput.bathrooms || property.bathrooms === formInput.bathrooms
  
        // Amenities filter
        const amenitiesMatch =
          formInput.amenities.length === 0 ||
          formInput.amenities.every((amenity) => property.amenities && property.amenities.includes(amenity))
  
        return locationMatch && priceMatch && roomTypeMatch && bedroomsMatch && bathroomsMatch && amenitiesMatch
      })
  
      setFilteredProperties(results)
    }
  
    // Function to offset markers with the same coordinates
    const getOffsetCoordinates = (coordinates, index) => {
      // Create a small offset based on the property index
      // This will create a small circle of markers around the actual point
      const offsetAmount = 0.0005 // Approximately 50 meters
      const angle = (index % 8) * (Math.PI / 4) // Distribute in 8 directions
  
      return {
        lat: coordinates.lat + offsetAmount * Math.sin(angle),
        lng: coordinates.lng + offsetAmount * Math.cos(angle),
      }
    }
  
    return (
      <div className="mapBackground">
        <div className="container-form-map">
            <form className="mapForm" onSubmit={handleFilter}>
            {/* Location Filter */}
            <label htmlFor="location" className="locLabel">
              Location
            </label>{" "}
            <br />
            <select
                name="location"
                value={formInput.location}
                onChange={(e) => handleChange("location", e.target.value)}
                style={{
                    backgroundColor: formInput.location ? "skyblue" : "#c8d9e6", // Light blue when selected
                    cursor: "pointer",
                }}
            >
                <option value="" disabled hidden>
                    Select Location
                </option>
                {locations.map((loc) => (
                    <option key={loc.value} value={loc.value}>
                        {loc.label}
                    </option>
                ))}
            </select>{" "}
            <br />
            <br />


            {/* Room Type Filter */}
            <label htmlFor="roomType" className="locLabel">
              Room Type{" "}
            </label>{" "}
            <br />
            <div>
                {roomTypes.map((room) => (
                    <button
                        className="roomButton"
                        key={room.value}
                        type="button"
                        onClick={() => handleRoomTypeClick("roomType", room.value)}
                        style={{
                        backgroundColor: formInput.roomType === room.value ? "skyblue" : "",
                        color: formInput.roomType === room.value ? "black" : "",
                        margin: "5px",
                        }}
                    >
                        {room.label}
                    </button>
                    ))}
            </div>{" "}
            <br />


            {/* Monthly Budget Filter */}
            <label htmlFor="monthlyBudget" className="locLabel">
              Monthly Budget
            </label>{" "}
            <br />
            <div className="monthly-budget-filter">
              <input
                    type="range"
                    className="budget"
                    min="9000"
                    max="151000"
                    step="1000"
                    value={formInput.monthlyBudget}
                    onChange={(e) => handleChange("monthlyBudget", e.target.value)}
                />
                <span>{formInput.monthlyBudget} LKR</span>
            </div>{" "}
            <br />


            {/* Room Properties */}
            <label htmlFor="roomProperties" className="locLabel">
              Room Properties
            </label>{" "}
            <br />

            <label htmlFor="bedrooms" className="locLabel1">
              No of bedrooms
            </label>{" "}
            <br />

            <div>
                {[1, 2, 3, 4].map((bedroomCount) => (
                    <button
                        key={bedroomCount}
                        className="bed-bath-button"
                        type="button"
                        onClick={() => handleRoomTypeClick("bedrooms", bedroomCount)}
                        style={{
                        backgroundColor: formInput.bedrooms === bedroomCount ? "skyblue" : "",
                        color: formInput.bedrooms === bedroomCount ? "black" : "",
                        margin: "5px",
                    }}
                    >
                    {bedroomCount}
                    </button>
                    ))}
            </div>{" "}
            <br />
            <label htmlFor="bathrooms" className="locLabel1">
                No of bathrooms
            </label>{" "}
            <br />
            <div>
                {[1, 2, 3, 4].map((bathroomCount) => (
                <button
                    key={bathroomCount}
                    className="bed-bath-button"
                    type="button"
                    onClick={() => handleRoomTypeClick("bathrooms", bathroomCount)}
                    style={{
                    backgroundColor: formInput.bathrooms === bathroomCount ? "skyblue" : "",
                    color: formInput.bathrooms === bathroomCount ? "black" : "",
                    margin: "5px",
                    }}
                >
                    {bathroomCount}
                </button>
                ))}
            </div>{" "}
            <br />


            {/* Amenities */}
            <label htmlFor="amenities" className="locLabel">
              Amenities
            </label>{" "}
            <br />
            <div className="amenitiesContainer">
                {["Furniture", "Wi-Fi", "Kitchen", "Parking Space", "Fridge", "Study Desk", "Ceiling Fan"].map(
                    (amenitiesList) => (
                    <div className="amenities-item" key={amenitiesList}>
                        <label htmlFor={amenitiesList} className="amenititesLabel">
                            {amenitiesList}
                        </label>
                        <input
                            type="checkbox"
                            id={amenitiesList}
                            name="amenities"
                            checked={formInput.amenities.includes(amenitiesList)}
                            onChange={(e) => handleAmenitiesChange(e, amenitiesList)}
                        />
                    </div>
                    ),
                )}
            </div>{" "}
            <br />
            <br />

            <button className="filters-button" type="submit">
              Apply Filters
            </button>
            </form>
  
            {/* Map Container */}
                {!loading ? (
                    <MapContainer center={[6.9271, 79.8612]} zoom={14} style={{ height: "500px", width: "100%" }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
  
                    {/* Render properties dynamically on the map */}
                    {filteredProperties.map((property, index) => {
                        // Use property.mapLink to extract coordinates
                        const coordinates = extractLatLng(property.mapLink)
                            if (!coordinates) return null
  
                        // Apply offset to prevent markers from stacking
                        const offsetCoords = getOffsetCoordinates(coordinates, index)
  
                    return (
                  <Marker key={property.id} position={[offsetCoords.lat, offsetCoords.lng]} icon={markerIcon}>
                    <Popup>
                      <b>{property.title}</b>
                      <br />
                      <br />
                      Location: {property.location} <br />
                      Price: {property.price} LKR / month <br />
                      <button
                        onClick={() => navigate(`/property/${property.id}`)}
                        style={{
                          backgroundColor: "skyblue",
                          border: "none",
                          padding: "5px 10px",
                          cursor: "pointer",
                          marginTop: "10px",
                        }}
                      >
                        View Details
                      </button>
                    </Popup>
                  </Marker>
                )
              })}
            </MapContainer>
          ) : (
            <div
              style={{ height: "500px", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}
            >
              Loading properties...
            </div>
          )}
        </div>
  
        <h4 className="marker-heading">
          <img src="/marker.png" alt="marker" className="marker" /> - Verified Accommodation
        </h4>
        <br />
        <br />
        <br />

        <div className='location-slider'>
            <h1>We've got you covered in various locations!</h1> <br /><br />
            <div className='slide-wrapper'>
            <div className='locations'>    
                <h2>
                    <MapPin className="location-icon" size={18} color="red" style={{ marginRight: "8px" }} />
                    Colombo
                </h2>
                <h2>
                    <MapPin className="location-icon" size={18} color="red" style={{ marginRight: "8px" }} />
                    Dehiwala
                </h2>
                <h2>
                    <MapPin className="location-icon" size={18} color="red" style={{ marginRight: "8px" }} />
                    Nugegoda
                </h2>
                <h2>
                    <MapPin className="location-icon" size={18} color="red" style={{ marginRight: "8px" }} />
                    Boralesgamuwa
                </h2>
                <h2>
                    <MapPin className="location-icon" size={18} color="red" style={{ marginRight: "8px" }} />
                    Mount Lavinia
                </h2>
                <h2>
                    <MapPin className="location-icon" size={18} color="red" style={{ marginRight: "8px" }} />
                    Katubedda
                </h2>
                <h2>
                    <MapPin className="location-icon" size={18} color="red" style={{ marginRight: "8px" }} />
                    Kirulapana
                </h2>
                <h2>
                    <MapPin className="location-icon" size={18} color="red" style={{ marginRight: "8px" }} />
                    Wellawatte
                </h2>
                <h2>
                    <MapPin className="location-icon" size={18} color="red" style={{ marginRight: "8px" }} />
                    Bambalapitiya
                </h2>
                <h2>
                    <MapPin className="location-icon" size={18} color="red" style={{ marginRight: "8px" }} />
                    Kollupitiya
                </h2>
                <h2>
                    <MapPin className="location-icon" size={18} color="red" style={{ marginRight: "8px" }} />
                    Rathmalana
                </h2>
                <h2>
                    <MapPin className="location-icon" size={18} color="red" style={{ marginRight: "8px" }} />
                    Pepiliyana
                </h2>
                <h2>
                    <MapPin className="location-icon" size={18} color="red" style={{ marginRight: "8px" }} />
                    Zoyzapura
                </h2>
                <h2>
                    <MapPin className="location-icon" size={18} color="red" style={{ marginRight: "8px" }} />
                    Kalubowila
                </h2>
                <h2>
                    <MapPin className="location-icon" size={18} color="red" style={{ marginRight: "8px" }} />
                    Wijerama
                </h2>
                
            </div>

            <div className='locations'>
                
                <h2>
                    <MapPin className="location-icon" size={18} color="red" style={{ marginRight: "8px" }} />
                    Colombo
                </h2>
                <h2>
                    <MapPin className="location-icon" size={18} color="red" style={{ marginRight: "8px" }} />
                    Dehiwala
                </h2>
                <h2>
                    <MapPin className="location-icon" size={18} color="red" style={{ marginRight: "8px" }} />
                    Nugegoda
                </h2>
                <h2>
                    <MapPin className="location-icon" size={18} color="red" style={{ marginRight: "8px" }} />
                    Boralesgamuwa
                </h2>
                <h2>
                    <MapPin className="location-icon" size={18} color="red" style={{ marginRight: "8px" }} />
                    Mount Lavinia
                </h2>
                <h2>
                    <MapPin className="location-icon" size={18} color="red" style={{ marginRight: "8px" }} />
                    Katubedda
                </h2>
                <h2>
                    <MapPin className="location-icon" size={18} color="red" style={{ marginRight: "8px" }} />
                    Kirulapana
                </h2>
                <h2>
                    <MapPin className="location-icon" size={18} color="red" style={{ marginRight: "8px" }} />
                    Wellawatte
                </h2>
                <h2>
                    <MapPin className="location-icon" size={18} color="red" style={{ marginRight: "8px" }} />
                    Bambalapitiya
                </h2>
                <h2>
                    <MapPin className="location-icon" size={18} color="red" style={{ marginRight: "8px" }} />
                    Kollupitiya
                </h2>
                <h2>
                    <MapPin className="location-icon" size={18} color="red" style={{ marginRight: "8px" }} />
                    Rathmalana
                </h2>
                <h2>
                    <MapPin className="location-icon" size={18} color="red" style={{ marginRight: "8px" }} />
                    Pepiliyana
                </h2>
                <h2>
                    <MapPin className="location-icon" size={18} color="red" style={{ marginRight: "8px" }} />
                    Zoyzapura
                </h2>
                <h2>
                    <MapPin className="location-icon" size={18} color="red" style={{ marginRight: "8px" }} />
                    Kalubowila
                </h2>
                <h2>
                    <MapPin className="location-icon" size={18} color="red" style={{ marginRight: "8px" }} />
                    Wijerama
                </h2>
                
            </div>

            </div>
            
        </div> <br /><br /><br /><br />

      </div>

      



    )
  }

export default Map