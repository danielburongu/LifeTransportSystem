import React from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faEnvelope, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import Navbar from "../components/Navbar";

const Contact = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex-1 py-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-teal-700 mb-4 mt-6">
              Contact Us
            </h1>
            <div className="w-24 h-1 bg-red-600 mx-auto"></div>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              We’re here to help, 24/7. Reach out for emergencies or inquiries.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white p-6 rounded-2xl shadow-lg text-center"
            >
              <FontAwesomeIcon icon={faPhone} className="text-red-600 text-3xl mb-4" />
              <h3 className="text-xl font-bold text-teal-700 mb-2">Phone</h3>
              <p className="text-gray-600">
                Emergency: 2300<br />
                Dispatch: 1-800-LIFE-RIDE
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-white p-6 rounded-2xl shadow-lg text-center"
            >
              <FontAwesomeIcon icon={faEnvelope} className="text-red-600 text-3xl mb-4" />
              <h3 className="text-xl font-bold text-teal-700 mb-2">Email</h3>
              <p className="text-gray-600">
                <a href="mailto:support@lifetransport.com" className="text-red-600 hover:underline">
                  support@lifetransport.com
                </a>
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="bg-white p-6 rounded-2xl shadow-lg text-center"
            >
              <FontAwesomeIcon icon={faMapMarkerAlt} className="text-red-600 text-3xl mb-4" />
              <h3 className="text-xl font-bold text-teal-700 mb-2">Address</h3>
              <p className="text-gray-600">
                Life Transport HQ<br />
                123 Kampala Road, City, 45
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;