import React from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faEnvelope,
  faMapMarkerAlt,
  faPaperPlane,
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
  .input-focus {
    transition: all 0.3s ease;
  }
  .input-focus:focus {
    border-color: #14B8A6;
    box-shadow: 0 0 8px rgba(20, 184, 166, 0.3);
    outline: none;
  }
`;

const Contact = () => {
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
            Contact Us
          </h1>
          <div className="section-divider"></div>
          <p className="text-gray-700 text-lg mt-4 max-w-2xl mx-auto">
            We’re here to help, 24/7. Reach out for emergencies or inquiries.
          </p>
        </motion.div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glass-card text-center hover-scale"
          >
            <FontAwesomeIcon
              icon={faPhone}
              className="text-red-500 text-4xl mb-4"
            />
            <h3 className="text-xl font-bold text-teal-800 mb-2">Phone</h3>
            <p className="text-gray-700">
              Emergency: 2300<br />
              Dispatch: savelivesug
            </p>
            <a
              href="tel:2300"
              className="inline-block mt-4 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300"
            >
              Call Now
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="glass-card text-center hover-scale"
          >
            <FontAwesomeIcon
              icon={faEnvelope}
              className="text-red-500 text-4xl mb-4"
            />
            <h3 className="text-xl font-bold text-teal-800 mb-2">Email</h3>
            <p className="text-gray-700">
              <a
                href="mailto:savelivesuganda@gmail.com"
                className="text-red-600 hover:underline"
              >
                savelivesuganda@gmail.com
              </a>
            </p>
            <a
              href="mailto:savelivesuganda@gmail.com"
              className="inline-block mt-4 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300"
            >
              Send Email
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="glass-card text-center hover-scale"
          >
            <FontAwesomeIcon
              icon={faMapMarkerAlt}
              className="text-red-500 text-4xl mb-4"
            />
            <h3 className="text-xl font-bold text-teal-800 mb-2">Address</h3>
            <p className="text-gray-700">
              savelivesug HQ<br />
              123 Kampala Road, City, 45
            </p>
            <a
              href="https://www.google.com/maps?q=123+Kampala+Road,+City,+45"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300"
            >
              View on Map
            </a>
          </motion.div>
        </div>

        {/* Contact Form Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="max-w-2xl mx-auto mb-16"
        >
          <div className="glass-card">
            <h2 className="text-3xl font-bold text-teal-800 text-center mb-6">
              Send Us a Message
            </h2>
            <form
              action="mailto:savelivesuganda@gmail.com"
              method="POST"
              encType="text/plain"
              className="space-y-6"
            >
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full p-3 rounded-lg border border-gray-300 input-focus bg-white/80 text-gray-800"
                  placeholder="Your Name"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full p-3 rounded-lg border border-gray-300 input-focus bg-white/80 text-gray-800"
                  placeholder="Your Email"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  className="w-full p-3 rounded-lg border border-gray-300 input-focus bg-white/80 text-gray-800"
                  placeholder="Your Message"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300"
              >
                <FontAwesomeIcon icon={faPaperPlane} />
                Send Message
              </button>
            </form>
          </div>
        </motion.div>

        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <div className="glass-card p-0 overflow-hidden">
            <h2 className="text-3xl font-bold text-teal-800 text-center p-6">
              Our Location
            </h2>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.815121896575!2d32.58252031475452!3d0.31628099999999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMDDCsDE4JzU4LjYiTiAzMsKwMzUnMDMuMCJF!5e0!3m2!1sen!2sus!4v1697041234567!5m2!1sen!2sus"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="savelives HQ Location"
            ></iframe>
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

export default Contact;