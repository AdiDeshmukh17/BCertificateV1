import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BirthCertificate = () => {

  const API_URL = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fatherName: '',
    motherName: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    email: '',
    mobile1: '',
    mobile2: '',
    motherAadhar: '',
    birthDate: '',
    birthTime: '',
    gender: 'Boy',
    photo: null,
    doctorRemarks: ''
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData({ ...formData, photo: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    for (let key in formData) {
      if (!formData[key] && key !== 'photo' && key !== 'doctorRemarks') {
        alert(`Please fill in the ${key.replace(/([A-Z])/g, ' $1').trim()} field.`);
        return false;
      }
    }
    if (formData.motherAadhar.length !== 12 || !/^[0-9]{12}$/.test(formData.motherAadhar)) {
      alert('Aadhaar number must be exactly 12 digits.');
      return false;
    }
    return true;
  };

  const checkDuplicate = async (data) => {
    try {
      const response = await fetch(`${API_URL}/api/check-duplicate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          motherName: data.motherName,
          fatherName: data.fatherName,
          birthDate: data.birthDate
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        alert(result.message);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error checking duplicate:', error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    const isDuplicate = await checkDuplicate(formData);

    if (!isDuplicate) return;

    try {
      const response = await fetch(`${API_URL}/api/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await response.json();
      alert(result.message);
    } catch (error) {
      alert('Error submitting data');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500 p-4">
      <div className="w-full max-w-lg">
        <form onSubmit={handleSubmit} className="relative bg-white p-8 rounded-2xl shadow-2xl mb-8 overflow-hidden">
          <h2 className="text-4xl font-bold text-blue-700 text-center mb-6">Birth Certificate Form</h2>

          {Object.keys(formData).map((key) => (
            key !== 'gender' && key !== 'photo' && key !== 'doctorRemarks' && (
              <input
                key={key}
                type={key.includes('Date') ? 'date' : key.includes('Time') ? 'time' : key.includes('email') ? 'email' : 'text'}
                name={key}
                placeholder={key.replace(/([A-Z])/g, ' $1').trim()}
                value={formData[key]}
                onChange={handleChange}
                className="w-full p-2 mb-4 border rounded"
              />
            )
          ))}

          <div className="mb-4">
            <label className="mr-4">
              <input type="radio" name="gender" value="Boy" checked={formData.gender === 'Boy'} onChange={handleChange} /> Boy
            </label>
            <label>
              <input type="radio" name="gender" value="Girl" checked={formData.gender === 'Girl'} onChange={handleChange} /> Girl
            </label>
          </div>

          <label className="block mb-4">
            <span>Upload Photo (Optional)</span>
            <input type="file" name="photo" accept="image/*" onChange={handleChange} className="mt-2" />
          </label>

          <label className="block mb-4">
            <span>Doctor Remarks</span>
            <textarea name="doctorRemarks" value={formData.doctorRemarks} onChange={handleChange} className="mt-2 p-2 w-full border rounded" />
          </label>

          <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">Submit</button>
        </form>


          <button 
            onClick={() => navigate('/')} 
            className="w-full p-2 mt-4 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Back to Home
          </button>
              
      </div>
      

    </div>
  );
};

export default BirthCertificate;
