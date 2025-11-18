import { useState } from "react";
import { validateForm } from "../utils/validation";
import { INITIAL_FORM_STATE } from "../utils/constants";

export function useAuthForm() {
  const [currentPage, setCurrentPage] = useState("login");
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async () => {
    const newErrors = validateForm(formData, currentPage);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      setTimeout(() => {
        console.log("Form submitted:", { page: currentPage, data: formData });
        setIsLoading(false);
        alert(`${currentPage} functionality would be implemented here!`);
      }, 1500);
    }
  };

  const handleSocialLogin = (provider) => {
    alert(`${provider} authentication would be implemented here!`);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const navigateTo = (page) => {
    setCurrentPage(page);
    setErrors({});
    setShowPassword(false);
    if (page !== currentPage) {
      setFormData(INITIAL_FORM_STATE);
    }
  };

  return {
    currentPage,
    formData,
    showPassword,
    errors,
    isLoading,
    handleInputChange,
    handleSubmit,
    handleSocialLogin,
    handleKeyPress,
    navigateTo,
    setShowPassword,
  };
}
