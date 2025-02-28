import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faQrcode,
  faPhone,
  faHandsHelping,
  faAmbulance,
  faShieldAlt,
  faUser,
  faStar,
  faCar,
  faHospital,
  faHeartbeat,
  faMapMarkerAlt,
  faStopwatch,
  faUserNurse,
  faCheckCircle,
  faArrowDown,
  faMedkit,
  faExclamationTriangle,
  faChevronUp,
  faChevronDown,
  faCalendarCheck,
  faRegistered,
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

// A Dynamic Grid Background CSS for the Hero Section
const heroGridStyles = `
  .grid-bg {
    position: absolute;
    inset: 0;
    background:rgb(245, 245, 245);
    overflow: hidden;
  }
  .grid-bg::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle, rgba(255, 0, 0, 0.1) 0%, transparent 70%);
    animation: pulse 4s infinite;
  }
  .grid-bg .grid-cell {
    position: absolute;
    width: 50px;
    height: 50px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    animation: move 6s infinite linear;
  }
  @keyframes pulse {
    0%, 100% { opacity: 0.5; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.1); }
  }
  @keyframes move {
    0% { transform: translate(0, 0); opacity: 0.3; }
    50% { opacity: 0.6; }
    100% { transform: translate(100vw, 100vh); opacity: 0; }
  }
`;

const Home = () => {
  const [responseStats] = useState({ calls: 120, assists: 85, dispatches: 45 });
  const [activeSection, setActiveSection] = useState("hero");
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const sectionRefs = useRef({});

  // An Observer for section visibility
  useEffect(() => {
    const observers = {};
    const sections = [
      "hero",
      "howItWorks",
      "services",
      "features",
      "responses",
      "testimonials",
      "faq",
      "network",
    ];
    const currentRefs = sectionRefs.current;

    sections.forEach((section) => {
      if (currentRefs[section]) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setActiveSection(section);
            }
          },
          { threshold: 0.5 }
        );
        observer.observe(currentRefs[section]);
        observers[section] = observer;
      }
    });

    return () => {
      sections.forEach((section) => {
        if (observers[section] && currentRefs[section]) {
          observers[section].unobserve(currentRefs[section]);
        }
      });
    };
  }, []);

  const sections = [
    {
      id: "howItWorks",
      title: "How It Works",
      steps: [
        {
          icon: faQrcode,
          heading: "Scan QR Code",
          text: "Scan the QR code to access emergency services instantly.",
        },
        {
          icon: faPhone,
          heading: "Call for Help",
          text: "One-touch call connects you to emergency services.",
        },
        {
          icon: faHandsHelping,
          heading: "Get Assistance",
          text: "Trained volunteers arrive within minutes while you wait for emergency services.",
        },
      ],
    },
    {
      id: "services",
      title: "Our Services",
      steps: [
        {
          icon: faHospital,
          heading: "Medical Transport",
          text: "Swift ambulance services to the nearest appropriate hospital.",
        },
        {
          icon: faCar,
          heading: "Accident Response",
          text: "Rapid aid for traffic and home emergencies with specialized equipment.",
        },
        {
          icon: faShieldAlt,
          heading: "Police Support",
          text: "24/7 law enforcement assistance with direct dispatch capabilities.",
        },
      ],
    },
    {
      id: "features",
      title: "Key Features",
      steps: [
        {
          icon: faStar,
          heading: "Verified Responders",
          text: "All professionals are background-checked and certified.",
        },
        {
          icon: faHeartbeat,
          heading: "Health Monitoring",
          text: "Vital signs tracking during transport for better preparedness.",
        },
        {
          icon: faMapMarkerAlt,
          heading: "Precise Location",
          text: "GPS pinpointing for faster response even in remote areas.",
        },
      ],
    },
  ];

  const navigateToSection = (sectionId) => {
    sectionRefs.current[sectionId]?.scrollIntoView({ behavior: "smooth" });
  };

  const handleEmergencyToggle = () => {
    setIsEmergencyActive((prev) => !prev);
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="flex flex-col min-h-screen relative">
      <style>{heroGridStyles}</style>

      {/* Emergency Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <motion.button
          className={`w-16 h-16 md:w-20 md:h-20 rounded-full shadow-lg flex items-center justify-center text-white font-bold ${
            isEmergencyActive ? "bg-yellow-500" : "bg-red-600"
          }`}
          onClick={handleEmergencyToggle}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <span className="text-lg md:text-xl">SOS</span>
        </motion.button>
      </div>

      {/* Emergency Panel */}
      {isEmergencyActive && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-70 z-40 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl p-6 max-w-md w-full"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
          >
            <div className="text-center mb-4">
              <FontAwesomeIcon
                icon={faExclamationTriangle}
                className="text-red-600 text-5xl mb-2"
              />
              <h2 className="text-2xl font-bold text-red-600">
                Emergency Services
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Link to="/register">
                <button className="bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg flex flex-col items-center justify-center w-full">
                  <FontAwesomeIcon icon={faAmbulance} className="text-2xl mb-1" />
                  <span>Ambulance</span>
                </button>
              </Link>
              <Link to="/login">
                <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg flex flex-col items-center justify-center w-full">
                  <FontAwesomeIcon icon={faShieldAlt} className="text-2xl mb-1" />
                  <span>Police</span>
                </button>
              </Link>
              <Link to="/register">
                <button className="bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-lg flex flex-col items-center justify-center w-full">
                  <FontAwesomeIcon icon={faMedkit} className="text-2xl mb-1" />
                  <span>First Aid</span>
                </button>
              </Link>
              <Link to="/login">
                <button className="bg-teal-600 hover:bg-teal-700 text-white py-3 px-4 rounded-lg flex flex-col items-center justify-center w-full">
                  <FontAwesomeIcon icon={faPhone} className="text-2xl mb-1" />
                  <span>Call Help</span>
                </button>
              </Link>
            </div>
            <p className="text-gray-600 text-sm text-center mb-4">
              Tap an option above to initiate emergency services. Your location
              is being shared automatically.
            </p>
            <button
              className="w-full bg-gray-200 hover:bg-gray-300 py-2 rounded-lg"
              onClick={handleEmergencyToggle}
            >
              Cancel
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* Navbar */}
      <Navbar />

      {/* Main Content with Full-Page Sections */}
      <div className="flex-1 snap-y snap-mandatory overflow-y-auto">
        {/* Hero Section */}
        <div
          ref={(el) => (sectionRefs.current.hero = el)}
          className="min-h-screen w-full flex items-center justify-center relative snap-start pt-16"
        >
          {/* Dynamic Grid Background */}
          <div className="grid-bg">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="grid-cell"
                style={{
                  left: `${Math.random() * 100}vw`,
                  top: `${Math.random() * 100}vh`,
                  animationDelay: `${Math.random() * 5}s`,
                }}
              />
            ))}
          </div>

          <div className="container mx-auto px-6 text-center relative z-10">
            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-6"
            >
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-teal-700">
              Rapid Emergency Response Services
              </h1>
            </motion.div>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl font-light mb-6 text-teal-700 mx-auto"
            >
              Get help in emergencies with ease, Precise Coordination and Life-Saving Care
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/Qr-login" className="relative group">
                <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full text-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2">
                  <FontAwesomeIcon icon={faQrcode} className="text-xl" />
                  Scan QR Code
                </button>
              </Link>
              <Link to="/register" className="relative group">
                <button className="bg-teal-700 hover:bg-teal-700 text-white px-8 py-3 rounded-full text-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2">
                  <FontAwesomeIcon icon={faRegistered} className="text-xl" />
                  Sign Up
                </button>
              </Link>
            </motion.div>

            {/* Emergency Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto"
            >
              <div className="text-teal-700">
                <FontAwesomeIcon
                  icon={faAmbulance}
                  className="text-red-500 text-2xl mb-2"
                />
                <p className="text-xl font-bold">{responseStats.dispatches}+</p>
                <p className="text-sm">Units Dispatched</p>
              </div>
              <div className="text-teal-700">
                <FontAwesomeIcon
                  icon={faStopwatch}
                  className="text-red-500 text-2xl mb-2"
                />
                <p className="text-xl font-bold">2.5 min</p>
                <p className="text-sm">Avg. Response Time</p>
              </div>
              <div className="text-teal-700">
                <FontAwesomeIcon
                  icon={faMapMarkerAlt}
                  className="text-red-500 text-2xl mb-2"
                />
                <p className="text-xl font-bold">99%</p>
                <p className="text-sm">Coverage Accuracy</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* How It Works Section */}
        <div
          ref={(el) => (sectionRefs.current.howItWorks = el)}
          className="min-h-screen w-full bg-gray-100 flex items-center justify-center snap-start py-16"
        >
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-teal-700">
                  {sections[0].title}
                </h2>
                <div className="w-24 h-1 bg-red-600 mx-auto"></div>
                <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                  Our streamlined process ensures you get help when you need it
                  most, with just a few simple steps.
                </p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {sections[0].steps.map(({ icon, heading, text }, idx) => (
                <motion.div
                  key={idx}
                  className="flex flex-col items-center bg-white p-8 rounded-2xl shadow-lg border-t-4 border-teal-500"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 bg-teal-50 border-2 border-teal-500">
                    <FontAwesomeIcon icon={icon} className="text-red-600 text-3xl" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-teal-700">{heading}</h3>
                  <div className="w-12 h-1 bg-red-600 mb-4"></div>
                  <p className="text-gray-600 text-center">{text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Our Services Section */}
        <div
          ref={(el) => (sectionRefs.current.services = el)}
          className="min-h-screen w-full bg-gradient-to-b from-gray-200 to-gray-100 flex items-center justify-center snap-start py-16"
        >
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-teal-700">
                  {sections[1].title}
                </h2>
                <div className="w-24 h-1 bg-red-600 mx-auto"></div>
                <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                  We provide comprehensive emergency services to handle any
                  situation with speed and care.
                </p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {sections[1].steps.map(({ icon, heading, text }, idx) => (
                <motion.div
                  key={idx}
                  className="group relative overflow-hidden"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-teal-700 to-teal-900 rounded-2xl transform transition-all duration-300 group-hover:scale-95"></div>
                  <div className="relative p-8 flex flex-col items-center text-white z-10">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 bg-white">
                      <FontAwesomeIcon icon={icon} className="text-red-600 text-3xl" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{heading}</h3>
                    <div className="w-12 h-1 bg-red-600 mb-4"></div>
                    <p className="text-center text-gray-100">{text}</p>
                    <Link to="/services">
                      <button className="mt-6 bg-white text-teal-700 px-4 py-2 rounded-full font-medium hover:bg-red-600 hover:text-white transition-all duration-300">
                        Learn More
                      </button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Key Features Section */}
        <div
          ref={(el) => (sectionRefs.current.features = el)}
          className="min-h-screen w-full bg-gray-100 flex items-center justify-center snap-start py-16"
        >
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-teal-700">
                  {sections[2].title}
                </h2>
                <div className="w-24 h-1 bg-red-600 mx-auto"></div>
                <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                  Our platform is built with advanced features designed to save
                  lives and provide peace of mind.
                </p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {sections[2].steps.map(({ icon, heading, text }, idx) => (
                <motion.div
                  key={idx}
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="relative w-full mb-6">
                    <div className="absolute inset-0 bg-teal-700 opacity-10 rounded-xl transform rotate-3"></div>
                    <div className="relative bg-white p-6 rounded-xl shadow-md border-l-4 border-red-600">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center mr-4">
                          <FontAwesomeIcon icon={icon} className="text-red-600 text-xl" />
                        </div>
                        <h3 className="text-xl font-bold text-teal-700">{heading}</h3>
                      </div>
                      <p className="text-gray-600">{text}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="mt-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <button className="bg-teal-700 hover:bg-teal-800 text-white px-8 py-3 rounded-full text-lg font-bold transition-all duration-300 shadow-lg">
                View All Features
              </button>
            </motion.div>
          </div>
        </div>

        {/* Recent Responses Section */}
        <div
          ref={(el) => (sectionRefs.current.responses = el)}
          className="min-h-screen w-full bg-gradient-to-b from-gray-200 to-gray-100 flex items-center justify-center snap-start py-16"
        >
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-teal-700">
                  Recent Responses
                </h2>
                <div className="w-24 h-1 bg-red-600 mx-auto"></div>
                <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                  Our impact by the numbers, showing how we're making a
                  difference every day.
                </p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: faPhone,
                  label: "Emergency Calls",
                  value: responseStats.calls,
                  desc: "Handled last week",
                  color: "from-red-500 to-red-700",
                },
                {
                  icon: faHandsHelping,
                  label: "Assistance Provided",
                  value: responseStats.assists,
                  desc: "Support given",
                  color: "from-teal-500 to-teal-700",
                },
                {
                  icon: faAmbulance,
                  label: "Units Dispatched",
                  value: responseStats.dispatches,
                  desc: "Rapid response",
                  color: "from-blue-500 to-blue-700",
                },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="group relative"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-2xl transform transition-all duration-300 group-hover:scale-95`}
                  ></div>
                  <div className="relative p-8 rounded-2xl flex flex-col items-center z-10 text-white">
                    <FontAwesomeIcon
                      icon={stat.icon}
                      className="text-white text-4xl mb-4 opacity-90"
                    />
                    <div className="text-5xl font-bold mb-2">{stat.value}+</div>
                    <h3 className="text-xl font-bold mb-2">{stat.label}</h3>
                    <p className="text-center text-gray-100 opacity-90">{stat.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="mt-12 bg-white p-6 rounded-xl shadow-lg"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { icon: faStopwatch, value: "3.2 min", label: "Average Response Time" },
                  { icon: faUserNurse, value: "98.7%", label: "Trained Personnel" },
                  { icon: faCheckCircle, value: "99.2%", label: "Successful Outcomes" },
                  { icon: faCalendarCheck, value: "24/7", label: "Service Availability" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center p-2">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                      <FontAwesomeIcon icon={item.icon} className="text-teal-700 text-xl" />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-teal-700">{item.value}</div>
                      <div className="text-sm text-gray-600">{item.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div
          ref={(el) => (sectionRefs.current.testimonials = el)}
          className="min-h-screen w-full bg-gray-100 flex items-center justify-center snap-start py-16"
        >
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-teal-700">
                  What People Say
                </h2>
                <div className="w-24 h-1 bg-red-600 mx-auto"></div>
                <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                  Real stories from people whose lives have been impacted by
                  our services.
                </p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Jacob S.",
                  text: "This app saved my life. I had a medical emergency while hiking, and the rapid response team arrived in just minutes. The GPS location feature was critical in finding me.",
                  rating: 5,
                  role: "Patient",
                },
                {
                  name: "Emma W.",
                  text: "As hospital staff, I've seen firsthand how this platform has streamlined our workflow. Patients arrive faster and with better pre-arrival information, allowing us to prepare effectively.",
                  rating: 5,
                  role: "Hospital Staff",
                },
                {
                  name: "David K.",
                  text: "The real-time updates make my job as an ambulance driver much more efficient. I can see patient information en route and coordinate with hospital staff before arrival.",
                  rating: 5,
                  role: "Ambulance Driver",
                },
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-8 rounded-2xl shadow-lg relative"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-red-600 rounded-bl-2xl rounded-tr-2xl flex items-center justify-center">
                    <FontAwesomeIcon icon={faUser} className="text-white text-xl" />
                  </div>
                  <div className="flex justify-start mb-4">
                    {[...Array(5)].map((_, i) => (
                      <FontAwesomeIcon
                        key={i}
                        icon={faStar}
                        className={`text-xl ${
                          i < testimonial.rating ? "text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center mr-4">
                      <span className="text-teal-700 font-bold">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-teal-700">{testimonial.name}</h4>
                      <p className="text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div
          ref={(el) => (sectionRefs.current.faq = el)}
          className="min-h-screen w-full bg-gradient-to-b from-gray-200 to-gray-100 flex items-center justify-center snap-start py-16"
        >
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-teal-700">
                  Frequently Asked Questions
                </h2>
                <div className="w-24 h-1 bg-red-600 mx-auto"></div>
                <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                  Find answers to the most common questions about our services.
                </p>
              </motion.div>
            </div>

            <div className="space-y-4">
              {[
                {
                  question: "How do I use the emergency services?",
                  answer:
                    "Simply press the SOS button and select the type of emergency service you need. Your location will be shared automatically.",
                },
                {
                  question: "Is the service available 24/7?",
                  answer:
                    "Yes, our emergency services are available 24/7 to ensure you get help whenever you need it.",
                },
                {
                  question: "How accurate is the location tracking?",
                  answer:
                    "Our platform uses advanced GPS technology to provide precise location tracking, even in remote areas.",
                },
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleFaq(index)}
                  >
                    <h3 className="text-lg font-bold text-teal-700">{faq.question}</h3>
                    <FontAwesomeIcon
                      icon={activeFaq === index ? faChevronUp : faChevronDown}
                      className="text-teal-700"
                    />
                  </div>
                  {activeFaq === index && (
                    <div className="mt-4 text-gray-600">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Dispatch Network Section */}
        <div
          ref={(el) => (sectionRefs.current.network = el)}
          className="min-h-screen w-full bg-gradient-to-b from-gray-200 to-gray-100 flex items-center justify-center snap-start py-16"
        >
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-teal-700">
                  Dispatch Network
                </h2>
                <div className="w-24 h-1 bg-red-600 mx-auto"></div>
                <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                  Our extensive network ensures rapid response across multiple
                  regions, 24/7.
                </p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: faCar,
                  value: "250+",
                  title: "Active Responders",
                  color: "from-red-500 to-red-700",
                },
                {
                  icon: faAmbulance,
                  value: "< 2 min",
                  title: "Dispatch Time",
                  color: "from-teal-500 to-teal-700",
                },
                {
                  icon: faShieldAlt,
                  value: "15+",
                  title: "Coverage Areas",
                  color: "from-blue-500 to-blue-700",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="group relative"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-2xl transform transition-all duration-300 group-hover:scale-95`}
                  ></div>
                  <div className="relative p-8 rounded-2xl flex flex-col items-center z-10 text-white">
                    <FontAwesomeIcon
                      icon={item.icon}
                      className="text-white text-4xl mb-4 opacity-90"
                    />
                    <div className="text-3xl font-bold mb-2">{item.value}</div>
                    <h3 className="text-xl font-bold">{item.title}</h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;