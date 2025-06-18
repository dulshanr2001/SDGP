import { Eye, Plus, Star, TrendingUp, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import apiService from '../../services/api-service';
import './LandlordDashboard.css';
import NewProperty from './NewProperty/NewProperty';
import { toast } from 'react-toastify';
import { getImage } from '../../utils/image-resolver';

const LandlordDashboard = () => {
  const [showNewPropertyForm, setShowNewPropertyForm] = useState(false);
  const [properties, setProperties] = useState([]); // State to store properties from the backend

  // Fetch properties from the backend when the component loads
  useEffect(() => {
    fetchProperties();
  }, []);

  // Function to fetch properties from the backend
  const fetchProperties = async () => {
    try {
      const response = await apiService.get('http://localhost:8080/api/properties');
      if (response.status !== 200) {
        throw new Error('Failed to fetch properties');
      }
      const data = await response.data;
      setProperties(data); // Update the state with fetched properties
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  // Function to upload images and return their filenames
  const uploadImages = async (images) => {

    console.log('Upload images function called with:', images);
    
    if (!images || images.length === 0) {
      toast.warn('No images to upload');
      return [];
    }
    
    try {
      const formData = new FormData();
      
      const imageArray = images instanceof FileList ? Array.from(images) : 
                         Array.isArray(images) ? images : [images];
    
      imageArray.forEach((image, index) => {
        if (image instanceof File) {
          console.log(`Processing image ${index}:`, image.name, 'Size:', image.size);
          formData.append('files', image);
        } else {
          toast.error("Invalid image type. Please upload valid images.");
          console.error('Invalid image type:', image);
        }
      });

      
      // Using the new postMultipart method instead of custom post config
      const response = await apiService.postMultipart('http://localhost:8080/api/properties/upload-images', formData);
      
      if (response.status !== 200) {
        throw new Error('Failed to upload images');
      }
      
      toast.success('Images uploaded successfully');
      return response.data.imageReferences; // Return array of uploaded image filenames
    } catch (error) {
      console.error('Error uploading images:', error);
      throw error;
    }
  };

  // Function to add a new property to the backend
  const handleAddProperty = async (newProperty) => {
    if (!newProperty) {
      return; // Early return if there's no property
    }
    
    try {
      let uploadedImageNames = [];
      if (newProperty.images && newProperty.images.length > 0) {
        console.log('Images found in new property:', newProperty.images);
        uploadedImageNames = await uploadImages(newProperty.images);
      }
      

      const propertyToCreate = { ...newProperty };
      delete propertyToCreate.images; // Remove images from property object
      
      const response = await apiService.post('/properties', propertyToCreate);
      if (response.status !== 200) {
        throw new Error('Failed to add property');
      }
      
      const createdProperty = response.data;
      
      if (uploadedImageNames.length > 0) {
        const imageResponse = await apiService.post(
          `http://localhost:8080/api/properties/${createdProperty.id}/add-images`, 
          { imageReferences: uploadedImageNames }
        );
        
        if (imageResponse.status !== 200) {
          console.warn('Property created but failed to link images');
        } else {
          // Update property with images
          createdProperty.image = `http://localhost:8080/api/properties/images/${uploadedImageNames[0]}`; 
          // Use first image as main display image
        }
      }
      
      await fetchProperties()
      setShowNewPropertyForm(false); // Close the form
    } catch (error) {
      console.error('Error adding property:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>Welcome Back!</h1>
          <p>Manage your properties and track their performance all in one place</p>
        </div>
        <button
          className="add-property-btn"
          onClick={() => setShowNewPropertyForm(true)}
        >
          <Plus size={20} />
          Add New Property
        </button>
      </div>

      <div className="stats-grid">
                 {/* {stats.map((stat, index) => (
           <div key={index} className="stat-card">
            <div className="stat-icon">{stat.icon}</div>
             <div className="stat-info">
              <h3>{stat.value}</h3>
               <p>{stat.title}</p>
             </div>
          </div>
       ))} */}
        
      </div>

      <div className="dashboard-content">
        <div className="w-full">
          <div className="section-header">
            <h2>Your Properties</h2>
            <TrendingUp />
          </div>
          <div className="properties-grid">
            {properties.map(property => (
              <div key={property.id} className="property-card">
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
        </div>

        <div className="insights-section">
          <div className="section-header">
            <h2>Performance Insights</h2>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={properties}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="title" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="views" fill="#8884d8" name="Views" />
                <Bar dataKey="inquiries" fill="#82ca9d" name="Inquiries" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {showNewPropertyForm && (
        <NewProperty
          onClose={() => setShowNewPropertyForm(false)}
          onSubmit={handleAddProperty}
        />
      )}
    </div>
  );
};

export default LandlordDashboard;