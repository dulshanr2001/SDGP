import React from 'react'
import './About.css'

import { Search , CloudLightning} from 'lucide-react'

function About() {
  return (
    <div className='about-background'>
        <h1>About Us</h1>
        <div className='about-content'>     
            <div className='about-text'>             
                <p>
                    Finding a home away from home has never been easier! <br /> <br />
                    <strong>BoardMate</strong> connects students with the perfect stay - safe, 
                    affordable, and hassle-free!" <br />
                </p>
            </div>

            {/* <img className='about-img' src="https://img.freepik.com/free-photo/young-friends-hostel_52683-121734.jpg?t=st=1738409876~exp=1738413476~hmac=227e53e5922b0f60f42a626954f62ef22da51b0ded01c781b5ee261cea67c344&w=900" alt="" /> */}
            <img className='about-img' src="https://www.goshen.edu/wp-content/uploads/sites/7/2018/06/GC.Fall_.2017.860-web.jpg" alt="" />
        </div>

        <h1 className='mission-h1'>Our Mission</h1>
        <p className='mission-p'>
            <strong>BoardMate</strong> is a long-term accommodation booking platform for students. 
            We help university students in Sri Lanka, <br /> find and book full-time accommodations near their universities, <br />
            without the hassle of negotiation, non-standardized and cumbersome paperwork, 
            and broken payment process.
        </p> <br /><br />

        <div className='about-boxes'>
            <div className='about-search'>
                {/* <img className='search-icon' src="https://img.icons8.com/ios_filled/512/FFFFFF/search.png" alt="" />  */}
                <Search color='black' size={35} />
                <br /><br /> <h2>Easy Search</h2> <br />
                <p>
                    Search from a wide-selection of accommodations
                    that fit your preferences.
                </p>
            </div>

            <div className='negotiation'>
                <img className='search-icon' src="https://www.freeiconspng.com/thumbs/handshake-icon/handshake-icon-23.png" alt="" />
                <br /><br /> <h2>No Negotiation</h2> <br />
                <p>
                    See rent upfront. No need to negotiate. <br /> 
                    Save your time and effort.
                </p>

            </div>

            <div className='paper'>
                {/* <img className='paper-icon' src="https://static.vecteezy.com/system/resources/previews/009/663/149/non_2x/thunder-icon-transparent-free-png.png" alt="" /> */}
                <CloudLightning color='black' size={35}/>
                <br /><br />  <h2>Hassle - Free Paperwork</h2> <br />
                <p>
                    Forget irritating paperwork. Complete your <br /> 
                    booking seamlessly.
                </p>

            </div>

        </div>

        <div className='team'>
            <div className='members'>
                <h1>Our Team</h1>
                <p className='members-p'>
                BoardMate is developed by a dedicated team of students from the Informatics Institute of Technology, <br />
                affiliated with the University of Westminster. Our diverse team brings together expertise in software 
                development, <br /> user experience design, and student accommodation needs. <br /> We are committed to continuously 
                improving our platform to better serve the student community.
                </p> 

                <div className='wrapper'>
                    <div className='title'>
                        <h4>Meet The Team Behind This Platform</h4>
                    </div>

                    <div className='card-container'>
                        <div className='card'>

                            <div className='image1'>
                                <img src="./Nethini.jpeg" alt="" />
                            </div>

                            <div className='content'>
                                <h5>Nethini Galagama</h5>
                            </div>
                        </div>

                        <div className='card'>

                            <div className='image1'>
                                <img src="./Suhanya.jpeg" alt="" />
                            </div>

                            <div className='content'>
                                <h5>Suhanya Kuruneru</h5>
                            </div>
                        </div>

                        <div className='card'>

                            <div className='image1'>
                                <img src="./Hasindi.jpg" alt="" />
                            </div>

                            <div className='content'>
                                <h5>Hasindi Thiranya</h5>
                            </div>
                        </div>

                        <div className='card'>

                            <div className='image1'>
                                <img src="./Minindu.jpeg" alt="" />
                            </div>

                            <div className='content'>
                                <h5>Minindu Gimshan</h5>
                            </div>
                        </div>

                        <div className='card'>

                            <div className='image1'>
                                <img src="./Ravishka.jpeg" alt="" />
                            </div>

                            <div className='content'>
                                <h5>Ravishka Dulshan</h5>
                            </div>
                        </div>

                        <div className='card'>

                            <div className='image1'>
                                <img src="./Pasindu.jpeg" alt="" />
                            </div>

                            <div className='content'>
                                <h5>Pasindu Theekshana</h5>
                            </div>
                        </div>

                    </div>

                </div>
                
            </div>
            <br /> <br /><br /><br />


        </div>
    </div>
  )
}

export default About