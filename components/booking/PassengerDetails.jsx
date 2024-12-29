"use client";
import React, { useEffect } from "react";
import SideBar from "./SideBar";
import Link from "next/link";

export default function PassengerDetails() {
  useEffect(() => {
    // Focus event
    document
      .querySelectorAll(
        ".form-comment input, .form-comment textarea, .form-comment select"
      )
      ?.forEach(function (element) {
        element?.addEventListener("focus", function () {
          this?.closest(".form-group").classList.add("focused");
        });
      });

    // Blur event
    document
      .querySelectorAll(
        ".form-comment input, .form-comment textarea, .form-comment select"
      )
      ?.forEach(function (element) {
        element.addEventListener("blur", function () {
          var inputValue = this.value;
          if (inputValue === "") {
            this.classList.remove("filled");
            this.closest(".form-group").classList.remove("focused");
          } else {
            this.classList.add("filled");
          }
        });
      });

    // Check for pre-filled inputs
    document
      .querySelectorAll(
        ".form-comment input, .form-comment textarea, .form-comment select"
      )
      ?.forEach(function (element) {
        if (element?.value !== "") {
          element?.closest(".form-group").classList.add("focused");
          element.classList.add("filled");
        }
      });
  }, []);
  return (
    <div className="box-row-tab mt-50">
      <div className="box-tab-left">
        <div className="box-content-detail">
          <h3 className="heading-24-medium color-text mb-30 wow fadeInUp">
            Passenger Details
          </h3>
          <div className="form-contact form-comment wow fadeInUp">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="row">
                <div className="col-lg-6">
                  <div className="form-group">
                    <label className="form-label" htmlFor="fullname">
                      Name
                    </label>
                    <input
                      className="form-control"
                      id="fullname"
                      type="text"
                      defaultValue=""
                    />
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="form-group">
                    <label className="form-label" htmlFor="lastname">
                      Last Name
                    </label>
                    <input
                      className="form-control"
                      id="lastname"
                      type="text"
                      defaultValue=""
                    />
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="form-group">
                    <label className="form-label" htmlFor="email">
                      Email Address
                    </label>
                    <input
                      className="form-control"
                      id="email"
                      type="text"
                      defaultValue="creativelayers088@gmail.com"
                    />
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="form-group">
                    <label className="form-label" htmlFor="phone">
                      Phone Number
                    </label>
                    <input
                      className="form-control"
                      id="phone"
                      type="text"
                      defaultValue="+29 954 029 13"
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="mt-30"></div>
          <h3 className="heading-24-medium color-text mb-30 wow fadeInUp">
            Options
          </h3>
          <div className="form-contact form-comment wow fadeInUp">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="row">
                <div className="col-lg-6">
                  <div className="form-group">
                    <label className="form-label" htmlFor="passengers">
                      Passengers
                    </label>
                    <select className="form-control" id="passengers">
                      <option value=""></option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                      <option value="8">8</option>
                      <option value="9">9</option>
                      <option value="10">10</option>
                    </select>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="form-group">
                    <label className="form-label" htmlFor="luggage">
                      Luggage
                    </label>
                    <select className="form-control" id="luggage">
                      <option value=""></option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                      <option value="8">8</option>
                      <option value="9">9</option>
                      <option value="10">10</option>
                    </select>
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="form-group">
                    <label className="form-label" htmlFor="notes">
                      Notes to driver
                    </label>
                    <textarea
                      className="form-control"
                      id="notes"
                      rows="5"
                    ></textarea>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="mt-30 mb-120 wow fadeInUp">
            <Link
              className="btn btn-primary btn-primary-big w-100"
              href="/booking-payment"
            >
              Continue
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
            </Link>
          </div>
        </div>
      </div>
      <SideBar />
    </div>
  );
}
