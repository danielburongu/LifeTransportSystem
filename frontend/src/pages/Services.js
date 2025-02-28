import React from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHospital,
  faCar,
  faShieldAlt,
  faQrcode,
  faPhone,
  faHospitalUser,
  faClock,
  faCheckCircle,
  faMapMarkedAlt,
  faExclamationTriangle,
  faMapMarkerAlt,
  faListAlt,
  faTag,
  faUserInjured,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const Services = () => {
  const services = [
    {
      icon: faHospital,
      heading: "Medical Transport",
      text: "Fast, reliable transport to hospitals during emergencies.",
    },
    {
      icon: faCar,
      heading: "Accident & Injury Response",
      text: "Rapid aid for accidents and injuries with expert teams.",
    },
    {
      icon: faShieldAlt,
      heading: "24/7 Police Assistance",
      text: "Constant police support for any emergency situation.",
    },
  ];

  const processSteps = [
    {
      icon: faQrcode,
      heading: "Step 1: Submit Alert",
      text: "Send an alert via QR code or quick call.",
    },
    {
      icon: faPhone,
      heading: "Step 2: Police Respond",
      text: "Police verify and dispatch help to your location.",
    },
    {
      icon: faHospitalUser,
      heading: "Step 3: Hospital Prepares",
      text: "Hospitals get ready for your arrival.",
    },
  ];

  const additionalFeatures = [
    {
      icon: faClock,
      heading: "Instant Coordination",
      text: "Links police, hospitals, and drivers seamlessly.",
    },
    {
      icon: faCheckCircle,
      heading: "Live Status Updates",
      text: "Follow your emergency’s progress in real time.",
    },
  ];

  const requestProcess = [
    {
      icon: faExclamationTriangle,
      heading: "Request Help",
      text: "Report emergencies with victim details via app.",
    },
    {
      icon: faMapMarkerAlt,
      heading: "Locate Instantly",
      text: "Use GPS to share your exact position quickly.",
    },
  ];

  const trackingFeatures = [
    {
      icon: faListAlt,
      heading: "Track Your Requests",
      text: "See all your emergency requests at a glance.",
    },
    {
      icon: faTag,
      heading: "Select Emergency Type",
      text: "Pick accident, medical, fire, or other for tailored aid.",
    },
  ];

  const mockRequests = [
    {
      type: "Accident",
      status: "pending",
      location: "123 Portbell St",
      time: "Today, 10:30 AM",
    },
    {
      type: "Medical",
      status: "verified",
      location: "456 Acacia Ave",
      time: "Today, 11:15 AM",
    },
    {
      type: "Fire",
      status: "dispatched",
      location: "789 Lugard Rd",
      time: "Today, 12:00 PM",
    },
  ];

  const statusStyles = {
    pending: "bg-yellow-500 text-white",
    verified: "bg-blue-500 text-white",
    dispatched: "bg-teal-500 text-white",
    completed: "bg-green-500 text-white",
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex-1 py-16">
        <div className="container mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-teal-700 mb-4 mt-6">
              Discover Our Services
            </h1>
            <div className="w-24 h-1 bg-red-600 mx-auto"></div>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Life Transport: Swift, reliable emergency solutions.
            </p>
          </motion.div>

          {/* Services Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {services.map(({ icon, heading, text }, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center"
                whileHover={{ y: -5 }}
              >
                <FontAwesomeIcon icon={icon} className="text-red-600 text-3xl mb-3" />
                <h3 className="text-xl font-bold text-teal-700 mb-2">{heading}</h3>
                <p className="text-gray-600 text-center text-sm">{text}</p>
              </motion.div>
            ))}
          </div>

          {/* Police Accident Verification Process Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-teal-700 mb-4">
              How We Respond
            </h2>
            <div className="w-24 h-1 bg-red-600 mx-auto"></div>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Our streamlined process for rapid emergency action.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {processSteps.map(({ icon, heading, text }, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.15 + 0.45 }}
                className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center"
                whileHover={{ y: -5 }}
              >
                <FontAwesomeIcon icon={icon} className="text-red-600 text-3xl mb-3" />
                <h3 className="text-lg font-bold text-teal-700 mb-2">{heading}</h3>
                <p className="text-gray-600 text-center text-sm">{text}</p>
              </motion.div>
            ))}
          </div>

          {/* Hospital Command Center Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-teal-700 mb-4">
              Hospital Command Hub
            </h2>
            <div className="w-24 h-1 bg-red-600 mx-auto"></div>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Ready hospitals, coordinating arrivals in real time.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {additionalFeatures.map(({ icon, heading, text }, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.15 + 0.75 }}
                className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center"
                whileHover={{ y: -5 }}
              >
                <FontAwesomeIcon icon={icon} className="text-red-600 text-3xl mb-3" />
                <h3 className="text-lg font-bold text-teal-700 mb-2">{heading}</h3>
                <p className="text-gray-600 text-center text-sm">{text}</p>
              </motion.div>
            ))}
          </div>

          {/* Emergency Request Process Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-teal-700 mb-4">
              Citizen Control Panel
            </h2>
            <div className="w-24 h-1 bg-red-600 mx-auto"></div>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Easy tools to manage your emergency needs.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {requestProcess.map(({ icon, heading, text }, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.15 + 1.05 }}
                className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center"
                whileHover={{ y: -5 }}
              >
                <FontAwesomeIcon icon={icon} className="text-red-600 text-3xl mb-3" />
                <h3 className="text-lg font-bold text-teal-700 mb-2">{heading}</h3>
                <p className="text-gray-600 text-center text-sm">{text}</p>
              </motion.div>
            ))}
          </div>

          {/* Live Map Feature */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-teal-700 mb-4">
              Real-Time Map
            </h2>
            <div className="w-24 h-1 bg-red-600 mx-auto"></div>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Watch your location and responders live with GPS precision.
            </p>
            <div className="mt-6 bg-gray-300 h-48 rounded-2xl flex items-center justify-center">
              <FontAwesomeIcon icon={faMapMarkedAlt} className="text-teal-700 text-5xl" />
              <p className="ml-3 text-gray-600 text-sm">Map access after sign-up!</p>
            </div>
          </motion.div>

          {/* Tracking and Selection Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.35 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-teal-700 mb-4">
              Emergency Dashboard
            </h2>
            <div className="w-24 h-1 bg-red-600 mx-auto"></div>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Monitor and customize your emergency response.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {trackingFeatures.map(({ icon, heading, text }, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.15 + 1.5 }}
                className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center"
                whileHover={{ y: -5 }}
              >
                <FontAwesomeIcon icon={icon} className="text-red-600 text-3xl mb-3" />
                <h3 className="text-lg font-bold text-teal-700 mb-2">{heading}</h3>
                <p className="text-gray-600 text-center text-sm">{text}</p>
              </motion.div>
            ))}
          </div>

          {/* Mock Request Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.65 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-teal-700 mb-4">
              Sample Emergency Tracking
            </h2>
            <div className="w-24 h-1 bg-red-600 mx-auto"></div>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Preview how your requests look in action.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {mockRequests.map(({ type, status, location, time }, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.15 + 1.8 }}
                className="bg-white p-4 rounded-2xl shadow-lg flex flex-col items-start"
                whileHover={{ y: -5 }}
              >
                <div className="flex justify-between w-full mb-2">
                  <h3 className="text-lg font-bold text-teal-700">{type}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusStyles[status]}`}>
                    {status.toUpperCase()}
                  </span>
                </div>
                <p className="text-gray-600 text-sm flex items-center mb-1">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-red-600 mr-2" /> {location}
                </p>
                <p className="text-gray-600 text-sm flex items-center">
                  <FontAwesomeIcon icon={faClock} className="text-red-600 mr-2" /> {time}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Driver Assignment Teaser */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2.1 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-teal-700 mb-4">
              Skilled Driver Team
            </h2>
            <div className="w-24 h-1 bg-red-600 mx-auto"></div>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Expert drivers assigned instantly by hospitals.
            </p>
          </motion.div>

          {/* Call-to-Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2.25 }}
            className="text-center mb-12"
          >
            <p className="text-gray-600 mb-4">
              Join thousands relying on our life-saving services.
            </p>
            <Link to="/register">
              <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full text-lg font-bold transition-all duration-300 shadow-lg">
                Get Started
              </button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Services;