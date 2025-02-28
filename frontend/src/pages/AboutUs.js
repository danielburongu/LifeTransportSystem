import React from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAmbulance, faHeartbeat } from "@fortawesome/free-solid-svg-icons";
import Navbar from "../components/Navbar";

const AboutUs = () => {
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
              About Us
            </h1>
            <div className="w-24 h-1 bg-red-600 mx-auto"></div>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Saving lives through rapid response and innovative technology.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white p-8 rounded-2xl shadow-lg"
            >
              <FontAwesomeIcon icon={faAmbulance} className="text-red-600 text-4xl mb-4" />
              <h2 className="text-2xl font-bold text-teal-700 mb-2">Our Mission</h2>
              <p className="text-gray-600">
                To deliver fast, reliable emergency transport, ensuring every second counts.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-white p-8 rounded-2xl shadow-lg"
            >
              <FontAwesomeIcon icon={faHeartbeat} className="text-red-600 text-4xl mb-4" />
              <h2 className="text-2xl font-bold text-teal-700 mb-2">Our History</h2>
              <p className="text-gray-600">
                Founded to revolutionize ambulance dispatch, we blend tech and compassion.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;