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

// Enhanced Hero Section Styles with Glassmorphism and Modern Effects
const heroStyles = `
  .hero-section {
    position: relative;
    min-height: 100vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: url('https://images.unsplash.com/photo-1611226680667-22f8777dfd72?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D') no-repeat center center/cover;
    padding-top: 64px; /* Adjust for fixed navbar */
  }
  .hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(0, 105, 92, 0.7), rgba(0, 0, 0, 0.5));
    z-index: 1;
  }
  .hero-content {
    position: relative;
    z-index: 2;
    text-align: center;
    color: white;
    padding: 2rem;
  }
  .glass-card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
    padding: 1.5rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  }
  .section-divider {
    width: 80px;
    height: 4px;
    background: #EF4444;
    margin: 1rem auto;
    border-radius: 2px;
  }
`;

const Home = () => {
  const [responseStats] = useState({ calls: 120, assists: 85, dispatches: 45 });
  const [activeSection, setActiveSection] = useState("hero");
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const sectionRefs = useRef({});

  // Intersection Observer for Section Visibility
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
          image: "https://images.unsplash.com/photo-1626682561113-d1db402cc866?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
          icon: faPhone,
          heading: "Call for Help",
          text: "One-touch call connects you to emergency services.",
          image: "https://images.unsplash.com/photo-1560957123-81d48b38ab49?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
          icon: faHandsHelping,
          heading: "Get Assistance",
          text: "Volunteers arrive within minutes while you wait for emergency services.",
          image: "https://images.unsplash.com/photo-1586470202424-a6f766679b45?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
          image: "https://cdn.pixabay.com/photo/2018/10/09/15/10/rescue-3735206_1280.jpg",
        },
        {
          icon: faCar,
          heading: "Accident Response",
          text: "Rapid aid for traffic and home emergencies with specialized equipment.",
          image: "https://images.unsplash.com/photo-1584652812805-2192cf80731d?q=80&w=1552&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
          icon: faShieldAlt,
          heading: "Police Support",
          text: "24/7 law enforcement assistance with direct dispatch capabilities.",
          image: "https://images.unsplash.com/photo-1544993570-05e1f210815a?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
          image: "https://plus.unsplash.com/premium_photo-1661351553991-f039d72babe1?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
          icon: faHeartbeat,
          heading: "Health Monitoring",
          text: "Vital signs tracking during transport for better preparedness.",
          image: "https://images.unsplash.com/photo-1513224502586-d1e602410265?q=80&w=1631&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
          icon: faMapMarkerAlt,
          heading: "Precise Location",
          text: "GPS pinpointing for faster response even in remote areas.",
          image: "https://images.unsplash.com/photo-1625217527288-93919c99650a?q=80&w=1412&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
      <style>{heroStyles}</style>

      {/* Emergency Button with Modern Design */}
      <div className="fixed bottom-8 right-8 z-50">
        <motion.button
          className={`w-16 h-16 md:w-20 md:h-20 rounded-full shadow-lg flex items-center justify-center text-white font-bold ${
            isEmergencyActive ? "bg-yellow-500" : "bg-red-600"
          } backdrop-blur-md border border-white/20 transition-all duration-300`}
          onClick={handleEmergencyToggle}
          whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(239, 68, 68, 0.5)" }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <span className="text-lg md:text-xl">SOS</span>
        </motion.button>
      </div>

      {/* Emergency Panel with Glassmorphism */}
      {isEmergencyActive && (
        <motion.div
          className="fixed inset-0 bg-black/80 z-40 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="glass-card max-w-md w-full"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
          >
            <div className="text-center mb-4">
              <FontAwesomeIcon
                icon={faExclamationTriangle}
                className="text-red-500 text-5xl mb-2"
              />
              <h2 className="text-2xl font-bold text-white">
                Emergency Services
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Link to="/register">
                <button className="bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg flex flex-col items-center justify-center w-full transition-all duration-300">
                  <FontAwesomeIcon icon={faAmbulance} className="text-2xl mb-1" />
                  <span>Ambulance</span>
                </button>
              </Link>
              <Link to="/login">
                <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg flex flex-col items-center justify-center w-full transition-all duration-300">
                  <FontAwesomeIcon icon={faShieldAlt} className="text-2xl mb-1" />
                  <span>Police</span>
                </button>
              </Link>
              <Link to="/register">
                <button className="bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-lg flex flex-col items-center justify-center w-full transition-all duration-300">
                  <FontAwesomeIcon icon={faMedkit} className="text-2xl mb-1" />
                  <span>First Aid</span>
                </button>
              </Link>
              <Link to="/login">
                <button className="bg-teal-600 hover:bg-teal-700 text-white py-3 px-4 rounded-lg flex flex-col items-center justify-center w-full transition-all duration-300">
                  <FontAwesomeIcon icon={faPhone} className="text-2xl mb-1" />
                  <span>Call Help</span>
                </button>
              </Link>
            </div>
            <p className="text-gray-300 text-sm text-center mb-4">
              Tap an option above to initiate emergency services. Your location
              is being shared automatically.
            </p>
            <button
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg transition-all duration-300"
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
        <section
          ref={(el) => (sectionRefs.current.hero = el)}
          className="hero-section snap-start"
        >
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <motion.div
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-6"
            >
              <h1 className="text-5xl md:text-7xl font-extrabold leading-tight text-white">
                Rapid Emergency Response
              </h1>
              <p className="text-lg md:text-2xl font-light mt-4 text-gray-200">
                Life-Saving Care, Just a Tap Away
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/Qr-login">
                <motion.button
                  className="bg-red-600 hover:bg-red-700 text-white px-8 md:px-10 py-3 md:py-4 rounded-full text-lg md:text-xl font-bold shadow-lg transition-all duration-300"
                  whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(239, 68, 68, 0.5)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FontAwesomeIcon icon={faQrcode} className="mr-2" /> Scan QR
                </motion.button>
              </Link>
              <Link to="/register">
                <motion.button
                  className="bg-teal-600 hover:bg-teal-700 text-white px-8 md:px-10 py-3 md:py-4 rounded-full text-lg md:text-xl font-bold shadow-lg transition-all duration-300"
                  whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(20, 184, 166, 0.5)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FontAwesomeIcon icon={faRegistered} className="mr-2" /> Register
                </motion.button>
              </Link>
            </motion.div>

            {/* Emergency Stats with Glassmorphism */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
            >
              <div className="glass-card text-center">
                <FontAwesomeIcon
                  icon={faAmbulance}
                  className="text-red-400 text-3xl mb-2"
                />
                <p className="text-2xl font-bold">{responseStats.dispatches}+</p>
                <p className="text-sm text-gray-200">Units Dispatched</p>
              </div>
              <div className="glass-card text-center">
                <FontAwesomeIcon
                  icon={faStopwatch}
                  className="text-red-400 text-3xl mb-2"
                />
                <p className="text-2xl font-bold">2.5 min</p>
                <p className="text-sm text-gray-200">Avg. Response Time</p>
              </div>
              <div className="glass-card text-center">
                <FontAwesomeIcon
                  icon={faMapMarkerAlt}
                  className="text-red-400 text-3xl mb-2"
                />
                <p className="text-2xl font-bold">99%</p>
                <p className="text-sm text-gray-200">Coverage Accuracy</p>
              </div>
            </motion.div>

            {/* Scroll Down Indicator */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="absolute bottom-10"
            >
              <button
                onClick={() => navigateToSection("howItWorks")}
                className="text-white text-xl animate-bounce"
              >
                <FontAwesomeIcon icon={faArrowDown} />
              </button>
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <section
          ref={(el) => (sectionRefs.current.howItWorks = el)}
          className="min-h-screen w-full bg-gray-50 flex items-center justify-center snap-start py-16"
        >
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-teal-800">
                {sections[0].title}
              </h2>
              <div className="section-divider"></div>
              <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                Our streamlined process ensures you get help when you need it most.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {sections[0].steps.map(({ icon, heading, text, image }, idx) => (
                <motion.div
                  key={idx}
                  className="relative group rounded-2xl overflow-hidden shadow-lg"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.03 }}
                >
                  <img
                    src={image}
                    alt={heading}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  <div className="relative p-6 text-center text-white">
                    <div className="w-16 h-16 rounded-full bg-teal-600 flex items-center justify-center mx-auto mb-4">
                      <FontAwesomeIcon icon={icon} className="text-white text-2xl" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{heading}</h3>
                    <p className="text-gray-200">{text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Services Section */}
        <section
          ref={(el) => (sectionRefs.current.services = el)}
          className="min-h-screen w-full bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center snap-start py-16"
        >
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-teal-800">
                {sections[1].title}
              </h2>
              <div className="section-divider"></div>
              <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                Comprehensive emergency services tailored to your needs.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {sections[1].steps.map(({ icon, heading, text, image }, idx) => (
                <motion.div
                  key={idx}
                  className="group relative rounded-2xl overflow-hidden shadow-lg"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.03 }}
                >
                  <img
                    src={image}
                    alt={heading}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-teal-800/80 to-transparent"></div>
                  <div className="relative p-6 text-center text-white">
                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mx-auto mb-4">
                      <FontAwesomeIcon icon={icon} className="text-red-600 text-2xl" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{heading}</h3>
                    <p className="text-gray-200 mb-4">{text}</p>
                    <Link to="/services">
                      <button className="bg-white text-teal-800 px-4 py-2 rounded-full font-medium hover:bg-red-600 hover:text-white transition-all duration-300">
                        Learn More
                      </button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section
          ref={(el) => (sectionRefs.current.features = el)}
          className="min-h-screen w-full bg-gray-50 flex items-center justify-center snap-start py-16"
        >
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-teal-800">
                {sections[2].title}
              </h2>
              <div className="section-divider"></div>
              <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                Advanced features designed to save lives and provide peace of mind.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {sections[2].steps.map(({ icon, heading, text, image }, idx) => (
                <motion.div
                  key={idx}
                  className="group relative rounded-2xl overflow-hidden shadow-lg"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.03 }}
                >
                  <img
                    src={image}
                    alt={heading}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  <div className="relative p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-teal-600 flex items-center justify-center mr-4">
                        <FontAwesomeIcon icon={icon} className="text-white text-xl" />
                      </div>
                      <h3 className="text-xl font-bold text-white">{heading}</h3>
                    </div>
                    <p className="text-gray-200">{text}</p>
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
              <Link to="/services">
                <button className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-full text-lg font-bold transition-all duration-300 shadow-lg">
                  Explore All Features
                </button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Recent Responses Section */}
        <section
          ref={(el) => (sectionRefs.current.responses = el)}
          className="min-h-screen w-full bg-gradient-to-b from-gray-200 to-gray-300 flex items-center justify-center snap-start py-16"
        >
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-teal-800">
                Recent Responses
              </h2>
              <div className="section-divider"></div>
              <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                Our impact in numbers, showcasing our commitment to saving lives.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                
                  label: "Emergency Calls",
                  value: responseStats.calls,
                  desc: "Handled last week",
                  color: "from-red-500 to-red-700",
                  image: "https://images.unsplash.com/photo-1532106753298-e7b431b26dae?q=80&w=1571&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                },
                {
                  
                  label: "Assistance Provided",
                  value: responseStats.assists,
                  desc: "Support given",
                  color: "from-teal-500 to-teal-700",
                  image: "https://images.unsplash.com/photo-1544026230-488aeae72c0d?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                },
                {
                  
                  label: "Units Dispatched",
                  value: responseStats.dispatches,
                  desc: "Rapid response",
                  color: "from-blue-500 to-blue-700",
                  image: "https://images.unsplash.com/photo-1580795479225-c50ab8c3348d?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="group relative rounded-2xl overflow-hidden shadow-lg"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.03 }}
                >
                  <img
                    src={stat.image}
                    alt={stat.label}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  <div className="relative p-8 rounded-2xl flex flex-col items-center text-white z-10">
                    <FontAwesomeIcon
                      icon={stat.icon}
                      className="text-white text-4xl mb-4"
                    />
                    <div className="text-5xl font-bold mb-2">{stat.value}+</div>
                    <h3 className="text-xl font-bold mb-2">{stat.label}</h3>
                    <p className="text-center text-gray-200">{stat.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="mt-12 glass-card"
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
                    <div className="w-12 h-12 rounded-full bg-teal-600/20 flex items-center justify-center mr-4">
                      <FontAwesomeIcon icon={item.icon} className="text-teal-600 text-xl" />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-teal-800">{item.value}</div>
                      <div className="text-sm text-gray-600">{item.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section
          ref={(el) => (sectionRefs.current.testimonials = el)}
          className="min-h-screen w-full bg-gray-50 flex items-center justify-center snap-start py-16"
        >
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-teal-800">
                What People Say
              </h2>
              <div className="section-divider"></div>
              <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                Hear from those whose lives have been touched by our services.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Jacob S.",
                  text: "This app saved my life. I had a medical emergency while hiking, and the rapid response team arrived in just minutes.",
                  rating: 5,
                  role: "Patient",
                  image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                },
                {
                  name: "Emma W.",
                  text: "As hospital staff, this platform has streamlined our workflow. Patients arrive faster with better pre-arrival info.",
                  rating: 5,
                  role: "Hospital Staff",
                  image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                },
                {
                  name: "David K.",
                  text: "Real-time updates make my job as an ambulance driver efficient. I can coordinate with hospital staff en route.",
                  rating: 5,
                  role: "Ambulance Driver",
                  image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                },
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="glass-card relative p-6"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <div className="flex justify-center mb-4">
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
                  <p className="text-gray-600 mb-6 italic">"{testimonial.text}"</p>
                  <div className="flex items-center">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4 object-cover"
                    />
                    <div>
                      <h4 className="font-light text-lg text-gray-600">{testimonial.name}</h4>
                      <p className="text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section
          ref={(el) => (sectionRefs.current.faq = el)}
          className="min-h-screen w-full bg-gradient-to-b from-gray-200 to-gray-300 flex items-center justify-center snap-start py-16"
        >
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-teal-800">
                Frequently Asked Questions
              </h2>
              <div className="section-divider"></div>
              <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                Find answers to the most common questions about our services.
              </p>
            </motion.div>

            <div className="text-gray-400 space-y-4 max-w-3xl mx-auto">
              {[
                {
                  question: "How do I use the emergency services?",
                  answer:
                    "Simply press the SOS button and select the type of emergency service you need. Your location will be shared instantly on click.",
                },
                {
                  question: "Is the service available 24/7?",
                  answer:
                    "Yes, our emergency services are available 24/7 to ensure you get help whenever you need it.",
                },
                {
                  question: "How accurate is the location tracking?",
                  answer:
                    "Our platform uses advanced GPS technology to provide precise location tracking, in all areas.",
                },
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  className="glass-card p-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleFaq(index)}
                  >
                    <h3 className="text-lg font-bold text-gray">{faq.question}</h3>
                    <FontAwesomeIcon
                      icon={activeFaq === index ? faChevronUp : faChevronDown}
                      className="text-gray"
                    />
                  </div>
                  {activeFaq === index && (
                    <div className="mt-4 text-gray-400">
                      <p>{faq.answer}</p>
                    </div>
                  )}
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
              <Link to="/contact">
                <button className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-full text-lg font-bold transition-all duration-300 shadow-lg">
                  Still Have Questions? Contact Us
                </button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Dispatch Network Section */}
        <section
          ref={(el) => (sectionRefs.current.network = el)}
          className="min-h-screen w-full bg-gradient-to-b from-gray-200 to-gray-300 flex items-center justify-center snap-start py-16"
        >
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-teal-800">
                Dispatch Network
              </h2>
              <div className="section-divider"></div>
              <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                Our extensive network ensures rapid response across multiple regions, 24/7.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  
                  value: "250+",
                  title: "Active Responders",
                  color: "from-red-500 to-red-700",
                  image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bWVkaWNhbHxlbnwwfHwwfHx8MA%3D%3D",
                },
                {
                  
                  value: "< 2 min",
                  title: "Dispatch Time",
                  color: "from-teal-500 to-teal-700",
                  image: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHRpbWV8ZW58MHx8MHx8fDA%3D",
                },
                {
                  
                  value: "15+",
                  title: "Coverage Areas",
                  color: "from-blue-500 to-blue-700",
                  image: "https://plus.unsplash.com/premium_photo-1712225701666-7c97f05ae631?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Q292ZXJhZ2UlMjBBcmVhcyUyMGFmcmljYXxlbnwwfHwwfHx8MA%3D%3D",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="group relative rounded-2xl overflow-hidden shadow-lg"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.03 }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  <div className="relative p-8 rounded-2xl flex flex-col items-center text-white z-10">
                    <FontAwesomeIcon
                      icon={item.icon}
                      className="text-white text-4xl mb-4"
                    />
                    <div className="text-3xl font-bold mb-2">{item.value}</div>
                    <h3 className="text-xl font-bold">{item.title}</h3>
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
              <Link to="/about-us">
                <button className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-full text-lg font-bold transition-all duration-300 shadow-lg">
                  Learn More About Our Network
                </button>
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;