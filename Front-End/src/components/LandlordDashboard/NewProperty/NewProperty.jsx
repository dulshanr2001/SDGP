import React, { useState } from 'react';
import { X, Upload, Building, MapPin, DollarSign, Home, Users, BedDouble, Bath, SquareCode, Map, Link, Phone, University } from 'lucide-react';
import './NewProperty.css';
import GoogleMapComponent from './GoogleMapComponent.jsx';

const NewProperty = ({ onClose, onSubmit }) => {
  const [propertyData, setPropertyData] = useState({
    title: '',
    location: '',
    mapLink: '',
    coordinates: null,
    price: '',
    type: 'Apartment',
    bedrooms: 1,
    bathrooms: 1,
    rooms: 1,
    area: '',
    description: '',
    amenities: [],
    images: [], // Store multiple images here
    contactNumber: '', // New field: Contact Number
    address: '', // New field: Address
    university: '', // New field: Nearest University
  });

  const [imagePreviews, setImagePreviews] = useState([]); // Store image preview URLs
  const [showMapModal, setShowMapModal] = useState(false);

  const propertyTypes = ['Apartment', 'House', 'Room', 'Annex', 'Villa', 'Commercial'];
  const amenitiesList = ['WiFi', 'AC', 'Parking', 'Furnished', 'Security', 'Hot Water', 'Kitchen', 'Balcony', 'Garden'];

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPropertyData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle number input changes
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setPropertyData((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
  };

  // Handle amenity selection
  const handleAmenityChange = (amenity) => {
    setPropertyData((prev) => {
      const newAmenities = prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity];
      return { ...prev, amenities: newAmenities };
    });
  };

  // Handle image uploads
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // Limit the number of images to 10
    if (files.length + propertyData.images.length > 10) {
      alert('You can upload a maximum of 10 images.');
      return;
    }

    // Create URLs for previews
    const newImagePreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newImagePreviews]);

    // Update the state with the new images
    setPropertyData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  // Remove an image from the preview and state
  const removeImage = (index) => {
    const newImages = [...propertyData.images];
    const newPreviews = [...imagePreviews];

    newImages.splice(index, 1);
    newPreviews.splice(index, 1);

    setPropertyData((prev) => ({ ...prev, images: newImages }));
    setImagePreviews(newPreviews);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(propertyData);
  };

  // Handle opening the map modal
  const handleOpenMap = () => {
    setShowMapModal(true);
  };

  // Handle closing the map modal
  const handleCloseMap = () => {
    setShowMapModal(false);
  };

  // Handle setting the location from the map
  const handleSetLocation = (locationData) => {
    setPropertyData((prev) => ({
      ...prev,
      location: locationData.address || 'Selected from map',
      coordinates: {
        lat: locationData.lat,
        lng: locationData.lng,
      },
    }));
    setShowMapModal(false);
  };

  return (
    <div className="new-property-overlay">
      <div className="new-property-modal">
        <div className="modal-header">
          <h2>Add New Property</h2>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="property-form">
          <div className="form-grid">
            <div className="form-column">
              <div className="form-group">
                <label htmlFor="title">
                  <Building size={18} />
                  Property Title*
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={propertyData.title}
                  onChange={handleChange}
                  placeholder="e.g. Modern Studio Near IIT"
                  required
                />
              </div>

              <div className="form-group location-group">
                <label htmlFor="location">
                  <MapPin size={18} />
                  Location*
                </label>
                <div className="location-input-group">
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={propertyData.location}
                    onChange={handleChange}
                    placeholder="e.g. Colombo, Kandy"
                    required
                  />
                  <button
                    type="button"
                    className="map-button"
                    onClick={handleOpenMap}
                  >
                    <Map size={18} />
                    Set on Map
                  </button>
                </div>

                <div className="map-link-container">
                  <label htmlFor="mapLink" className="map-link-label">
                    <Link size={16} />
                    Google Maps Link (Optional)
                  </label>
                  <input
                    type="text"
                    id="mapLink"
                    name="mapLink"
                    value={propertyData.mapLink}
                    onChange={handleChange}
                    placeholder="Paste Google Maps link here"
                  />
                </div>

                {propertyData.coordinates && (
                  <div className="map-pin-indicator">
                    <MapPin size={16} />
                    Location pinned on map
                  </div>
                )}
              </div>

              {/* New Fields: Contact Number, Address, Nearest University */}
              <div className="form-group">
                <label htmlFor="contactNumber">
                  <Phone size={18} />
                  Contact Number*
                </label>
                <input
                  type="text"
                  id="contactNumber"
                  name="contactNumber"
                  value={propertyData.contactNumber}
                  onChange={handleChange}
                  placeholder="e.g. +94 77 123 4567"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">
                  <MapPin size={18} />
                  Address*
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={propertyData.address}
                  onChange={handleChange}
                  placeholder="e.g. 123 Main Street, Colombo"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="university">
                  <University size={18} />
                  Nearest University*
                </label>
                <input
                  type="text"
                  id="university"
                  name="university"
                  value={propertyData.university}
                  onChange={handleChange}
                  placeholder="e.g. University of Colombo"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="price">
                    <DollarSign size={18} />
                    Monthly Rent (LKR)*
                  </label>
                  <input
                    type="text"
                    id="price"
                    name="price"
                    value={propertyData.price}
                    onChange={handleChange}
                    placeholder="25,000"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="type">
                    <Home size={18} />
                    Property Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={propertyData.type}
                    onChange={handleChange}
                  >
                    {propertyTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="bedrooms">
                    <BedDouble size={18} />
                    Beds
                  </label>
                  <input
                    type="number"
                    id="bedrooms"
                    name="bedrooms"
                    value={propertyData.bedrooms}
                    onChange={handleNumberChange}
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="bathrooms">
                    <Bath size={18} />
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    id="bathrooms"
                    name="bathrooms"
                    value={propertyData.bathrooms}
                    onChange={handleNumberChange}
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="rooms">
                    <Users size={18} />
                    Rooms
                  </label>
                  <input
                    type="number"
                    id="rooms"
                    name="rooms"
                    value={propertyData.rooms}
                    onChange={handleNumberChange}
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="area">
                    <SquareCode size={18} />
                    Area (sqft)
                  </label>
                  <input
                    type="text"
                    id="area"
                    name="area"
                    value={propertyData.area}
                    onChange={handleChange}
                    placeholder="900"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={propertyData.description}
                  onChange={handleChange}
                  placeholder="Describe your property..."
                  rows="4"
                ></textarea>
              </div>
            </div>

            <div className="form-column">
              <div className="form-group">
                <label>
                  <Upload size={18} />
                  Upload Images (Max 10)
                </label>
                <div className="image-upload-container">
                  <input
                    type="file"
                    id="images"
                    name="images"
                    onChange={handleImageChange}
                    accept="image/*"
                    multiple
                    className="file-input"
                  />
                  <label htmlFor="images" className="upload-label">
                    <div className="upload-icon">
                      <Upload size={24} />
                      <span>Select Files</span>
                    </div>
                  </label>
                </div>

                {/* Display image previews */}
                <div className="image-previews-container">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="image-preview">
                      <img src={preview} alt={`Preview ${index + 1}`} />
                      <button
                        type="button"
                        className="remove-image-btn"
                        onClick={() => removeImage(index)}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>
                  <Users size={18} />
                  Amenities
                </label>
                <div className="amenities-grid">
                  {amenitiesList.map((amenity) => (
                    <div
                      key={amenity}
                      className={`amenity-chip ${propertyData.amenities.includes(amenity) ? 'selected' : ''}`}
                      onClick={() => handleAmenityChange(amenity)}
                    >
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="submit-btn">Add Property</button>
          </div>
        </form>
      </div>

      {showMapModal && (
        <div className="map-modal-overlay">
          <div className="map-modal">
            <div className="modal-header">
              <h3>Select Location on Map</h3>
              <button className="close-button" onClick={handleCloseMap}>
                <X size={20} />
              </button>
            </div>

            <div className="map-container">
              <GoogleMapComponent
                onSelectLocation={handleSetLocation}
                initialLocation={propertyData.coordinates}
              />
            </div>

            <div className="map-modal-footer">
              <button type="button" className="cancel-btn" onClick={handleCloseMap}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewProperty;