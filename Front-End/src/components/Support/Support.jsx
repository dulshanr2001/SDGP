import React from 'react'
import './Support.css'

import {Mail, Phone, Text, Lightbulb, MessageCircle} from 'lucide-react';

function Support() {
  return (
      <div className='background-support text-black' style={{paddingTop: '20px', backgroundColor:"white"}}>
        <div className='supportBackground h-[50vh]'>
          <div className='image-container-support h-full'>
            <img src="/support page icon1.png" alt="" />
            <h2 className='text-overlay'>How It Works
              <span className='sub-text'> <br /> We are with you at every step of your journey! <br /><br /></span>
              <span className='second-sub-text'>
                <div className='flex items-center justify-center gap-2'>
                  <Lightbulb size={30} color='yellow' />
                  Know how BoardMate works!
                </div>
              </span>
            </h2>
          </div>
        </div>

        <div className='cards'>
          <div className='discover'>
            <img src="./real-estate-searching.png" alt="" />
            <div className='content'>
              <h2 className='discover-topic'>Discover</h2>
              <p className='discover-para'>
                Discover from a range of properties provided on our website.
                Choose your home according to your needs. <br />
                If you are not satisfied with the listings given on our website, <br />
                we will find properties according to your preferences.
              </p>
            </div>
          </div>
          <br />

          <div className='discover'>
            <img src="./book-now.png" alt="" />
            <div className='content'>
              <h2 className='discover-topic'>Finalize Your Place</h2>
              <p className='discover-para'>
                Book an appointment and directly contact the landlord to have a virtual tour of property. <br />
                Once you get all the details regarding the rent, surrounding area, and other relevant information <br />
                you want to know, finalize your property.
              </p>
            </div>
          </div>
          <br />

          <div className='discover'>
            <img src="./paperwork1.png" alt="" />
            <div className='content'>
              <h2 className='discover-topic'>Get Your Paperwork Done</h2>
              <p className='discover-para'>
                After finalizing your property with the landlord, we'll start the paperwork for you. <br />
                Paperwork includes signing of your agreement and etc. It may involve payment for the 
                first month (or first few months) which is the "key money" and other charges like application fees.
              </p>
            </div>
          </div>
          <br />

          <div className='discover'>
            <img src="./booked1.png" alt="" />
            <div className='content'>
              <h2 className='discover-topic'>Your Property Is Booked</h2>
              <p className='discover-para'>
                Your property is successfully booked. <br />
                Now you can sit back prepare for your move out!
              </p>
            </div>
          </div>
          <br /><br /><br />
        </div>

        <div className='getin-touch'>
          <h1>Get in Touch</h1>
          <h3>If you have any queries, feel free to reach us!</h3>

          <div className='contact-cards mt-5'>
            <div className='row'>
              <div className='col-12 col-sm-6 col-md-3 mb-4'>
                <div className='call-card'>
                  <div className='call'>
                    <Phone size={80} color='black' />
                    <p> +94 76 676 0760 </p>
                  </div>
                </div>
              </div>

              <div className='col-12 col-sm-6 col-md-3 mb-4'>
                <div className='call-card'>
                  <div className='call'>
                    <Mail size={80} color='black' />
                    <a className='mail' href="mailto:boardm8te@gmail.com">
                        <p >Email Us</p>
                    </a>
                  </div>
                </div>
              </div>

              <div className='col-12 col-sm-6 col-md-3 mb-4'>
                <div className='call-card'>
                  <div className='call'>
                    <MessageCircle size={80} color="black" />
                    <p>Whatsapp</p>
                  </div>
                </div>
              </div>

              <div className='col-12 col-sm-6 col-md-3 mb-4'>
                <div className='call-card'>
                  <div className='call'>
                    <Text size={80} color="black" />
                    <p>Chat on platform</p>
                  </div>
                </div>
              </div>
            </div>
            <br /><br />
          </div> 

          <div className='reviews'>
            <div className='review-topic'>
              <h1>See What Students Say</h1>
              <p>The most trusted platform to book accommodation by students all over the country!</p>
            </div>
            <br />

            <div className='container mt-5'>
              <div className='row'>
                <div className='container2 col-12 col-sm-6 col-md-4 mb-4'>
                  <div className='review-list'>
                    <div className='review1'>
                      <p>
                        "Experience was amazing!! I'm going to Informatics Institute of Technology
                        and the rent and the locations are negotiable and affordable. This platform was
                        very effective and useful when finding the properties."
                        <br />
                      </p>

                      <div className='review-img'>
                        <img src="https://img.freepik.com/free-vector/illustration-businesswoman_53876-5857.jpg?t=st=1740762864~exp=1740766464~hmac=f34a02413c897beb5794a2f0caa2c96ce5a66d55124d96d6901fb07075f09207&w=900" alt="" />
                          <div className='info'>
                            <h4>Nicoline Fernando</h4>
                            <p>IIT</p>
                          </div>
                      </div>
                    </div>
                  </div>

                </div>


                <div className='col-12 col-sm-6 col-md-4 mb-4'>
                  <div className='review-list'>
                    <div className='review1'>
                      <p>
                        "The best service I could ask for as a Sri Lankan university student. 
                        Awesome, excellent follow-up services that assisted me from beginning to end. 
                        Thank you, BoardMate, for an excellent service!"
                        <br />
                      </p>

                      <div className='review-img'>
                        <img src="https://img.freepik.com/free-vector/illustration-businesswoman_53876-5857.jpg?t=st=1740762864~exp=1740766464~hmac=f34a02413c897beb5794a2f0caa2c96ce5a66d55124d96d6901fb07075f09207&w=900" alt="" />
                          <div className='info'>
                            <h4>Nehashi Peiris</h4>
                            <p>IIT</p>
                          </div>
                      </div>
                    </div>
                  </div>

                </div>

                <div className='col-12 col-sm-6 col-md-4 mb-4'>
                  <div className='review-list'>
                    <div className='review1'>
                      <p>
                        "I am going to study at IIT and I live far away from Colombo. 
                        Finding an accommodation from around the university was a big challenge but 
                        thanks to BoardMate, I was able to find a reliable place in a short time. 
                        The best platform to find properties for university students"
                        <br />
                      </p>

                      <div className='review-img'>
                        <img src="https://img.freepik.com/free-vector/illustration-businesswoman_53876-5857.jpg?t=st=1740762864~exp=1740766464~hmac=f34a02413c897beb5794a2f0caa2c96ce5a66d55124d96d6901fb07075f09207&w=900" alt="" />
                          <div className='info'>
                            <h4>Shehan Rajapaksha</h4>
                            <p>IIT</p>
                          </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              <br />
              <br /><br />

              <div className='review-button'>
                <button>
                  See More Reviews <b className='arrow'>→</b>
                </button>
              </div>
            </div>
          </div> 

        </div>

      </div>
  )
}

export default Support