import { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import BirthCertify from './BirthCertify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Navigate, UNSAFE_NavigationContext, useNavigate } from 'react-router-dom';

function CertificateReturn() {
    const API_BASE = import.meta.env.VITE_API_URL;

    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('motherAadhar');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedCert, setSelectedCert] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [expandedId, setExpandedId] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);



    const handleSearch = async () => {
        let query = searchTerm;
        if (searchType === 'birthDate' && selectedDate) {
            query = selectedDate.toLocaleDateString('en-CA'); // Format as YYYY-MM-DD

        }
        if (!query) {
            setError('Please enter a search query.');
            return;
        }

        setLoading(true);
        setError('');
        setHasSearched(true);

        try {
            const response = await fetch(`${API_BASE}/api/search?type=${searchType}&query=${encodeURIComponent(query)}`);
            if (!response.ok) {
                throw new Error('Error fetching records');
            }
            const data = await response.json();

            if (data.length === 0) {
                setError('No records found.');
            }

            setResults(data.map(cert => ({
                ...cert,
                motherAadhar: String(cert.motherAadhar),
                birthDate: String(cert.birthDate),
                city: String(cert.city)
            })));
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col items-center p-8 bg-gradient-to-r from-blue-500 to-purple-600 min-h-screen text-white">
            <h1 className="text-3xl font-bold mb-6">Search Birth Certificates</h1>
            
        <div className="w-full max-w-md flex justify-end mb-4">
        <button
             onClick={() => navigate('/')}
             className="bg-red-500 text-white px-4 py-2 w-full max-w-md rounded-full hover:bg-red-600"
            >Back to Home
        </button>

            </div>
            
            <div className="flex items-center bg-white rounded-full shadow-lg p-2 w-full max-w-md mb-4">
                <select
                    className="p-2 border-r outline-none bg-gray-100 text-gray-700 rounded-l-full"
                    value={searchType}
                    onChange={(e) => { setSearchType(e.target.value); setSearchTerm(''); setSelectedDate(null); }}
                >
                    <option value="motherName">Mother Name</option>
                    <option value="motherAadhar">Mother Aadhaar</option>
                    <option value="birthDate">Birth Date</option>
                    <option value="city">City</option>
                </select>
                {searchType === 'birthDate' ? (
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        className="p-2 flex-grow outline-none text-gray-700"
                        placeholderText="Select Date"
                        dateFormat="yyyy-MM-dd"
                        showYearDropdown
                        showMonthDropdown
                        dropdownMode="select"
                    />
                ) : (
                    <input
                        type="text"
                        placeholder={`Enter ${searchType}...`}
                        className="p-2 flex-grow outline-none text-gray-700"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                )}
                <button onClick={handleSearch} className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700">
                    <Search size={20} />
                </button>
            </div>

            {loading && <p className="text-gray-200">Loading...</p>}
            {error && <p className="text-red-300">{error}</p>}

            <div className="mt-4 w-full max-w-lg">
                {hasSearched && results.length > 0 ? (
                    results.map((cert) => (
                        <div key={cert._id} className="border p-4 rounded-lg bg-white text-gray-900 shadow-md mb-3">
                            <div className="flex justify-between items-center cursor-pointer" 
                                onClick={() => {
                                    if (expandedId === cert._id) {
                                        setExpandedId(null);
                                        setSelectedCert(null);
                                    } else {
                                        setExpandedId(cert._id);
                                    }
                                }}>
                                <p className="font-semibold text-lg">{cert.motherName} - Baby {cert.gender}</p>
                                {expandedId === cert._id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </div>
                            
                            {expandedId === cert._id && (
                                <div className="mt-2">
                                    <p><strong>Mother Name:</strong> {cert.motherName}</p>
                                    <p><strong>Father Name:</strong> {cert.fatherName}</p>
                                    <p><strong>Mother Aadhaar:</strong> {cert.motherAadhar}</p>
                                    <p><strong>Birth Date:</strong> {cert.birthDate}</p>
                                    <p><strong>City:</strong> {cert.city}</p>
                                    <button className="bg-blue-500 text-white px-2 py-1 rounded mt-2" 
                                        onClick={() => setSelectedCert(cert)}>
                                        Download
                                    </button>
                                </div>
                            )}
                            {selectedCert && selectedCert._id === cert._id && (
                                <div className="mt-2">
                                    <BirthCertify data={selectedCert} />
                                </div>
                            )}
                        </div>
                    ))
                ) : hasSearched && (
                    <p className="text-gray-200">No records found.</p>
                )}
            
           
            </div>
        </div>
    );
}

export default CertificateReturn;
