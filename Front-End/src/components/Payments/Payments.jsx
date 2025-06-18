import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import Tesseract from "tesseract.js";
import "./Payments.css";
import "bootstrap/dist/css/bootstrap.min.css";
import useAuthStore from '../../store/auth-store';
import apiService from '../../services/api-service';

function Payments() {
  const { id } = useParams();
  const navigate = useNavigate();
  const propertyId = Number.parseInt(id);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [paymentStep, setPaymentStep] = useState("paymentMethod");
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [isCardDetailsVisible, setIsCardDetailsVisible] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [image, setImage] = useState(null);
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);


  const { user, isAuthenticated } = useAuthStore();
  const [verificationDetails, setVerificationDetails] = useState({
    bankName: false,
    date: false,
    amount: false,
    accountNumber: false,
    isSlip: false,
  });

  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const handleProceedToPay = () => {
    if (!isAuthenticated || !user) {
      alert("Please log in to proceed with payment.");
      return;
    }
    setIsPopupOpen(true);
  };

  const handleClosePopUp = () => {
    setIsPopupOpen(false);
    setVerificationResult(null);
    setVerificationDetails({
      bankName: false,
      date: false,
      amount: false,
      accountNumber: false,
      isSlip: false,
    });
    if (paymentSuccess) {
      navigate('/profile');
    }
  };


  const handleMethodSelect = (methodId) => {
    setSelectedMethod(methodId)
    setImage(null)
    setIsImageUploaded(false)
    setCardDetails({
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    });
    setVerificationResult(null);

    setVerificationDetails({
      bankName: false,
      date: false,
      amount: false,
      accountNumber: false,
      isSlip: false,
    });
  };


  const handleCardDetailsChange = (e) => {
    const { name, value } = e.target;

    if (name === "cardNumber") {
      const sanitizedValue = value.replace(/[^0-9]/g, "").slice(0, 16);
      const formattedValue = sanitizedValue.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
      setCardDetails(prev => ({ ...prev, [name]: formattedValue }));
    } else if (name === "expiryDate") {
      let sanitizedValue = value.replace(/[^0-9]/g, "").slice(0, 4);
      if (sanitizedValue.length > 2) {
        sanitizedValue = sanitizedValue.slice(0, 2) + "/" + sanitizedValue.slice(2);
      }
      setCardDetails(prev => ({ ...prev, [name]: sanitizedValue }));
    } else if (name === "cvv") {
      const sanitizedValue = value.replace(/[^0-9]/g, "").slice(0, 4);
      setCardDetails(prev => ({ ...prev, [name]: sanitizedValue }));
    }
  };

  const handleCardDetailsSubmit = () => {

    // Validation before submission
    if (!cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvv) {
      alert("Please fill all the fields")
      return
    }

    if (!cardDetails.cardNumber || cardDetails.cardNumber.replace(/\s/g, "").length < 13) {
      alert("Please enter a valid card number");
      return;
    }

    if (!cardDetails.expiryDate || !cardDetails.expiryDate.includes("/")) {
      alert("Please enter a valid expiry date in MM/YY format");
      return;
    }

    const [month, year] = cardDetails.expiryDate.split("/");
    const expiryDate = new Date(2000 + Number.parseInt(year), Number.parseInt(month) - 1);
    const currentDate = new Date();

    if (expiryDate < currentDate) {
      alert("The card has expired. Please use a valid card.");
      return;
    }

    if (!cardDetails.cvv || cardDetails.cvv.length < 3) {
      alert("Please enter a valid CVV");
      return;
    }

    setPaymentStep("paymentSuccess");
    setPaymentSuccess(true);
    handlePaymentSuccess();
  };

  const handlePayNowClick = () => {
    if (selectedMethod === "visa" || selectedMethod === "mastercard" || selectedMethod === "amex") {
      setPaymentStep("cardDetails");
    } else if (selectedMethod === "bank") {
      setPaymentStep("uploadBankImage");
    }
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {

      setImage(URL.createObjectURL(file));
      setIsImageUploaded(true);
      setVerificationResult(null);

      setVerificationDetails({
        bankName: false,
        date: false,
        amount: false,
        accountNumber: false,
        isSlip: false,
      });
    }
  }

  const verifyBankSlip = async () => {
    if (!image) {
      alert("Please upload an image to verify.");
      return;
    }

    setIsVerifying(true);
    setVerificationResult(null);

    try {
      const result = await Tesseract.recognize(
        image,
        "eng",
        { logger: (info) => console.log(info) }
      );

      const text = result.data.text.toLowerCase();
      console.log("Extracted text:", text);

      const hasBankName = /Bank|HSBC|Commercial|Sampath|Peoples|BOC|HNB|DFCC|Cargills|Seylan|Nations Trust/i.test(text);
      const hasDate = /\d{1,2}[/\-.]\d{1,2}[/\-.]\d{2,4}|\d{1,2}(?:st|nd|rd|th)?\s(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i.test(text);
      const hasAmount = /amount|rs\.?|Rs.|Total|sum|Cash|Coins|PAID|payment/i.test(text) && /\d+(?:\.\d{2})?/i.test(text);
      const hasAccountNumber = /acc(?:ount)?\s*(?:No|number|#)?[\s:.]?\s*\d+/i.test(text);
      const isLikelySlip = /receipt|Computer Validation|Signature|Depositor|Name|Transaction|Payment|Deposit|Transfer|Slip|reference|ref|Confirmation/i.test(text);

      const details = {
        bankName: hasBankName,
        date: hasDate,
        amount: hasAmount,
        accountNumber: hasAccountNumber,
        isSlip: isLikelySlip,
      };

      setVerificationDetails(details);
      const verificationScore = Object.values(details).filter(Boolean).length / Object.values(details).length;
      const passes = verificationScore >= 0.6;

      setVerificationResult({
        passes,
        score: Math.round(verificationScore * 100),
        message: passes
          ? "Verification successful! This appears to be a valid bank slip."
          : "Verification failed. This doesn't appear to be a valid bank slip or is missing key information.",
      });

      if (passes) {
        setTimeout(() => {
          setPaymentStep("paymentSuccess");
          setPaymentSuccess(true);
          handlePaymentSuccess();
        }, 2000);
      }
    } catch (error) {
      console.error("Error during OCR:", error);
      setVerificationResult({
        passes: false,
        score: 0,
        message: "Error during verification. Please try again with a clearer image.",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handlePaymentSuccess = async () => {
    if (!property || !user) {
      alert("Property or user information is missing.");
      return;
    }

    const paymentData = {
      userId: user.id,
      propertyId: property.id,
      propertyName: property.title,
      propertyAddress: property.address,
      propertyContact: property.contactNumber,
      bookingDate: new Date().toLocaleDateString("en-CA"),
      price: property.price,
    };

    try {
      const response = await apiService.post('/payments', paymentData);
      if (response.status === 200 || response.status === 201) {
        localStorage.setItem('bookedProperty', JSON.stringify(property));
        console.log("Payment recorded successfully!");
      }
    } catch (error) {
      console.error("Error saving payment:", error);
      alert("An error occurred while saving the payment.");
    }
  };

  const paymentMethods = {
    "Credit/Debit Card": [
      {
        id: "visa",
        name: "Visa",
        icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Visa_2021.svg/1200px-Visa_2021.svg.png",
      },
      {
        id: "mastercard",
        name: "Mastercard",
        icon: "https://www.pngplay.com/wp-content/uploads/12/Visa-Card-Logo-No-Background.png",
      },
      {
        id: "amex",
        name: "American Express",
        icon: "https://www.citypng.com/public/uploads/preview/hd-amex-american-express-logo-png-701751694708970jttzjjyo6e.png",
      },
    ],
    "Mobile Wallet": [
      { id: "genie", name: "Genie", icon: "https://www.genie.lk/wp-content/uploads/2021/03/genie-logo.png" },
      {
        id: "ezcash",
        name: "Ez Cash",
        icon: "https://yt3.googleusercontent.com/eJyvaQmKtG_F-8JC6qJLIjcfHzyIwD0O5bOnmfZP0ed2XjbCiPJfPHPqL9FGlbvw7942CBar=s900-c-k-c0x00ffffff-no-rj",
      },
      {
        id: "mcash",
        name: "mCash",
        icon: "https://play-lh.googleusercontent.com/vJsVOZbuNfKbLshcBmxIQaisdkI_8isieqkXhtxuqnr-PKnc53v-8GwdzgaI53P8_lA",
      },
      {
        id: "frimi",
        name: "FriMi",
        icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_ys1jHPlXUOGwBhVXQQIwYt5VgmQmteZDCA&s",
      },
    ],
   
    "Bank Transfer": [
      {
        id: "bank",
        name: "Bank Transfer",
        icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDnE_apx1xxwayXZulkEHC_PLDeU9MTmXz-LxwGNP5jvX49oXDvgcBO-0hgLac2D0mrnA&usqp=CAU",
      },
    ],
  };


  const generateOrderId = () => {
    const uniqueOrderId = `ORDER-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    setOrderId(uniqueOrderId);
  };

  useEffect(() => {
    generateOrderId()
  }, [])

  // Fetch property details from the backend
  useEffect(() => {
    const fetchPropertyDetails = async () => {
      setLoading(true);
      try {
        const response = await apiService.get(`/properties/${propertyId}`);
        setProperty(response.data);
      } catch (error) {
        console.error("Error fetching property details:", error);
        alert("Failed to load property details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (propertyId) {
      fetchPropertyDetails();
    }
  }, [propertyId]);


  return (
    <div
      className={`container d-flex justify-content-center align-items-center min-vh-100 ${isPopupOpen ? "blur-background" : ""}`}
    >
      <div className="card shadow p-4 text-center w-75" id="payments-container">
        <h2 className="mb-3">Your Booking Details Are As Follows:</h2>
        {loading ? (
          <div className="d-flex justify-content-center">
            <Loader2 className="animate-spin h-6 w-6" />
            <span className="ml-2">Loading property details...</span>
          </div>
        ) : property ? (
          <>
            <h2 className="prop-name">{property.title}</h2>
            <h4>Price: {property.price}</h4>

            <h4>Location: <span>{property.location}</span></h4>

            {/* Update the Proceed to Pay button to check if user is logged in */}
            
            <button
              className="btn mt-3 w-50 btn-primary"
              onClick={handleProceedToPay}
              disabled={!isAuthenticated || !user}
            >
              {isAuthenticated && user ? "Proceed To Pay" : "Please Log In to Continue"}
            </button>

            {(!isAuthenticated || !user) && (
              <div className="alert alert-warning mt-3">
                You need to be logged in to make a payment. Please log in and try again.
              </div>
            )}
          </>
        ) : (
          <div className="alert alert-danger">
            Failed to load property details. Please refresh the page or try again later.
          </div>
        )}
      </div>


      {/* PayHere Payment Popup */}

      {isPopupOpen && property && user && (
        <div className="payhere-popup-overlay">
          <div className="payhere-popup-container">
            <div className="payhere-popup">
              <div className="payhere-header">
                <div className="payhere-logo-wrapper">
                  <img
                    src="https://payherestorage.blob.core.windows.net/payhere-resources/www/images/PayHere-Logo.png"
                    alt="PayHere"
                    className="payhere-logo"
                  />
                </div>
                <div className="payhere-merchant-info">
                  <div className="merchant-name">{property.title}</div>

                  <div className="order-id">Order ID: {orderId}</div>
                  <div className="amount">Rs. {property.price}</div>
                </div>
                <button className="close-btn" onClick={handleClosePopUp}>X</button>
              </div>

              <div className="payhere-body">
                {paymentStep === "paymentMethod" && (
                  <>
                    <div className="payment-method-title">SELECT A PAYMENT METHOD</div>
                    {Object.entries(paymentMethods).map(([category, methods]) => (
                      <div key={category} className="payment-category">
                        <div className="category-title">{category}</div>
                        <div className="payment-methods-row">
                          {methods.map((method) => (
                            <div
                              key={method.id}
                              className={`payment-method-item ${selectedMethod === method.id ? "selected" : ""}`}
                              onClick={() => handleMethodSelect(method.id)}
                            >
                              <img src={method.icon || "/placeholder.svg"} alt={method.name} className="payment-icon" />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </>
                )}

                {paymentStep === "cardDetails" && (
                  <div className="card-details-form">
                    <div className="form-group">
                      <label htmlFor="cardNumber">Card Number</label>
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        value={cardDetails.cardNumber}
                        onChange={handleCardDetailsChange}
                        required
                        placeholder="Enter your card number"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="expiryDate">Expiration Date</label>
                      <input
                        type="text"
                        id="expiryDate"
                        name="expiryDate"
                        value={cardDetails.expiryDate}
                        onChange={handleCardDetailsChange}
                        required
                        placeholder="MM/YY"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="cvv">CVV</label>
                      <input
                        type="text"
                        id="cvv"
                        name="cvv"
                        value={cardDetails.cvv}
                        onChange={handleCardDetailsChange}
                        required
                        placeholder="Enter your CVV"
                      />
                    </div>
                    <div className="payhere-actions mt-4">
                      <button className="btn btn-success payhere-pay-btn" onClick={handleCardDetailsSubmit}>
                        Submit Payment
                      </button>
                    </div>
                  </div>
                )}

                {paymentStep === "uploadBankImage" && (
                  <div className="upload-image-section">
                    <h4>Upload Bank Transfer Proof</h4>
                    <p className="text-muted">Please upload a clear image of your bank slip or transfer confirmation</p>
                    <input type="file" onChange={handleImageUpload} accept="image/*" className="form-control mb-3" />
                    {image && (
                      <div className="uploaded-image-container mb-3">
                        <img
                          src={image}
                          alt="Bank Transfer Proof"
                          className="uploaded-image img-fluid"
                          style={{ maxHeight: "200px" }}
                        />
                      </div>
                    )}
                    {isVerifying && (
                      <div className="verification-loading text-center mb-3">
                        <Loader2 className="animate-spin h-6 w-6 mx-auto mb-2" />
                        <p>Verifying your bank slip...</p>
                      </div>
                    )}
                    {verificationResult && (
                      <div className={`verification-result mb-3 p-3 rounded ${verificationResult.passes ? "bg-success bg-opacity-10" : "bg-danger bg-opacity-10"}`}>
                        <div className="d-flex align-items-center mb-2">
                          {verificationResult.passes ? (
                            <CheckCircle className="text-success me-2" />
                          ) : (
                            <AlertCircle className="text-danger me-2" />
                          )}
                          <h5 className="mb-0">
                            {verificationResult.passes ? "Verification Successful" : "Verification Failed"}
                          </h5>
                        </div>
                        <p>{verificationResult.message}</p>
                        <div className="verification-details">
                          <p className="mb-1">Verification Score: {verificationResult.score}%</p>
                          <div className="verification-checks">
                            <div className={`check-item ${verificationDetails.bankName ? "text-success" : "text-danger"}`}>
                              {verificationDetails.bankName ? "✓" : "✗"} Bank name detected
                            </div>
                            <div className={`check-item ${verificationDetails.date ? "text-success" : "text-danger"}`}>
                              {verificationDetails.date ? "✓" : "✗"} Date detected
                            </div>
                            <div className={`check-item ${verificationDetails.amount ? "text-success" : "text-danger"}`}>
                              {verificationDetails.amount ? "✓" : "✗"} Amount detected
                            </div>
                            <div className={`check-item ${verificationDetails.accountNumber ? "text-success" : "text-danger"}`}>
                              {verificationDetails.accountNumber ? "✓" : "✗"} Account number detected
                            </div>
                            <div className={`check-item ${verificationDetails.isSlip ? "text-success" : "text-danger"}`}>
                              {verificationDetails.isSlip ? "✓" : "✗"} Appears to be a bank slip
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <button className="btn btn-primary" onClick={verifyBankSlip} disabled={!image || isVerifying}>
                      {isVerifying ? "Verifying..." : "Verify Bank Slip"}
                    </button>
                  </div>
                )}

                {paymentStep === "paymentSuccess" && (
                  <div className="payment-success">
                    <div className="success-icon">
                      <img src="https://www.pngall.com/wp-content/uploads/9/Green-Tick-No-Background.png" alt="" />
                    </div>
                    <h3>Payment Successful!</h3>
                    <p className="success-message">Your payment has been processed successfully.</p>
                    <button onClick={handleClosePopUp} className="btn btn-primary">
                      Close
                    </button>
                  </div>
                )}

                {paymentStep === "paymentMethod" && (
                  <div className="payhere-actions mt-4">
                    <button
                      className="btn btn-success payhere-pay-btn"
                      disabled={!selectedMethod}
                      onClick={handlePayNowClick}
                    >
                      Pay Now
                    </button>
                  </div>
                )}
              </div>

              <div className="payhere-footer">
                <div className="secured-by">
                  <span>Secured by</span>
                  <img
                    src="https://payherestorage.blob.core.windows.net/payhere-resources/www/images/PayHere-Logo.png"
                    alt="PayHere"
                    className="payhere-footer-logo"
                  />
                </div>
                <div className="central-bank-text">Central Bank approved Secure Payment Gateway Service</div>
              </div>
              <br />
              <br />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;