import { CartContext } from 'pages/_app';
import { useContext, useEffect, useState } from 'react';

export const CheckoutStep2 = ({ onPrev, onNext }) => {

  const [payment, setPayment] = useState('credit-card'); // Default payment method
  const [isDone, setIsDone] = useState(false); // For tracking completion (optional)
  const { cart, clearCart } = useContext(CartContext); // Get cart context data and clearCart function

  useEffect(() => {
    const loadRazorpayScript = async () => {
      if (!window.Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        script.onload = () => {
          console.log("Razorpay script loaded successfully.");
        };
        script.onerror = () => {
          console.error("Razorpay script failed to load.");
        };
      }
    };

    loadRazorpayScript();
  }, []); // This will only run once when the component mounts

  const paymentHandler = async () => {
    const products = cart.map(product => product._id); // Extract product IDs
    const token = localStorage.getItem("ecomm_userToken");

    try {
      // Make an API call to fetch payment details
      const response = await fetch("https://ecomm-backend-aopz.onrender.com/api/v1/payment/capturePayment", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ products }),
      });

      const formattedResponse = await response.json();

      if (formattedResponse.success) {
        let amount = formattedResponse.message.amount / 100; // Convert to proper currency amount

        const options = {
          key: "rzp_test_eAwoqbEXBt3CVM", // Razorpay test key
          amount: amount,
          currency: "INR",
    name: "Asit Mandal",
    description: "product transaction",
    order_id: formattedResponse?.message?.id,
          prefill: {
            name: "User's Name", // Dynamic data should replace this
            email: "user@example.com", // Dynamic email
            contact: "user_contact", // Dynamic contact number
          },
          notes: {
            address: "Razorpay Corporate Office", // Customize as needed
          },
          theme: {
            color: "#121212", // Customize color if needed
          },
          handler: function (response) {
            // On successful payment
            console.log("Payment successful:", response);
            clearCart(); // Clear cart when payment is successful
            onNext(); // Proceed to the next step after successful payment
          },
          modal: {
            ondismiss: function () {
              // If Razorpay popup is dismissed, clear the cart
              console.log("Razorpay popup dismissed.");
              clearCart(); // Clear cart when payment modal is closed
            }
          }
        };

        // Open Razorpay payment modal
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();

        paymentObject.on('payment.failed', function (response) {
          console.log("Payment failed:", response.error.description);
          clearCart(); // Clear cart if payment fails
          alert("Payment Failed: " + response.error.description);
        });
      } else {
        alert("Payment initialization failed!");
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("An error occurred while initializing payment.");
    }
  };

  return (
    <>
      <div className='checkout-payment checkout-form'>
        <h4>Payment Methods</h4>
        <div
          className={`checkout-payment__item ${
            payment === 'credit-card' && 'active'
          }`}
        >
          <div className='checkout-payment__item-head'>
            <label
              onChange={() => setPayment('credit-card')}
              className='radio-box'
            >
              Credit card
              <input
                type='radio'
                checked={payment === 'credit-card'}
                name='radio'
              />
              <span className='checkmark'></span>
              <span className='radio-box__info'>
                <i className='icon-info'></i>
                <span className='radio-box__info-content'>
                  Aliqua nulla id aliqua minim ullamco adipisicing enim. Do sint
                  nisi velit qui. Ullamco Lorem aliquip dolor nostrud cupidatat
                  amet.
                </span>
              </span>
            </label>
          </div>
          <div className='checkout-payment__item-content'>
            <div className='box-field'>
              <span>Card number</span>
              <input
                type='text'
                className='form-control'
                placeholder='xxxx xxxx xxxx xxxx'
                maxlength='16'
              />
            </div>
            <div className='box-field__row'>
              <div className='box-field'>
                <span>Expiration date</span>
                <input
                  type='text'
                  className='form-control'
                  placeholder='mm'
                  maxlength='2'
                />
              </div>
              <div className='box-field'>
                <input
                  type='text'
                  className='form-control'
                  placeholder='yy'
                  maxlength='2'
                />
              </div>
              <div className='box-field'>
                <span>Security code</span>
                <input
                  type='text'
                  className='form-control'
                  placeholder='CVV'
                  maxlength='3'
                />
              </div>
            </div>
          </div>
        </div>
        <div
          className={`checkout-payment__item ${
            payment === 'paypal' && 'active'
          }`}
        >
          <div className='checkout-payment__item-head'>
            <label onClick={() => setPayment('paypal')} className='radio-box'>
              PayPal
              <input type='radio' checked={payment === 'paypal'} name='radio' />
              <span className='checkmark'></span>
              <span className='radio-box__info'>
                <i className='icon-info'></i>
                <span className='radio-box__info-content'>
                  Aliqua nulla id aliqua minim ullamco adipisicing enim. Do sint
                  nisi velit qui. Ullamco Lorem aliquip dolor nostrud cupidatat
                  amet.
                </span>
              </span>
            </label>
          </div>
          <div className='checkout-payment__item-content'>
            <div className='box-field'>
              <span>Card number</span>
              <input
                type='text'
                className='form-control'
                placeholder='xxxx xxxx xxxx xxxx'
                maxlength='16'
              />
            </div>
            <div className='box-field__row'>
              <div className='box-field'>
                <span>Expiration date</span>
                <input
                  type='text'
                  className='form-control'
                  placeholder='mm'
                  maxlength='2'
                />
              </div>
              <div className='box-field'>
                <input
                  type='text'
                  className='form-control'
                  placeholder='yy'
                  maxlength='2'
                />
              </div>
              <div className='box-field'>
                <span>Security code</span>
                <input
                  type='text'
                  className='form-control'
                  placeholder='CVV'
                  maxlength='3'
                />
              </div>
            </div>
          </div>
        </div>
        <div
          className={`checkout-payment__item ${payment === 'cash' && 'active'}`}
        >
          <div className='checkout-payment__item-head'>
            <label onClick={() => setPayment('cash')} className='radio-box'>
              Cash payment
              <input type='radio' checked={payment === 'cash'} name='radio' />
              <span className='checkmark'></span>
              <span className='radio-box__info'>
                <i className='icon-info'></i>
                <span className='radio-box__info-content'>
                  Aliqua nulla id aliqua minim ullamco adipisicing enim. Do sint
                  nisi velit qui. Ullamco Lorem aliquip dolor nostrud cupidatat
                  amet.
                </span>
              </span>
            </label>
          </div>
        </div>

        <div className='checkout-buttons'>
          <button onClick={onPrev} className='btn btn-grey btn-icon'>
            <i className='icon-arrow'></i> back
          </button>
          <button onClick={paymentHandler} className='btn btn-icon btn-next'>
            next <i className='icon-arrow'></i>
          </button>
        </div>
      </div>
    </>
  );
};
