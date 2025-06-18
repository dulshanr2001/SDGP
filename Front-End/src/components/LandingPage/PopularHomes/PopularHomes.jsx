import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import './PopularHomes.css';

const PopularHomes = () => {
    console.log('PopularHomes rendering');

    const properties = [
        {
            location: "Bawdaloka Mw, Colombo 7",
            price: "Rs. 40,000",
            specs: "2 Bed • 10x10 m • 1600 m",
            image: "/place1.jpeg"
        },
        {
            location: "Hill Street, Dehiwala",
            price: "Rs. 30,000",
            specs: "1 Bed • 10x10 m • 1600 m",
            image: "/place2.jpeg"
        },
        {
            location: "Ramakrishna Road, Wellawatta",
            price: "Rs. 10,000",
            specs: "1 Bed • 10x10 m • 1600 m",
            image: "/place3.jpeg"
        }
    ];

    return (
        <div className="popular-homes">
            <div className="popular-homes-container">
                {/* Header */}
                <div className="popular-homes-header">
                    <div>
                        <h2>Our Popular Properties</h2>
                    </div>
                </div>

                {/* Flex Container: Property Grid + Text Box */}
                <div className="property-section">
                    {/* Property Grid */}
                    <div className="property-grid">
                        {properties.map((property, index) => (
                            <div key={index} className="property-card">
                                {/* Image Container */}
                                <div className="property-image-container">
                                    <img
                                        src={property.image}
                                        alt={property.location}
                                        className="property-image"
                                    />
                                </div>

                                {/* Content */}
                                <div className="property-content">
                                    {/* Location */}
                                    <div className="property-location">
                                        <FontAwesomeIcon icon={faLocationDot} />
                                        <span>{property.location}</span>
                                    </div>

                                    {/* Specs */}
                                    <div className="property-specs">{property.specs}</div>

                                    {/* Price and Button */}
                                    <div className="property-footer">
                                        <span className="property-price">{property.price}</span>
                                        <button className="book-button">Book Now</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Text Box */}
                    <div className="property-text-box">
                        <h3>Find the best place, for you.</h3>
                        <p>We’ll help you find the perfect home near your university</p>
                        <p> One that matches your lifestyle, needs, and preferences for comfort and convenience.</p>
                        <button className="explore-button">
                            Explore All
                            <span className="arrow">→</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PopularHomes;