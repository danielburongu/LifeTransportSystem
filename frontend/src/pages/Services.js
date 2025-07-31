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
  faChevronUp,
  faCommentDots,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
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

  const testimonials = [
    {
      quote: "Life Ride saved my life during a car accident. They arrived in minutes!",
      author: "Maureen., Kampala",
    },
    {
      quote: "The app’s real-time tracking gave me peace of mind during a medical emergency.",
      author: "John., Nebbi",
    },
  ];

  const faqs = [
    {
      question: "How quickly can I expect a response?",
      answer: "Our average response time is 2.5 minutes, depending on your location.",
    },
    {
      question: "Is the service available 24/7?",
      answer: "Yes, we operate 24/7 to ensure you’re never alone in an emergency.",
    },
  ];

  const statusStyles = {
    pending: "bg-yellow-500 text-white",
    verified: "bg-blue-500 text-white",
    dispatched: "bg-teal-500 text-white",
    completed: "bg-green-500 text-white",
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient relative">
      <style>{styles}</style>
      <div className="bg-overlay"></div>
      <Navbar />
      <div className="flex-1 py-16 px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-teal-900 mb-4 mt-8">
            Discover Our Services
          </h1>
          <div className="section-divider"></div>
          <p className="text-gray-700 text-lg mt-4 max-w-2xl mx-auto">
            Save Lives Uganda: Swift, reliable emergency solutions.
          </p>
        </motion.div>

        {/* Services Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          {services.map(({ icon, heading, text }, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="glass-card flex flex-col items-center text-center hover-scale"
            >
              <FontAwesomeIcon icon={icon} className="text-red-500 text-4xl mb-4" />
              <h3 className="text-xl font-bold text-teal-800 mb-2">{heading}</h3>
              <p className="text-gray-700">{text}</p>
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
          <h2 className="text-3xl font-bold text-teal-800 mb-4">How We Respond</h2>
          <div className="section-divider"></div>
          <p className="text-gray-700 text-lg mt-4 max-w-2xl mx-auto">
            Our streamlined process for rapid emergency action.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          {processSteps.map(({ icon, heading, text }, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.15 + 0.45 }}
              className="glass-card flex flex-col items-center text-center hover-scale"
            >
              <FontAwesomeIcon icon={icon} className="text-red-500 text-4xl mb-4" />
              <h3 className="text-xl font-bold text-teal-800 mb-2">{heading}</h3>
              <p className="text-gray-700">{text}</p>
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
          <h2 className="text-3xl font-bold text-teal-800 mb-4">Hospital Command Hub</h2>
          <div className="section-divider"></div>
          <p className="text-gray-700 text-lg mt-4 max-w-2xl mx-auto">
            Ready hospitals, coordinating arrivals in real time.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {additionalFeatures.map(({ icon, heading, text }, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.15 + 0.75 }}
              className="glass-card flex flex-col items-center text-center hover-scale"
            >
              <FontAwesomeIcon icon={icon} className="text-red-500 text-4xl mb-4" />
              <h3 className="text-xl font-bold text-teal-800 mb-2">{heading}</h3>
              <p className="text-gray-700">{text}</p>
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
          <h2 className="text-3xl font-bold text-teal-800 mb-4">Citizen Control Panel</h2>
          <div className="section-divider"></div>
          <p className="text-gray-700 text-lg mt-4 max-w-2xl mx-auto">
            Easy tools to manage your emergency needs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {requestProcess.map(({ icon, heading, text }, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.15 + 1.05 }}
              className="glass-card flex flex-col items-center text-center hover-scale"
            >
              <FontAwesomeIcon icon={icon} className="text-red-500 text-4xl mb-4" />
              <h3 className="text-xl font-bold text-teal-800 mb-2">{heading}</h3>
              <p className="text-gray-700">{text}</p>
            </motion.div>
          ))}
        </div>

        {/* Live Map Feature */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-center mb-12 max-w-5xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-teal-800 mb-4">Real-Time Map</h2>
          <div className="section-divider"></div>
          <p className="text-gray-700 text-lg mt-4 max-w-2xl mx-auto">
            Watch your location and responders live with GPS precision.
          </p>
          <div className="mt-6 glass-card h-48 flex items-center justify-center">
            <FontAwesomeIcon icon={faMapMarkedAlt} className="text-teal-700 text-5xl" />
            <p className="ml-3 text-gray-700 text-sm">Map access after sign-up!</p>
          </div>
        </motion.div>

        {/* Tracking and Selection Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.35 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-teal-800 mb-4">Emergency Dashboard</h2>
          <div className="section-divider"></div>
          <p className="text-gray-700 text-lg mt-4 max-w-2xl mx-auto">
            Monitor and customize your emergency response.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {trackingFeatures.map(({ icon, heading, text }, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.15 + 1.5 }}
              className="glass-card flex flex-col items-center text-center hover-scale"
            >
              <FontAwesomeIcon icon={icon} className="text-red-500 text-4xl mb-4" />
              <h3 className="text-xl font-bold text-teal-800 mb-2">{heading}</h3>
              <p className="text-gray-700">{text}</p>
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
          <h2 className="text-3xl font-bold text-teal-800 mb-4">Sample Emergency Tracking</h2>
          <div className="section-divider"></div>
          <p className="text-gray-700 text-lg mt-4 max-w-2xl mx-auto">
            Preview how your requests look in action.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
          {mockRequests.map(({ type, status, location, time }, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.15 + 1.8 }}
              className="glass-card flex flex-col items-start hover-scale p-4"
            >
              <div className="flex justify-between w-full mb-2">
                <h3 className="text-lg font-bold text-teal-800">{type}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusStyles[status]}`}>
                  {status.toUpperCase()}
                </span>
              </div>
              <p className="text-gray-700 text-sm flex items-center mb-1">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-red-500 mr-2" /> {location}
              </p>
              <p className="text-gray-700 text-sm flex items-center">
                <FontAwesomeIcon icon={faClock} className="text-red-500 mr-2" /> {time}
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
          <h2 className="text-3xl font-bold text-teal-800 mb-4">Skilled Driver Team</h2>
          <div className="section-divider"></div>
          <p className="text-gray-700 text-lg mt-4 max-w-2xl mx-auto">
            Expert drivers assigned instantly by hospitals.
          </p>
        </motion.div>

        {/* Testimonials Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.25 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-teal-800 mb-4">What Our Users Say</h2>
          <div className="section-divider"></div>
          <p className="text-gray-700 text-lg mt-4 max-w-2xl mx-auto">
            Hear from those who’ve experienced our life-saving services.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {testimonials.map(({ quote, author }, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.15 + 2.4 }}
              className="glass-card flex flex-col items-center text-center hover-scale p-6"
            >
              <FontAwesomeIcon icon={faCommentDots} className="text-red-500 text-3xl mb-4" />
              <p className="text-gray-700 italic mb-4">"{quote}"</p>
              <p className="text-teal-800 font-semibold">{author}</p>
            </motion.div>
          ))}
        </div>

        {/* FAQs Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.55 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-teal-800 mb-4">Frequently Asked Questions</h2>
          <div className="section-divider"></div>
          <p className="text-gray-700 text-lg mt-4 max-w-2xl mx-auto">
            Answers to common questions about our services.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {faqs.map(({ question, answer }, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.15 + 2.7 }}
              className="glass-card flex flex-col items-center text-center hover-scale p-6"
            >
              <FontAwesomeIcon icon={faQuestionCircle} className="text-red-500 text-3xl mb-4" />
              <h3 className="text-xl font-bold text-teal-800 mb-2">{question}</h3>
              <p className="text-gray-700">{answer}</p>
            </motion.div>
          ))}
        </div>

        {/* Call-to-Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.85 }}
          className="text-center mb-12"
        >
          <p className="text-gray-700 text-lg mb-4">
            Join thousands relying on our life-saving services.
          </p>
          <Link to="/register">
            <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full text-lg font-bold transition-all duration-300 shadow-lg">
              Get Started
            </button>
          </Link>
        </motion.div>

        {/* Back to Top Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 3 }}
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

export default Services;