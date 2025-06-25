
import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const BirthCertify = ({ data }) => {
    const certificateRef = useRef();

    const handleDownload = () => {
        const input = certificateRef.current;
        html2canvas(input, { scale: 2 }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save(`Birth_Certificate.pdf`);
        });
    };

    return (
        <div className="flex flex-col items-center justify-center p-4 bg-gray-100 min-h-screen">
            <div ref={certificateRef} className="relative bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg">
                <img
                    src="https://media-hosting.imagekit.io//2f6972ad7c5d4e7c/hospital-logo.jpg"
                    alt="Watermark"
                    className="absolute opacity-10 w-full h-full object-cover"
                />

                <div className="text-center mb-6 relative">
                    <h2 className="text-4xl font-bold text-blue-700">Birth Certificate</h2>
                </div>

                <p className="text-lg mb-2"><strong>Mother's Name:</strong> {data.motherName}</p>
                <p className="text-lg mb-2"><strong>Father's Name:</strong> {data.fatherName}</p>
                <p className="text-lg mb-2"><strong>Mother Aadhar No.:</strong> {data.motherAadhar}</p>
                <p className="text-lg mb-2"><strong>Birth Date:</strong> {data.birthDate}</p>
                <p className="text-lg mb-2"><strong>Birth Time:</strong> {data.birthTime}</p>
                <p className="text-lg mb-2"><strong>Gender:</strong> {data.gender}</p>
                <p className="text-lg mb-2"><strong>Address:</strong> {`${data.address}, ${data.city}, ${data.state}, ${data.pincode}`}</p>
                

                <div className="flex justify-between items-center mt-12">
                    <div>
                        <hr className="border-t-2 border-gray-400 w-40" />
                        <p className="text-gray-600 text-center">Hospital Seal</p>
                    </div>
                    <div>
                        <img src="/hospital-logo.png" alt="Seal" className="h-16" />
                    </div>
                    <div>
                        <hr className="border-t-2 border-gray-400 w-40" />
                        <p className="text-gray-600 text-center">Authorized Signature</p>
                    </div>
                </div>

                <p className="text-gray-500 mt-6 text-center">This is an official document confirming the birth details of the child.</p>
            </div>

            <button onClick={handleDownload} className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Download Certificate
            </button>
        </div>
    );
};

export default BirthCertify;
