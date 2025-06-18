import React from 'react'
import './Footer.css'
import About from '../About/About'
import { Link } from 'react-router-dom'

import { Instagram, Mail, Phone, MapPin  } from 'lucide-react'

function Footer() {
  return (
    <div className='footer'>
        <div className='footer-content'>
            <h4 className='footer-h1'>BoardMate</h4>
            <p className='footer-para'>Your trusted platform for finding safe and <br />
               comfortable student accommodation across Sri Lanka.
            </p>

                <div className='payments'>
                <h6 className='footer-h1'>Payment Options</h6>
                <img className='visa' src="https://1000logos.net/wp-content/uploads/2017/06/VISA-Logo-2006.png" alt="" />
                <img className='mastercard' src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/MasterCard_Logo.svg/2560px-MasterCard_Logo.svg.png" alt="" />
                <img className='mastercard' src="https://bonuscatch.com/wp-content/uploads/2020/08/Bank-Transfer-e1597449513215.png" alt="" />
            </div>

            <div className='socials'>
                <h6 className='social-heading'>Follow Us</h6>
                <a href="https://www.instagram.com/boardm8te/?utm_source=ig_web_button_share_sheet">
                    {/* <img className='social-img' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5MR-AMUT679hzGroF4L9K9mJcbEo9DGKYgg&s" alt="" /> */}
                    <Instagram size={32} color="skyblue" className='social-img' />
                </a>
            
                {/* <img className='social-img' src="https://img.icons8.com/?size=512&id=118497&format=png" alt="" /> */}
            </div>
            <br />

            <div className='row footer-container'>
                <p className='footer-p'>BoardMate © 2025. All rights reserved.</p>
                <div className='policy-links'>
                    <Link to="#" className='link'><p>Privacy Policy</p></Link>
                    <Link to="#" className='link'><p>Cookie Policy</p></Link>
                </div>
            </div>
            
        </div>

        <div className='about-socials'>
            <div className='about'>
                <h5 className='about-heading' >Quick Links </h5>
                <Link to="/about">
                    <p>About Us</p>
                </Link>
                <Link to="/TC">
                <p>T&C</p>

                </Link>
                <Link to="/">
                    <p>Home</p>
                </Link>

                <Link to="/chat"><p>Chat</p></Link>
                <Link to="/support"><p>Support</p></Link>


            </div>

        </div>

        <div className='contact'>
            <h5>Contact Us</h5>
            <form>
                <fieldset>
                   
                   <div className='contact-fields'>
                        <label>
                            <Phone size={18} color='skyblue' />
                            &nbsp;
                            <a className='mail' href="tel: +94766760760">+94 76 676 0760</a>
                        </label>
                   </div> <br />

                   <div className='contact-fields'>
                        <label>
                            <Mail size={18} color='skyblue' />
                            &nbsp;
                            <a className='mail' href="mailto:boardmate@gmail.com">
                                boardmate@gmail.com
                            </a>
                        </label>
                   </div> <br />

                   <div className='contact-fields'>
                        <label> 
                            <MapPin size={18} color='skyblue' />
                            &nbsp;
                            <a className='location-link' href="https://www.google.com/search?q=57+Ramakrishna+Rd%2C+Colombo+00600+Sri+Lanka&oq=57+Ramakrishna+Rd%2C+Colombo+00600+Sri+Lanka&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIHCAEQIRigATIHCAIQIRiPAtIBBzc3NGowajeoAgiwAgE&sourceid=chrome&ie=UTF-8" target='_blank'>
                                57 Ramakrishna Rd, Colombo 00600 Sri Lanka
                            </a> 
                        </label>
                   </div>
                </fieldset>
            </form>
        </div>
        
    </div>

  )
}

export default Footer