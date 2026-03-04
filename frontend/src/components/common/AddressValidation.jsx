export const validateAddress = (data) => {
    console.log(data,'dataaass')
  const errors = [];

  const requiredFields = [
    "name",
    "house",
    "locality",
    "city",
    "state",
    "pincode",
    "phone",
    "alternativePhone"
  ];

  requiredFields.forEach((field) => {
    console.log(data[field])
    if (!String(data[field])?.trim()) {
      errors.push(`${field} is required`);
    }
  });

  if (data.name && !/^[a-zA-Z\s]{2,50}$/.test(data.name.trim())) {
    errors.push("Name should only contain letters and be 2–50 characters long");
  }

  if (data.house && !/^[a-zA-Z0-9\s/-]{1,20}$/.test(data.house.trim())) {
    errors.push("House number contains invalid characters");
  }

  ["locality", "city", "state"].forEach((field) => {
    if (data[field] && !/^[a-zA-Z\s]{2,50}$/.test(data[field].trim())) {
      errors.push(`${field} should only contain letters`);
    }
  });

  if (data.pin && !/^\d{6}$/.test(String(data.pin).trim())) {
    errors.push("PIN code must be a 6-digit number");
  }

  if (data.phone && !/^[6-9]\d{9}$/.test(String(data.phone).trim())) {
    errors.push("Phone number must be a valid 10-digit number");
  }

  if (data.alternativePhone) {
    if (!/^[6-9]\d{9}$/.test(String(data.alternativePhone).trim())) {
      errors.push("Alternative phone number must be 10 digits");
    }
    console.log(data.alte)

    if (data.alternativePhone === data.phone) {
      errors.push("Alternative phone number cannot be the same as primary");
    }
  }

  return errors;
};