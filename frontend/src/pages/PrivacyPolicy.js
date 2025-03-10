import React, { useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp, faEnvelope, faLock, faGlobe } from "@fortawesome/free-solid-svg-icons";
import Navbar from "../components/Navbar";

// Custom Styles with Improved Text Visibility
const styles = `
  .glass-card {
    background: rgba(255, 255, 255, 0.15); /* Slightly lighter for better contrast */
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
    background: rgba(0, 0, 0, 0.05); /* Subtle overlay for contrast */
    z-index: 0;
  }
  .hover-scale {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .hover-scale:hover {
    transform: scale(1.02);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  }
`;

const PrivacyPolicy = () => {
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const sections = [
    {
      id: "commitment",
      title: "Our Commitment",
      icon: faLock,
      content: (
        <p className="text-gray-800 text-base leading-relaxed">
          At Life-Ride, protecting your privacy is our top priority. We handle your personal and sensitive data with the utmost care, adhering to global standards like the Ugandan Data Protection and Privacy Act, 2019, and the California Consumer Privacy Act (CCPA). This policy outlines our practices for collecting, using, and safeguarding your information transparently.
        </p>
      ),
    },
    {
      id: "information",
      title: "Information We Collect",
      icon: faGlobe,
      content: (
        <>
          <p className="text-gray-800 text-base leading-relaxed mb-4">
            We collect data essential for delivering emergency services, including:
          </p>
          <ul className="list-disc list-inside text-gray-800 text-base space-y-3">
            <li>
              <strong>Personal Details:</strong> Name, phone number, email, and address for identification and contact (per Section 12, Ugandan Data Protection and Privacy Act, 2019).
            </li>
            <li>
              <strong>Location Data:</strong> GPS coordinates, Plus Codes, or entered locations for precise dispatch (CCPA Category: Geolocation Data).
            </li>
            <li>
              <strong>Medical Information:</strong> Victim details (e.g., age, sex, health status) for emergency response (protected under HIPAA and Ugandan law).
            </li>
            <li>
              <strong>Usage Data:</strong> App/website interactions (e.g., IP address, device info) to enhance service (CCPA Category: Internet Activity).
            </li>
            <li>
              <strong>Account Data:</strong> Login credentials and settings for secure access.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "usage",
      title: "How We Use Your Information",
      icon: faGlobe,
      content: (
        <>
          <p className="text-gray-800 text-base leading-relaxed mb-4">
            Your data supports our mission to save lives:
          </p>
          <ul className="list-disc list-inside text-gray-800 text-base space-y-3">
            <li>Processing emergency requests efficiently.</li>
            <li>Coordinating with responders (police, hospitals, drivers).</li>
            <li>Meeting legal requirements (e.g., Section 18, Ugandan Data Protection and Privacy Act, 2019; CCPA disclosure obligations).</li>
            <li>Improving our platform through anonymized analytics.</li>
            <li>Notifying you of critical updates (e.g., request status).</li>
          </ul>
          <p className="text-gray-800 text-base mt-4 font-semibold">
            We never sell or misuse your data for non-emergency purposes.
          </p>
        </>
      ),
    },
    {
      id: "cookies",
      title: "Cookies and Tracking",
      icon: faGlobe,
      content: (
        <>
          <p className="text-gray-800 text-base leading-relaxed">
            We use cookies and similar technologies to:
          </p>
          <ul className="list-disc list-inside text-gray-800 text-base space-y-3 mt-4">
            <li>Ensure app functionality (e.g., session management).</li>
            <li>Analyze usage trends anonymously (e.g., page visits).</li>
            <li>Support real-time features like live map tracking.</li>
          </ul>
          <p className="text-gray-800 text-base mt-4">
            Per the CCPA, you can opt out of non-essential cookie use via our settings (see “Your Rights”). No cookies are used for marketing or third-party sales (aligned with Ugandan law’s consent requirements, Section 13).
          </p>
        </>
      ),
    },
    {
      id: "children",
      title: "Children’s Privacy",
      icon: faLock,
      content: (
        <>
          <p className="text-gray-800 text-base leading-relaxed">
            We protect minors’ data with extra care:
          </p>
          <ul className="list-disc list-inside text-gray-800 text-base space-y-3 mt-4">
            <li>
              For users under 13, we require verifiable parental consent before collecting data (per U.S. COPPA and Ugandan law).
            </li>
            <li>
              Teens aged 13-16 can consent to emergency data use, but not sales (CCPA, Cal. Civ. Code  1798.120(c)).
            </li>
            <li>
              Data from minors is used only for emergency response and deleted post-resolution unless legally required.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "protection",
      title: "How We Protect Your Data",
      icon: faLock,
      content: (
        <>
          <p className="text-gray-800 text-base leading-relaxed">
            We secure your data with:
          </p>
          <ul className="list-disc list-inside text-gray-800 text-base space-y-3 mt-4">
            <li>End-to-end encryption for sensitive info (e.g., medical, location).</li>
            <li>Secure, compliant servers (ISO 27001 certified).</li>
            <li>Frequent security audits and updates.</li>
            <li>Token-based authentication for account access.</li>
          </ul>
          <p className="text-gray-800 text-base mt-4">
            If a breach occurs, we’ll notify you within 72 hours, as required by the Ugandan Data Protection and Privacy Act, 2019, Section 23.
          </p>
        </>
      ),
    },
    {
      id: "sharing",
      title: "Data Sharing",
      icon: faGlobe,
      content: (
        <>
          <p className="text-gray-800 text-base leading-relaxed">
            We share data only for emergencies or legal needs:
          </p>
          <ul className="list-disc list-inside text-gray-800 text-base space-y-3 mt-4">
            <li>
              <strong>Responders:</strong> Police, hospitals, and drivers get necessary details (Ugandan law, Section 16; CCPA Category: Service Providers).
            </li>
            <li>
              <strong>Authorities:</strong> Shared as mandated by law (e.g., court orders).
            </li>
            <li>
              <strong>Providers:</strong> Trusted partners (e.g., GPS, cloud services) under strict agreements.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "rights",
      title: "Your Rights",
      icon: faLock,
      content: (
        <>
          <p className="text-gray-800 text-base leading-relaxed">
            You have rights under laws like the CCPA and Ugandan Data Protection and Privacy Act, 2019:
          </p>
          <ul className="list-disc list-inside text-gray-800 text-base space-y-3 mt-4">
            <li>
              <strong>Know:</strong> See what data we collect (CCPA  1798.100).
            </li>
            <li>
              <strong>Delete:</strong> Request data removal post-emergency (Ugandan law, Section 19).
            </li>
            <li>
              <strong>Opt-Out:</strong> Stop non-essential data use (e.g., cookies, CCPA  1798.120).
            </li>
            <li>
              <strong>Correct:</strong> Fix inaccurate data (Ugandan law, Section 20).
            </li>
            <li>
              <strong>Non-Discrimination:</strong> Equal service regardless of rights exercised (CCPA  1798.125).
            </li>
          </ul>
          <p className="text-gray-800 text-base mt-4">
            Email{" "}
            <a href="mailto:support@liferide.com" className="text-red-600 hover:underline">
              support@liferide.com
            </a>{" "}
            to exercise these rights; we’ll respond within 30 days.
          </p>
        </>
      ),
    },
    {
      id: "retention",
      title: "Data Retention",
      icon: faLock,
      content: (
        <>
          <p className="text-gray-800 text-base leading-relaxed">
            We keep data only as needed:
          </p>
          <ul className="list-disc list-inside text-gray-800 text-base space-y-3 mt-4">
            <li>Emergency data: Retained 5 years for legal records, then deleted.</li>
            <li>Account data: Kept active, deleted 30 days post-closure.</li>
            <li>Usage data: Anonymized after 12 months.</li>
          </ul>
        </>
      ),
    },
    {
      id: "compliance",
      title: "Compliance with Laws",
      icon: faGlobe,
      content: (
        <>
          <p className="text-gray-800 text-base leading-relaxed">
            We comply with:
          </p>
          <ul className="list-disc list-inside text-gray-800 text-base space-y-3 mt-4">
            <li>Ugandan Data Protection and Privacy Act, 2019 (Cap 97).</li>
            <li>California Consumer Privacy Act (CCPA/CPRA).</li>
            <li>GDPR (EU users), HIPAA (U.S. medical data), COPPA (children).</li>
          </ul>
        </>
      ),
    },
    {
      id: "changes",
      title: "Changes to This Policy",
      icon: faLock,
      content: (
        <p className="text-gray-800 text-base leading-relaxed">
          Updates will be notified via email or app. Review here for the latest policy.
        </p>
      ),
    },
    {
      id: "contact",
      title: "Contact Us",
      icon: faEnvelope,
      content: (
        <>
          <p className="text-gray-800 text-base leading-relaxed">
            Reach us at:
          </p>
          <ul className="list-disc list-inside text-gray-800 text-base space-y-3 mt-4">
            <li>
              Email:{" "}
              <a href="mailto:support@liferide.com" className="text-red-600 hover:underline">
                support@liferide.com
              </a>
            </li>
          </ul>
        </>
      ),
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient relative">
      <style>{styles}</style>
      <div className="bg-overlay"></div> {/* Subtle overlay for contrast */}
      <Navbar />
      <div className="flex-1 py-16 px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-teal-900 mb-4 mt-6">
            Privacy Policy
          </h1>
          <div className="section-divider"></div>
          <p className="text-gray-700 text-lg mt-4">Last Updated: February 28, 2025</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="glass-card">
            {sections.map((section, idx) => (
              <motion.div
                key={section.id}
                className="mb-6 hover-scale rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex justify-between items-center text-left p-4 rounded-lg bg-teal-900/30 hover:bg-teal-900/40 transition-all duration-300"
                >
                  <div className="flex items-center">
                    <FontAwesomeIcon
                      icon={section.icon}
                      className="text-teal-400 text-xl mr-3"
                    />
                    <h2 className="text-2xl font-semibold text-teal-200">
                      {section.title}
                    </h2>
                  </div>
                  <FontAwesomeIcon
                    icon={openSections[section.id] ? faChevronUp : faChevronDown}
                    className="text-red-500 text-lg"
                  />
                </button>
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: openSections[section.id] ? "auto" : 0,
                    opacity: openSections[section.id] ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden px-4 pt-4 pb-2"
                >
                  {section.content}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Back to Top Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="fixed bottom-8 right-8"
        >
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="bg-teal-600 hover:bg-teal-700 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300"
          >
            <FontAwesomeIcon icon={faChevronUp} className="text-xl" />
          </button>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-700 text-lg mb-4">
            Have questions about our privacy practices?
          </p>
          <a
            href="mailto:support@liferide.com"
            className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-lg transition-all duration-300"
          >
            <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
            Contact Us
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;