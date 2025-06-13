import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";
import axios from "axios";
import { Base_Url } from "../../utils/Api";

const TermsAndConditions = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch terms and conditions directly from API
  const fetchTerms = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${Base_Url}/terms`);
      setTerms(res.data);
    } catch (error) {
      console.error("Error fetching terms:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTerms();
  }, []);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 text-black">
      <h1 className="text-4xl font-bold text-center mb-8 text-black">
        TERMS & CONDITIONS
      </h1>

      <section className="mb-6">
        <p className="mb-4">
          Below are the Booking Conditions under which Viva Vista Vacations will
          arrange bookings for flights, accommodations, transfers, excursions,
          train journeys, cruises, ferries, motor coaches, or other holiday
          requirements (the "Travel Arrangements"). The combination of travel
          arrangements offered constitutes a package within the meaning of the
          Package Travel and Linked Travel Arrangements Regulations. Therefore,
          you will benefit from all EU rights applicable to packages. Viva Vista
          Vacations is fully responsible for the proper performance of the
          package as a whole.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Booking Conditions</h2>
        <p className="mb-4">
          We are Viva Vista Vacations (hereinafter referred to as "Viva Vista",
          "we", "us", or "our"), a registered travel agency incorporated in the
          United Kingdom, trading as a Travel Organiser and Travel Agent
          (company registration number 16227067). Our registered office address
          is 01, 195-197 Wood Street, London, England, E17 3NU.
        </p>
        <p>
          References to "you" and "your" in these terms apply to the traveller
          or purchaser of travel services and any other person in the party. By
          confirming your booking, we assume that you have read and agreed to
          these Booking Conditions. Unless otherwise stated, these conditions
          apply only to holiday arrangements booked through us in the UK.
          References to "holiday", "booking", "contract", "package", "tour", or
          "arrangements" refer to travel services unless specified otherwise.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">
          Our Role in Your Booking
        </h2>
        <p className="mb-4">
          We act as a Travel Organiser, meaning that when you book a package
          holiday with us and receive a single receipt for the total package
          price, we are responsible for the full arrangement and operation of
          the holiday. Once confirmed, your package will be considered a Single
          Package Contract, and we will be responsible for the booking under
          these Terms and Conditions.
        </p>
        <p>
          When acting as a Travel Organiser, we arrange for you to enter into
          contracts with principal suppliers, including airlines, accommodation
          providers, tour operators, and cruise companies, among others. We are
          the package organiser and assume the related responsibilities outlined
          in these conditions. However, when you book multiple Travel
          Arrangements in a way that forms a package holiday, we will be
          responsible for that as a Multi-Contract Package in compliance with
          the Package Travel and Linked Travel Arrangements Regulations 2018.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Your Holiday Booking</h2>
        <p className="mb-4">
          A booking is confirmed as soon as we issue our confirmation invoice.
          By making a booking with Viva Vista Vacations, you confirm that you
          have the authority to accept and agree to these booking conditions on
          behalf of your travel party.
        </p>
        <p>
          When booking a package holiday, we will arrange for you to enter into
          contracts with the principal(s) or other suppliers (such as tour
          operators, airlines, accommodation providers, and other travel service
          providers) listed on your confirmation. In these cases, Viva Vista
          Vacations acts as a package organiser and takes responsibility for the
          proper performance of your travel package, as outlined in these
          booking conditions. As an agent, we do not accept responsibility for
          the actions or omissions of the supplier(s) or for the travel services
          provided by them unless your booking has been made in a way that forms
          a package (see Clause 4 for further details). In such cases, Viva
          Vista Vacations will accept responsibility as the package organiser.
        </p>
        <p className="mt-2">
          Before booking, you will be informed of the organiser responsible for
          your travel arrangements. This may be Viva Vista Vacations or a
          third-party tour operator, in which case Viva Vista Vacations acts as
          an agent on your behalf.
        </p>
      </section>

      <div className="max-w-4xl mx-auto p-6">
        {loading ? (
          <div className="text-center py-8">
            <p>Loading terms and conditions...</p>
          </div>
        ) : terms.length > 0 ? (
          terms.map((term, index) => (
            <div key={term._id} className="mb-8">
              {/* Title */}
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex justify-between text-start items-center py-4 md:text-2xl text-xl font-medium md:font-semibold text-black focus:outline-none"
              >
                <span>{term.title}</span>
                <FaChevronDown
                  className={`transition-transform duration-300 text-deep-orange-600 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Content */}
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: openIndex === index ? "auto" : 0,
                  opacity: openIndex === index ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mb-6 border-b border-gray-300 pb-4">
                  <div
                    className="text-black prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: term.content }}
                  />
                </div>
              </motion.div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p>No terms and conditions found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TermsAndConditions;
