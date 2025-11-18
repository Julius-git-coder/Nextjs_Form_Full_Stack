export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validateForm = (formData, currentPage) => {
  const newErrors = {};

  // Email validation
  if (!formData.email) {
    newErrors.email = "Email is required";
  } else if (!validateEmail(formData.email)) {
    newErrors.email = "Please enter a valid email";
  }

  // Password validation (skip for forgot password)
  if (currentPage !== "forgot") {
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
  }

  // Signup-specific validation
  if (currentPage === "signup") {
    if (!formData.firstName) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName) {
      newErrors.lastName = "Last name is required";
    }
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "You must accept the terms and conditions";
    }
  }

  return newErrors;
};

export const clearFieldError = (fieldName, errors, setErrors) => {
  if (errors[fieldName]) {
    setErrors((prev) => ({ ...prev, [fieldName]: "" }));
  }
};
