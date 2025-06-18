
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/auth-store';
import PropertyCard from '../PropertyCard/PropertyCard';
import apiService from '../../services/api-service';
import './Profile.css';

const StudentProfile = () => {
  // Access authentication store and routing
  const authStore = useAuthStore();
  const user = authStore.user;
  const navigate = useNavigate();
  
  // State for displaying and editing student profile data
  const [studentData, setStudentData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: {
      day: '',
      month: '',
      year: ''
    },
    university: '',
    studentId: '',
    email: '',
    profileImage: null
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({...studentData});
  const [bookedProperty, setBookedProperty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Update student data when user changes
  useEffect(() => {
    if (user) {
      setStudentData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        dateOfBirth: { 
          day: user.dateOfBirthDay || '', 
          month: user.dateOfBirthMonth || '', 
          year: user.dateOfBirthYear || '' 
        },
        university: user.university || '',
        studentId: user.universityId || '',
        email: user.email || '',
        profileImage: user.profileImage || null
      });

      // Sync edited data with current user
      setEditedData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        dateOfBirth: { 
          day: user.dateOfBirthDay || '', 
          month: user.dateOfBirthMonth || '', 
          year: user.dateOfBirthYear || '' 
        },
        university: user.university || '',
        studentId: user.universityId || '',
        email: user.email || '',
        profileImage: user.profileImage || null
      });
    }
  }, [user]);

  // Fetch the property booked by the user
  useEffect(() => {
    const fetchBookedProperty = async () => {
      if (user?.id) {
        setLoading(true);
        setError(null);
        try {
          // Check if there's a cached property in localStorage
          const bookedPropertyFromStorage = JSON.parse(localStorage.getItem('bookedProperty'));
          if (bookedPropertyFromStorage) {
            setBookedProperty(bookedPropertyFromStorage);
            return;
          }

          // Fetch from API if not in local storage
          const response = await apiService.get(`/payments/user/${user.id}`);
          if (response.data && response.data.length > 0) {
            const latestBooking = response.data[response.data.length - 1];
            const propertyResponse = await apiService.get(`/properties/${latestBooking.propertyId}`);
            setBookedProperty(propertyResponse.data);
            // Cache the property in localStorage
            localStorage.setItem('bookedProperty', JSON.stringify(propertyResponse.data));
          }
        } catch (err) {
          console.error('Error fetching booked property:', err);
          setError('Failed to load booked property');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchBookedProperty();
  }, [user]);

  // Toggle between edit and view mode
  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes to local state and auth store
      setStudentData({...editedData});
      authStore.updateUser({
        ...user,
        firstName: editedData.firstName,
        lastName: editedData.lastName,
        dateOfBirthDay: editedData.dateOfBirth.day,
        dateOfBirthMonth: editedData.dateOfBirth.month,
        dateOfBirthYear: editedData.dateOfBirth.year,
        university: editedData.university,
        universityId: editedData.studentId,
        email: editedData.email,
        profileImage: editedData.profileImage
      });
    }
    setIsEditing(!isEditing);
  };

  // Handle input field changes for form data
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Handle nested object for dateOfBirth
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setEditedData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setEditedData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle profile image upload and convert it to base64
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setEditedData(prev => ({
          ...prev,
          profileImage: event.target.result
        }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const formatDateOfBirth = () => {
    const { day, month, year } = studentData.dateOfBirth;
    return `${day}/${month}/${year}`;
  };

  // Navigate to the booked property details page
  const handlePropertyClick = () => {
    if (bookedProperty) {
      navigate(`/property/${bookedProperty.id}`);
    }
  };

  return (
    <div className="profile-container" style={{ padding: '20px' }}>
      <div className="profile-content">
        <div className="profile-sidebar">
          <div className="profile-image-container">
            {isEditing ? (
              <>
                <input
                  type="file"
                  id="profileImage"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
                <label htmlFor="profileImage" className="profile-image-edit">
                  <img 
                    src={editedData.profileImage || "/placeholder-profile.png"} 
                    alt="Profile" 
                    className="profile-image"
                  />
                  <div className="edit-overlay">Change Photo</div>
                </label>
              </>
            ) : (
              <img 
                src={studentData.profileImage || "/placeholder-profile.png"} 
                alt="Profile" 
                className="profile-image"
              />
            )}
          </div>
          <h2>{`${studentData.firstName || 'Student'} ${studentData.lastName || ''}`}</h2>
          <p className="profile-type">Student</p>
          <button 
            className="edit-profile-btn"
            onClick={handleEditToggle}
          >
            {isEditing ? 'Save Profile' : 'Edit Profile'}
          </button>
        </div>

        <div className="profile-details">
          <h1>Student Profile</h1>
          
          <div className="profile-section">
            <h3>Personal Information</h3>
            <div className="profile-field">
              <span className="field-label">First Name:</span>
              {isEditing ? (
                <input
                  type="text"
                  name="firstName"
                  value={editedData.firstName}
                  onChange={handleChange}
                />
              ) : (
                <span className="field-value">{studentData.firstName}</span>
              )}
            </div>
            <div className="profile-field">
              <span className="field-label">Last Name:</span>
              {isEditing ? (
                <input
                  type="text"
                  name="lastName"
                  value={editedData.lastName}
                  onChange={handleChange}
                />
              ) : (
                <span className="field-value">{studentData.lastName}</span>
              )}
            </div>
            <div className="profile-field">
              <span className="field-label">Date of Birth:</span>
              {isEditing ? (
                <div className="dob-edit">
                  <input
                    type="text"
                    name="dateOfBirth.day"
                    placeholder="DD"
                    maxLength="2"
                    value={editedData.dateOfBirth.day}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="dateOfBirth.month"
                    placeholder="MM"
                    maxLength="2"
                    value={editedData.dateOfBirth.month}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="dateOfBirth.year"
                    placeholder="YYYY"
                    maxLength="4"
                    value={editedData.dateOfBirth.year}
                    onChange={handleChange}
                  />
                </div>
              ) : (
                <span className="field-value">{formatDateOfBirth()}</span>
              )}
            </div>
          </div>

          <div className="profile-section">
            <h3>University Information</h3>
            <div className="profile-field">
              <span className="field-label">University:</span>
              {isEditing ? (
                <select
                  name="university"
                  value={editedData.university}
                  onChange={handleChange}
                >
                  <option value="Informatics Institute of Technology">Informatics Institute of Technology</option>
                  <option value="University of Colombo">University of Colombo</option>
                  <option value="University of Moratuwa">University of Moratuwa</option>
                </select>
              ) : (
                <span className="field-value">{studentData.university}</span>
              )}
            </div>
            <div className="profile-field">
              <span className="field-label">Student ID:</span>
              {isEditing ? (
                <input
                  type="text"
                  name="studentId"
                  value={editedData.studentId}
                  onChange={handleChange}
                />
              ) : (
                <span className="field-value">{studentData.studentId}</span>
              )}
            </div>
          </div>

          <div className="profile-section">
            <h3>Contact Information</h3>
            <div className="profile-field">
              <span className="field-label">Email:</span>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={editedData.email}
                  onChange={handleChange}
                />
              ) : (
                <span className="field-value">{studentData.email}</span>
              )}
            </div>
          </div>

          <div className="profile-section">
            <h3>My Property</h3>
            {loading ? (
              <div className="loading-section">Loading property...</div>
            ) : error ? (
              <div className="error-section">{error}</div>
            ) : bookedProperty ? (
              <div onClick={handlePropertyClick} style={{ cursor: 'pointer' }}>
                <PropertyCard property={bookedProperty} />
              </div>
            ) : (
              <p className="empty-section">No property booked yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;