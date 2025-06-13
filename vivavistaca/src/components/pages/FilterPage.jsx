import React, { useEffect, useState, useRef, useContext, useCallback } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ImageGallery2, FilterElement, FilterPageSlides } from "../elements";
import {
  MapPin,
  Tag,
  CalendarCheck,
  Hotel,
  Flame,
  Sparkles,
} from "lucide-react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { Base_Url } from "../../utils/Api";
import SimilarDealsSlider from "../elements/SimilarDealsSlider";
import { LeadContext } from "../../contexts/LeadContext";
const FilterPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tripData, setTripData] = useState({});
  const [images, setImages] = useState([]);
  const [prices, setPrices] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [availableCountries, setAvailableCountries] = useState([]);
  const [exclusiveAdditions, setExclusiveAdditions] = useState([]);
  const [termsAndConditions, setTermsAndConditions] = useState([]);
  const [whatsIncluded, setWhatsIncluded] = useState([]);
  const [itinerary, setItinerary] = useState([]);
  const [loading, setLoading] = useState(true);
  const rating = hotels?.[0]?.tripAdvisorRating;
  const reviews = hotels?.[0]?.tripAdvisorReviews;
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [ledPrice, setLedprice] = useState(null); // State to store the lowest price
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedAirport, setSelectedAirport] = useState("");
  const leftCardRef = useRef(null);
  const [leftHeight, setLeftHeight] = useState("auto");
  const { setLeadPrice } = useContext(LeadContext);
  const [lowDepositOpen, setLowDepositOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const renderStars = () => {
    const stars = [];

    for (let i = 0; i < 5; i++) {
      if (i + 1 <= Math.floor(rating)) {
        stars.push(<FaStar key={i} className="text-amber-500 text-sm" />);
      } else if (i < rating) {
        stars.push(
          <FaStarHalfAlt key={i} className="text-amber-500 text-sm" />
        );
      } else {
        stars.push(<FaRegStar key={i} className="text-gray-300 text-sm" />);
      }
    }

    return stars;
  };
  const [sharedData, setSharedData] = useState("Data from Parent");
  const updateSharedData = (newData) => {
    setSharedData(newData);
  };

  const [data, setData] = useState({
    basePrice: 479,
    departureDates: [],
    departureAirports: [],

  });

  // Function to find the cheapest price and its airport
  const findCheapestPrice = (pricesArray) => {
    if (!pricesArray || pricesArray.length === 0) return null;

    // Filter out any prices with priceswitch = true if needed
    const validPrices = pricesArray.filter(price => !price.priceswitch);

    if (validPrices.length === 0) return null;

    // Find the cheapest price
    const cheapestPrice = validPrices.reduce((cheapest, current) => {
      return current.price < cheapest.price ? current : cheapest;
    }, validPrices[0]);

    console.log("Found cheapest price:", cheapestPrice);
    return cheapestPrice;
  };

  useEffect(() => {
    if (!id) return;
    axios
      .get(`${Base_Url}/deals/${id}`)
      .then((res) => {
        const data = res.data;
        console.log("this is fetch filter page data", data);
        // Map trip details
        setTripData({
          title: data.title,
          tag: data.tag,
          description: data.description,
          destination: data.destination,
          boardBasis: data.boardBasis,
          distanceToCenter: `${data.distanceToCenter} km`,
          distanceToBeach: `${data.distanceToBeach} km`,
          isTopDeal: data.isTopDeal,
          isHotdeal: data.isHotdeal,
          days: data.days,
          rooms: data.rooms,
          guests: data.guests,
          LowDeposite: data.LowDeposite,
          destinations: data.destinations,
        });

        // Set images
        setImages(data.images || []);
        // Transform prices data
        setPrices(
          data.prices.map((price) => ({
            country: price.country,
            airport: price.airport,
            startdate: price.startdate,
            enddate: price.enddate,
            price: price.price,
            priceswitch: price.priceswitch,
            flightDetails: price.flightDetails,
            _id: price._id
          }))
        );

        // Set hotels array if exists
        if (data.hotels && Array.isArray(data.hotels)) {
          setHotels(
            data.hotels.map((hotel) => ({
              name: hotel.name,
              about: hotel.about,
              facilities: hotel.facilities,
              location: hotel.location,
              locationId: hotel.locationId,
              tripAdvisorRating: hotel.tripAdvisorRating,
              tripAdvisorReviews: hotel.tripAdvisorReviews,
              tripAdvisorPhotos: hotel.tripAdvisorPhotos,
              externalBookingLink: hotel.externalBookingLink,
              images: hotel.images,
              rooms: hotel.rooms,
              tripAdvisorLatestReviews: hotel.tripAdvisorLatestReviews,
              tripAdvisorLink: hotel.tripAdvisorLink,
            }))
          );
        }

        // Set available countries if exists
        if (data.availableCountries && Array.isArray(data.availableCountries)) {
          setAvailableCountries(data.availableCountries);
        }

        // Set exclusive additions if exists
        if (data.exclusiveAdditions && Array.isArray(data.exclusiveAdditions)) {
          setExclusiveAdditions(data.exclusiveAdditions);
        }

        // Set terms and conditions if exists
        if (data.termsAndConditions && Array.isArray(data.termsAndConditions)) {
          setTermsAndConditions(data.termsAndConditions);
        }

        // Set what's included if exists
        if (data.whatsIncluded && Array.isArray(data.whatsIncluded)) {
          setWhatsIncluded(data.whatsIncluded);
        }

        // Set itinerary if exists (note: your key is "iternatiy", so if that's intentional, use that)
        if (data.itinerary && Array.isArray(data.itinerary)) {
          setItinerary(data.itinerary);
        }

        // Find the cheapest price
        const cheapestPriceObj = findCheapestPrice(data.prices);
        if (cheapestPriceObj) {
          const formattedDate = new Date(cheapestPriceObj.startdate).toLocaleDateString("en-GB");
          console.log("Setting cheapest price:", cheapestPriceObj.price, "for date:", formattedDate);

          // Handle different airport data structures
          let airportId;
          if (cheapestPriceObj.airport && typeof cheapestPriceObj.airport === 'object') {
            airportId = cheapestPriceObj.airport._id;
          } else if (Array.isArray(cheapestPriceObj.airport) && cheapestPriceObj.airport.length > 0) {
            // If airport is an array, use the first one
            const firstAirport = cheapestPriceObj.airport[0];
            airportId = typeof firstAirport === 'object' ? firstAirport._id : firstAirport;
          } else {
            airportId = cheapestPriceObj.airport;
          }

          setSelectedDate(formattedDate);
          setSelectedAirport(airportId);
          setLeadPrice(cheapestPriceObj.price);
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        alert("This deal is no longer available."); // Show an alert
        navigate("/"); // Redirect to home page
      });
  }, [id, navigate, setLeadPrice]);

  useEffect(() => {
    const updateHeight = () => {
      if (window.innerWidth >= 768 && leftCardRef.current) {
        setLeftHeight(leftCardRef.current.offsetHeight);
      } else {
        setLeftHeight("auto");
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [tripData]);

  const handleBookingSubmit = (bookingData) => {
    console.log("Submitted Booking Data:", bookingData);
  };
  const priceMap = prices.reduce((acc, p) => {
    const date = new Date(p.startdate).toLocaleDateString("en-GB"); // e.g., 07/05/2025
    const key = `${date}_${p._id}`; // Combine date and unique ID

    acc[key] = {
      value: p.price,
      priceswitch: p.priceswitch ?? false,
      pricesid: p._id,
    };

    return acc;
  }, {});

  // Function to switch to the Price Calendar tab
  const switchToPriceCalendarTab = useCallback(() => {
    setActiveTab("price-calendar");
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="z-50 flex flex-col justify-center items-center w-full">
      <div className="">
        <div className="relative">
          <ImageGallery2 images={images} />
        </div>
        <div className="flex flex-col md:flex-row justify-between gap-2 items-start p-3 -mb-6 md:p-2 md:mb-0">
          <div
            ref={leftCardRef}
            className="bg-white border rounded-xl max-w-5xl w-full mx-auto mt-6 px-6 py-5 shadow-md relative"
          >
            {/* Top Deal Badge */}
            {tripData.isTopDeal && (
              <div className="absolute top-0 right-0 md:mt-0 md:mr-0 bg-yellow-400 text-sm font-semibold text-black px-3 py-1 rounded-tr-xl rounded-bl-xl flex items-center gap-1 shadow">
                <Sparkles className="w-4 h-4" />
                Top Deal
              </div>
            )}

            {/* Top Deal Badge */}
            {tripData.isHotdeal && (
              <div className="absolute top-0 right-0 md:mt-0 md:mr-0 shadow-md bg-orange-400 text-sm font-semibold text-black px-4 py-1 rounded-bl-xl rounded-tr-xl flex items-center gap-2">
                <Flame className="w-5 h-5" />
                Hot Deal
              </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              {/* LEFT SIDE */}
              <div className="md:flex hidden flex-col gap-2">
                {/* Title */}
                <div className="flex items-center gap-2 text-lg font-bold text-gray-900">
                  <Hotel className="w-5 h-5 text-blue-500" />
                  {tripData.title || "Trip Title"}
                </div>

                {/* Details Row */}
                <div className="md:flex hidden flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-red-500" />
                    {tripData.destinations && tripData.destinations.length > 0 ? (
                      <span>
                        {tripData.destination?.name}
                        {tripData.destinations.length > 0 && (
                          <>, {tripData.destinations.map(dest => dest.name).join(', ')}</>
                        )}
                      </span>
                    ) : (
                      tripData.destination?.name || "Unknown Location"
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Tag className="w-4 h-4 text-purple-500" />
                    {tripData.tag || "Save 20%"}
                  </div>
                  <div className="flex items-center gap-1">
                    <CalendarCheck className="w-4 h-4 text-green-600" />
                    {tripData.days || 0} Nights
                  </div>
                </div>
              </div>

              <div className="mobile view">
                {" "}
                <div className="flex-1 flex md:hidden flex-col gap-1 mt-6 md:mt-0">
                  <div className="flex items-center gap-2 text-xl md:text-2xl font-semibold text-gray-800">
                    <Hotel className="w-6 h-6 text-blue-500" />
                    {tripData.title || "Trip Title"}
                  </div>
                </div>
                <div> </div>
                {/* Middle Section */}
                <div className="grid grid-cols-1 md:hidden gap-4 md:-mt-8 mt-3">
                  <div className="flex items-center gap-2 text-base text-gray-600">
                    <MapPin className="w-6 h-7 text-red-500" />
                    {tripData.destinations && tripData.destinations.length > 0 ? (
                      <span>
                        {tripData.destination?.name}
                        {tripData.destinations.length > 0 && (
                          <>, {tripData.destinations.map(dest => dest.name).join(', ')}</>
                        )}
                      </span>
                    ) : (
                      tripData.destination?.name || "Unknown Location"
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-base text-gray-600">
                    <CalendarCheck className="w-6 h-7 text-green-600" />
                    {tripData.days || 0} Nights
                  </div>
                  <div className="flex items-center gap-2 text-base text-gray-600">
                    <Tag className="w-6 h-7 text-purple-500" />
                    {tripData.tag || "General Package"}
                  </div>
                </div>
                {/* Rating Section */}
                <div className="flex-1 flex md:hidden flex-col md:mt-8 mt-4 md:items-end gap-1">
                  <div className="flex items-center gap-1">
                    {rating ? (
                      <>
                        {renderStars()}
                        <span className="text-gray-800 text-base ml-1">
                          {rating.toFixed(1)} ({reviews} Reviews)
                        </span>
                      </>
                    ) : (
                      <span className="text-base text-gray-500 italic">
                        No reviews yet
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div className="md:flex hidden items-center gap-2 mt-2 md:mt-8 text-sm text-gray-800">
                {rating ? (
                  <>
                    {renderStars()}
                    <span className="ml-1">
                      {rating.toFixed(1)} ({reviews} Reviews)
                    </span>
                  </>
                ) : (
                  <span className="italic text-gray-500">No reviews yet</span>
                )}
              </div>
            </div>
          </div>
          {/* for mobile view */}
          {tripData.LowDeposite && (
            <div
              className="bg-white border border-blue-500 rounded-xl max-w-sm w-full md:hidden md:h-[leftHeight] h-auto mx-auto mt-6 px-4 py-3 shadow-md relative flex flex-col"
              style={{ height: leftHeight }}
            >
              <h2 className="text-md font-semibold -mt-1 text-blue-500">
                Low Deposit
              </h2>
              <hr className="border-1 border-blue-500" />
              <div className="overflow-y-auto pr-2" style={{ flex: 1 }}>
                {tripData.LowDeposite}
              </div>
            </div>
          )}
          {/* for pc view */}
          {tripData.LowDeposite && (
            <>
              <button
                onClick={() => setLowDepositOpen(true)}
                className="bg-white border border-blue-500 rounded-xl max-w-sm w-full md:flex hidden items-center justify-center mx-auto mt-6 px-4 py-3 shadow-md hover:bg-blue-50 transition-colors"
                style={{ height: "fit-content" }}
            >
                <span className="text-md font-semibold text-blue-500">
                Low Deposit
                </span>
              </button>
              
              {/* Low Deposit Popup */}
              {lowDepositOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="relative bg-white rounded-xl max-w-lg w-full p-6 shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold text-blue-500">Low Deposit</h2>
                      <button 
                        onClick={() => setLowDepositOpen(false)}
                        className="text-gray-500 hover:text-gray-800"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="overflow-y-auto max-h-96">
                {tripData.LowDeposite}
              </div>
            </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <div className="relative z-0 grid md:grid-cols-[2fr_1fr] grid-cols-1 gap-4 p-4 lg:p-6 mt-8 w-full max-w-7xl mx-auto items-start">
        {/* Mobile Price Card (Only visible on mobile) */}
        <div className="md:hidden w-full mb-6">
          <FilterElement
            dealId={id}
            sharedData={sharedData}
            updateSharedData={updateSharedData}
            dealtitle={tripData.title || " "}
            setSelectedTrip={setSelectedTrip}
            departureDates={prices.map((p) =>
              new Date(p.startdate).toLocaleDateString("en-GB")
            )}
            departureAirports={prices.map((p) => p.airport)}
            selectedDate={selectedDate}
            selectedAirport={selectedAirport}
            onBookingSubmit={handleBookingSubmit}
            onDateChange={setSelectedDate}
            onAirportChange={setSelectedAirport}
            priceMap={priceMap}
            prices={prices}
            switchToPriceCalendarTab={switchToPriceCalendarTab}
          />
        </div>
        
        {/* Left Side: Slides + Similar Deals */}
        <div className="flex flex-col gap-6 w-full max-w-4xl md:pr-4">
          <div className="rounded-xl shadow-md relative z-20">
            <FilterPageSlides
              tripData={tripData}
              itinerary={itinerary}
              prices={prices}
              hotels={hotels}
              Airport={selectedAirport}
              availableCountries={availableCountries}
              exclusiveAdditions={exclusiveAdditions}
              termsAndConditions={termsAndConditions}
              whatsIncluded={whatsIncluded}
              selectedTrip={selectedTrip}
              setSelectedTrip={setSelectedTrip}
              setSelectedDate={setSelectedDate}
              setSelectedAirport={setSelectedAirport}
              departureDates={prices.map((p) =>
                new Date(p.startdate).toLocaleDateString("en-GB")
              )}
              pricesid={prices.map((p) => p._id)}
              departureAirports={prices.map((p) => p.airport)}
              priceMap={priceMap}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>
          <div className="rounded-xl relative overflow-x-hidden shadow-md bg-gray-200 z-10">
            <SimilarDealsSlider
              destinationId={tripData.destination._id}
              dealId={id}
            />
          </div>
        </div>

        {/* Right Side: Filter Element (Only visible on desktop) */}
        <div className="w-full h-fit relative z-0 customfontstitle hidden md:block md:pl-4 md:self-start">
          <FilterElement
            dealId={id}
            sharedData={sharedData}
            updateSharedData={updateSharedData}
            dealtitle={tripData.title || " "}
            setSelectedTrip={setSelectedTrip}
            departureDates={prices.map((p) =>
              new Date(p.startdate).toLocaleDateString("en-GB")
            )}
            departureAirports={prices.map((p) => p.airport)}
            selectedDate={selectedDate}
            selectedAirport={selectedAirport}
            onBookingSubmit={handleBookingSubmit}
            onDateChange={setSelectedDate}
            onAirportChange={setSelectedAirport}
            priceMap={priceMap}
            prices={prices}
            switchToPriceCalendarTab={switchToPriceCalendarTab}
          />
        </div>
      </div>
    </div>
  );
};

export default FilterPage;
