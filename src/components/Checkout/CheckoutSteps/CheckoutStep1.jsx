import Dropdown from "react-dropdown";
import { CartContext } from "pages/_app";
import { useContext, useEffect, useState } from "react";

const options = [
  { label: "Country 1", value: "country1" },
  { label: "Country 2", value: "country2" },
];
export const CheckoutStep1 = ({ onNext }) => {
  const { userDetails ,setUserDetails } = useContext(CartContext);

  const [addressDetail, setAddressDetail] = useState({
    address: "",
    pincode: "",
    city: "",
    state:"",
    country: "",
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
  });

  const changeHandler = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    const checkUser = localStorage.getItem("ecomm_user");

    if (checkUser) {
      var storedUserObject = JSON.parse(checkUser);

      const { firstName, lastName, email, phoneNumber  ,address } = storedUserObject;

      setFormData((prev) => ({
        ...prev,
        firstName: firstName,
        lastName: lastName,
        email: email,
        phoneNumber: phoneNumber,
      }));

      setAddressDetail((prev)=>({
        ...prev , 
        address: address?.addressLine , 
         pincode: address?.pincode , 
         city: address?.city , 
         country: address?.country
      
      }))
    }
  }, []);

  const handleAddressChange = (e) => {

    const { name, value } = e.target;
      setAddressDetail((prevAddressDetail) => ({
        ...prevAddressDetail,
        [name]: value,
      }));
  
  };

   const updateAddressHandler = async()=>{
    let token = localStorage.getItem("ecomm_userToken");

   try {
     const response = await fetch(
       "https://ecomm-backend-aopz.onrender.com/api/v1/updateAddress",
       {
         method: "PUT",
         headers: {
           "content-type": "application/json",
           Authorization: `Bearer ${token}`,
 
         },
         body: JSON.stringify(addressDetail),
        }
     );
 
     const formattedResponse = await response.json();
 
     if(formattedResponse.success){
      localStorage.removeItem("ecomm_user");
      var userObjectString = JSON.stringify(formattedResponse.userDetails);

      localStorage.setItem("ecomm_user" , userObjectString);
      setUserDetails(formattedResponse?.userDetails);

      alert("succesfuly Updated the address");
      onNext();
     }
     else{
      alert(formattedResponse.message);
     }

   } catch (error) {
     console.log(error);
   }
   }



  return (
    <>
      {/* <!-- BEING CHECKOUT STEP ONE -->  */}
      <div className="checkout-form">
        <form onClick={(e) => e.preventDefault()}>
          <div className="checkout-form__item">
            <h4>Info about you</h4>
            <div className="box-field">
              <input
                type="text"
                className="form-control"
                placeholder="Enter your name"
                value={formData.firstName}
                name="firstName"
                onChange={changeHandler}
              />
            </div>
            <div className="box-field">
              <input
                type="text"
                className="form-control"
                placeholder="Enter your last name"
                value={formData.lastName}
                name="lastName"
                onChange={changeHandler}
              />
            </div>
            <div className="box-field__row">
              <div className="box-field">
                <input
                  type="tel"
                  className="form-control"
                  placeholder="Enter your phone"
                  value={formData.phoneNumber}
                  name="phoneNumber"
                  onChange={changeHandler}
                />
              </div>
              <div className="box-field">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your mail"
                  value={formData.email}
                  name="email"
                  onChange={changeHandler}
                />
              </div>
            </div>
          </div>

          <div className="checkout-form__item">
            <h4>Delivery Info</h4>

            <select required name="country" className="select_box" value={addressDetail.country} onChange={handleAddressChange}>
              <option value="" disabled>
                Select an Country
              </option>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <div className="box-field__row">
            <div className="box-field">
                <input
                required
                  onChange={handleAddressChange}
                  name="state"
                  value={addressDetail.state}
                  type="text"
                  className="form-control"
                  placeholder="Enter the state"
                />
              </div>
              <div className="box-field">
                <input
                required
                  onChange={handleAddressChange}
                  name="city"
                  value={addressDetail.city}
                  type="text"
                  className="form-control"
                  placeholder="Enter the city"
                />
              </div>
              <div className="box-field">
                <input
                required
                  onChange={handleAddressChange}
                  name="address"
                  value={addressDetail.address}
                  type="text"
                  className="form-control"
                  placeholder="Enter the address"
                />
              </div>
            </div>
            <div className="box-field__row">
              <div className="box-field">
                <input
                  onChange={handleAddressChange}
                  value={addressDetail.pincode}
                  name="pincode"
              
                  type="number"
                  required
                  className="form-control"
                  placeholder="pincode"
                />
              </div>
            </div>
          </div>
          <div className="checkout-form__item">
            <h4>Note</h4>
            <div className="box-field box-field__textarea">
              <textarea
                className="form-control"
                placeholder="Order note"
              ></textarea>
            </div>
            <label className="checkbox-box checkbox-box__sm">
              <input type="checkbox" />
              <span className="checkmark"></span>
              Create an account
            </label>
          </div>
          <div className="checkout-buttons">
            <button className="btn btn-grey btn-icon">
              {" "}
              <i className="icon-arrow"></i> back
            </button>
            <button onClick={()=>{
              if(addressDetail.address !== "" && addressDetail.pincode !=="" && addressDetail.city !== "" && addressDetail.country !== ""){
            updateAddressHandler();
              }
              else{
                alert("please fill the all address details")
              }
            }} className="btn btn-icon btn-next">
              next <i className="icon-arrow"></i>
            </button>
          </div>
        </form>
      </div>
      {/* <!-- CHECKOUT STEP ONE EOF -->  */}
    </>
  );
};
