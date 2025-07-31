import React from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAmbulance,
  faHeartbeat,
  faShieldAlt,
  faTachometerAlt,
  faStar,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "../components/Navbar";

// Custom Styles for Modern Look
const styles = `
  .glass-card {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    border-radius: 1.5rem;
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    padding: 2rem;
  }
  .section-divider {
    width: 100px;
    height: 4px;
    background: linear-gradient(to right, #EF4444, #F97316);
    margin: 1rem auto;
    border-radius: 2px;
  }
  .bg-gradient {
    background: linear-gradient(135deg, #f5f7fa 0%, #e5e7eb 100%);
    position: relative;
    overflow: hidden;
  }
  .bg-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.05);
    z-index: 0;
  }
  .hover-scale {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .hover-scale:hover {
    transform: scale(1.03);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  }
`;

const AboutUs = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient relative">
      <style>{styles}</style>
      <div className="bg-overlay"></div>
      <Navbar />
      <div className="flex-1 py-16 px-6 relative z-10">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-teal-900 mb-4 mt-8">
            About Us
          </h1>
          <div className="section-divider"></div>
          <p className="text-gray-700 text-lg mt-4 max-w-2xl mx-auto">
            Saving lives through rapid response and innovative technology.
          </p>
        </motion.div>

        {/* Mission and History Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glass-card text-center hover-scale"
          >
            <FontAwesomeIcon
              icon={faAmbulance}
              className="text-red-500 text-4xl mb-4"
            />
            <h2 className="text-2xl font-bold text-teal-800 mb-2">Our Mission</h2>
            <p className="text-gray-700">
              To deliver fast, reliable emergency transport, ensuring every second counts. We strive to connect those in need with life-saving care through cutting-edge technology and dedicated teams.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="glass-card text-center hover-scale"
          >
            <FontAwesomeIcon
              icon={faHeartbeat}
              className="text-red-500 text-4xl mb-4"
            />
            <h2 className="text-2xl font-bold text-teal-800 mb-2">Our History</h2>
            <p className="text-gray-700">
              Founded to revolutionize ambulance dispatch, we blend advanced technology with Police Verification, compassion, serving communities with over 1,000 successful missions.
            </p>
          </motion.div>
        </div>

        {/* Our Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <div className="glass-card text-center">
            <h2 className="text-3xl font-bold text-teal-800 mb-6">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4">
                <FontAwesomeIcon
                  icon={faShieldAlt}
                  className="text-red-500 text-3xl mb-2"
                />
                <h3 className="text-xl font-semibold text-teal-800 mb-2">Safety</h3>
                <p className="text-gray-700">
                  Prioritizing the safety of every individual we serve.
                </p>
              </div>
              <div className="p-4">
                <FontAwesomeIcon
                  icon={faTachometerAlt}
                  className="text-red-500 text-3xl mb-2"
                />
                <h3 className="text-xl font-semibold text-teal-800 mb-2">Speed</h3>
                <p className="text-gray-700">
                  Delivering rapid responses to save critical time.
                </p>
              </div>
              <div className="p-4">
                <FontAwesomeIcon
                  icon={faStar}
                  className="text-red-500 text-3xl mb-2"
                />
                <h3 className="text-xl font-semibold text-teal-800 mb-2">Compassion</h3>
                <p className="text-gray-700">
                  Offering care with empathy and dedication.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Our Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <div className="glass-card text-center">
            <h2 className="text-3xl font-bold text-teal-800 mb-6">Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-gray-300 mb-2"></div>
                <h3 className="text-xl font-semibold text-teal-800">Dr. Jerome</h3>
                <p className="text-gray-700">Chief Medical Officer</p>
              </div>
              <div className="p-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-gray-300 mb-2"></div>
                <h3 className="text-xl font-semibold text-teal-800">Job Suny</h3>
                <p className="text-gray-700">Operations Director</p>
              </div>
              <div className="p-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-gray-300 mb-2"></div>
                <h3 className="text-xl font-semibold text-teal-800">Emmauel Bowne</h3>
                <p className="text-gray-700">Tech Lead</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Our Impact Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <div className="glass-card text-center">
            <h2 className="text-3xl font-bold text-teal-800 mb-6">Our Impact</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4">
                <p className="text-3xl font-bold text-red-500 mb-2">1,000+</p>
                <p className="text-gray-700">Missions Completed</p>
              </div>
              <div className="p-4">
                <p className="text-3xl font-bold text-red-500 mb-2">2.5 min</p>
                <p className="text-gray-700">Average Response Time</p>
              </div>
              <div className="p-4">
                <p className="text-3xl font-bold text-red-500 mb-2">99%</p>
                <p className="text-gray-700">Success Rate</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Back to Top Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="fixed bottom-8 right-8"
        >
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="bg-teal-600 hover:bg-teal-700 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300"
          >
            <FontAwesomeIcon icon={faChevronUp} className="text-xl" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUs;