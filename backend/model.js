import mongoose from 'mongoose';

const birthCertificateSchema = new mongoose.Schema({
  fatherName: String,
  motherName: String,
  address: String,
  city: String,
  state: String,
  pincode: String,
  email: String,
  mobile1: String,
  mobile2: String,
  motherAadhar: String,
  birthDate: String,
  birthTime: String,
  gender: String,
  doctorRemarks: String,
});

const BirthCertificate = mongoose.model('BirthCertificate', birthCertificateSchema);
export default BirthCertificate;
