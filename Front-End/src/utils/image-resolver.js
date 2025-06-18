export const getImage = (property) => {
    if (property.image) {
      return `http://localhost:8080/api/properties/images/${property.image}`;
    }
    if (property.imagesList) {
      const imgRef = property.imagesList.split(',')[0];
      return `http://localhost:8080/api/properties/images/${imgRef}`;
    }
    return '/fallback-property.jpg'; // Fallback image if none is provided
  }