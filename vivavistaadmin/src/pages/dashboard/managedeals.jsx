import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Alert,
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import {
  getDeals,
  createDeal,
  updateDeal,
  deleteDeal,
} from "../../../redux/actions/dealsActions";
import {
  getCountries,
  getCities,
} from "../../../redux/actions/locationActions";
import { getCategories } from "../../../redux/actions/categoryActions";
import { getHotels } from "../../../redux/actions/hotelActions";
import { getAirlines } from "../../../redux/actions/airlineActions";
import { getCruises } from "../../../redux/actions/cruiseActions";
import { getActivities } from "../../../redux/actions/activityActions";
import { getCars } from "../../../redux/actions/carActions";
import { getPackages } from "../../../redux/actions/packageActions";
import { getTransfers } from "../../../redux/actions/transferActions";
import { getInsurance } from "../../../redux/actions/insuranceActions";
import { getVisa } from "../../../redux/actions/visaActions";
import { getTours } from "../../../redux/actions/tourActions";
import { getGuides } from "../../../redux/actions/guideActions";
import { getExcursions } from "../../../redux/actions/excursionActions";
import { getCombos } from "../../../redux/actions/comboActions";
import { getCustomPackages } from "../../../redux/actions/customPackageActions";
import { getCustomTours } from "../../../redux/actions/customTourActions";
import { getCustomTransfers } from "../../../redux/actions/customTransferActions";
import { getCustomCars } from "../../../redux/actions/customCarActions";
import { getCustomCruises } from "../../../redux/actions/customCruiseActions";
import { getCustomHotels } from "../../../redux/actions/customHotelActions";
import { getCustomActivities } from "../../../redux/actions/customActivityActions";
import { getCustomInsurance } from "../../../redux/actions/customInsuranceActions";
import { getCustomVisa } from "../../../redux/actions/customVisaActions";
import { getCustomExcursions } from "../../../redux/actions/customExcursionActions";
import { getCustomGuides } from "../../../redux/actions/customGuideActions";
import { getCustomCombos } from "../../../redux/actions/customComboActions";
import axios from "axios";

const Managedeals = () => {
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const [imageError, setImageError] = useState("");
  const [videoError, setVideoError] = useState("");
  const [newVideos, setNewVideos] = useState([]);
  const [deletedVideos, setDeletedVideos] = useState([]);

  // Add this state for custom dropdowns
  const [customDropdownOpen, setCustomDropdownOpen] = useState({
    holidayCategories: false,
  });

  const [formData, setFormData] = useState({
    termsAndConditions: [""],
    tag: "",
    LowDeposite: "",
    images: [],
    videos: [],
    prices: [
      {
        country: "",
      },
    ],
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file));
      setFormData((prevData) => ({ ...prevData, images: [...prevData.images, ...newImages] }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent multiple submissions
    
    // Create a new FormData object
    const formSubmission = new FormData();
    
    // Deep copy and prepare data, excluding files
    const dataToSubmit = { ...formData };
    delete dataToSubmit.images;
    delete dataToSubmit.videos;

    // Append the JSON data
    formSubmission.append("data", JSON.stringify({
      ...dataToSubmit,
      deletedImages: [],
      deletedVideos: [],
    }));

    // Append new image files
    formData.images.forEach(file => {
      formSubmission.append("images", file);
    });

    // Append new video files
    newVideos.forEach(file => {
      formSubmission.append("videos", file);
    });

    setIsSubmitting(true);
    setLoading(true);

    try {
      if (currentDeal) {
        // Update existing deal
        await axios.put(`/deals/${currentDeal._id}`, formSubmission, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setAlert({ message: "Deal updated successfully", type: "green" });
      } else {
        // Create new deal
        await axios.post("/deals", formSubmission, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setAlert({ message: "Deal created successfully", type: "green" });
      }
      fetchDeals();
      handleCloseDialog();
    } catch (error) {
      setAlert({ message: "Error updating deal", type: "red" });
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  const handleDelete = (index) => {
    // Handle delete operation
  };

  return (
    <div>
      {/* Render your form components here */}
    </div>
  );
};

export default Managedeals;
 