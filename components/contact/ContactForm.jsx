"use client";
import { activeInputFocus } from "@/utlis/activeInputFocus";
import { useEffect, useState } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",

    message: "",
  });

  const [errors, setErrors] = useState({
    fullname: "",
    email: "",
    phone: "",

    message: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    activeInputFocus();
  }, []);

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "fullname":
        if (!value.trim()) {
          error = "სახელის შევსება სავალდებულოა";
        } else if (value.trim().length < 4) {
          error = "სახელი უნდა შეიცავდეს მინიმუმ 4 სიმბოლოს";
        }
        break;

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          error = "ელ-ფოსტის შევსება სავალდებულოა";
        } else if (!emailRegex.test(value)) {
          error = "გთხოვთ შეიყვანოთ სწორი ელ-ფოსტის მისამართი";
        }
        break;

      case "phone":
        const phoneRegex = /^\d+$/;
        if (!value.trim()) {
          error = "ტელეფონის ნომრის შევსება სავალდებულოა";
        } else if (!phoneRegex.test(value)) {
          error = "ტელეფონის ნომერი უნდა შეიცავდეს მხოლოდ ციფრებს";
        } else if (value.trim().length < 9) {
          error = "ტელეფონის ნომერი უნდა შეიცავდეს მინიმუმ 9 ციფრს";
        }
        break;

      case "message":
        if (!value.trim()) {
          error = "შეტყობინების შევსება სავალდებულოა";
        }
        break;

      default:
        break;
    }

    return error;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    // Clear error when user starts typing
    setErrors((prev) => ({
      ...prev,
      [id]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      newErrors[key] = error;
      if (error) {
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("შეტყობინება გაიგზავნა წარმატებით");
        setFormData({
          fullname: "",
          email: "",
          phone: "",

          message: "",
        });
        setErrors({
          fullname: "",
          email: "",
          phone: "",

          message: "",
        });
      } else {
        throw new Error(data.error || "შეტყობინების გაგზავნა ვერ მოხერხდა");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      alert(
        "Error: " + (error.message || "შეტყობინების გაგზავნა ვერ მოხერხდა")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section mt-120 mb-120">
      <div className="container-sub">
        <div className="mw-770">
          <h2 className="heading-44-medium mb-60 text-center wow fadeInUp">
            Leave us your info
          </h2>
          <div className="form-contact form-comment wow fadeInUp">
            <form onSubmit={handleSubmit} noValidate>
              <div className="row">
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label className="form-label" htmlFor="fullname">
                      Full Name *
                    </label>
                    <input
                      className={`form-control ${
                        errors.fullname ? "is-invalid" : ""
                      }`}
                      id="fullname"
                      type="text"
                      value={formData.fullname}
                      onChange={handleChange}
                      required
                    />
                    {errors.fullname && (
                      <div className="invalid-feedback">{errors.fullname}</div>
                    )}
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label className="form-label" htmlFor="email">
                      Email *
                    </label>
                    <input
                      className={`form-control ${
                        errors.email ? "is-invalid" : ""
                      }`}
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label className="form-label" htmlFor="phone">
                      Phone *
                    </label>
                    <input
                      className={`form-control ${
                        errors.phone ? "is-invalid" : ""
                      }`}
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                    {errors.phone && (
                      <div className="invalid-feedback">{errors.phone}</div>
                    )}
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="form-group"></div>
                </div>
                <div className="col-lg-12">
                  <div className="form-group">
                    <label className="form-label" htmlFor="message">
                      Message *
                    </label>
                    <textarea
                      className={`form-control ${
                        errors.message ? "is-invalid" : ""
                      }`}
                      id="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    ></textarea>
                    {errors.message && (
                      <div className="invalid-feedback">{errors.message}</div>
                    )}
                  </div>
                </div>
                <div className="col-lg-12">
                  <button
                    className="btn btn-primary w-full"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "იგზავნება..." : "გაგზავნა"}
                    <svg
                      className="icon-16 ml-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
