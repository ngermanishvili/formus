"use client";

import { activeInputFocus } from "@/utlis/activeInputFocus";
import { useEffect } from "react";
import SideBar from "./SideBar";
import Image from "next/image";
import Link from "next/link";

export default function BookingPayment() {
  useEffect(() => {
    // Focus event
    activeInputFocus();
  }, []);
  return (
    <div className="box-row-tab mt-50">
      <div className="box-tab-left">
        <div className="box-content-detail">
          <h3 className="heading-24-medium color-text mb-30 wow fadeInUp">
            Billing Address
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
                <div className="col-lg-12">
                  <div className="form-group">
                    <label className="form-label" htmlFor="company">
                      Company
                    </label>
                    <input
                      className="form-control"
                      id="company"
                      type="text"
                      defaultValue=""
                    />
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="form-group">
                    <label className="form-label" htmlFor="address">
                      Address
                    </label>
                    <input
                      className="form-control"
                      id="address"
                      type="text"
                      defaultValue=""
                    />
                  </div>
                </div>
                <div className="col-lg-4 col-md-4 col-sm-12">
                  <div className="form-group">
                    <label className="form-label" htmlFor="country">
                      Country
                    </label>
                    <select
                      defaultValue={"UK"}
                      className="form-control"
                      id="country"
                    >
                      <option value=""></option>
                      <option value="UK">UK</option>
                      <option value="USA">USA</option>
                      <option value="VN">Vietnam</option>
                      <option value="JP">Japan</option>
                    </select>
                  </div>
                </div>
                <div className="col-lg-4 col-md-4 col-sm-12">
                  <div className="form-group">
                    <label className="form-label" htmlFor="city">
                      City
                    </label>
                    <select
                      defaultValue={"London"}
                      className="form-control"
                      id="city"
                    >
                      <option value=""></option>
                      <option value="London">London</option>
                      <option value="New York">New York</option>
                      <option value="Paris">Paris</option>
                      <option value="Berlin">Berlin</option>
                    </select>
                  </div>
                </div>
                <div className="col-lg-4 col-md-4 col-sm-12">
                  <div className="form-group">
                    <label className="form-label" htmlFor="zipcode">
                      ZIP / Postal code
                    </label>
                    <input
                      className="form-control"
                      id="zipcode"
                      type="text"
                      defaultValue="850"
                    />
                  </div>
                </div>
              </div>
            </form>
            <div className="mt-30"></div>
            <h3 className="heading-24-medium color-text mb-30">
              Select Payment Method
            </h3>
            <div className="form-contact form-comment">
              <div className="row">
                <div className="col-lg-12">
                  <div className="form-group">
                    <select className="form-control">
                      <option value="Credit Card">Credit Card</option>
                      <option value="Paypal">Paypal</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-30"></div>
            <h3 className="heading-24-medium color-text mb-30">
              Credit Card Payment
            </h3>
            <div className="form-contact form-comment">
              <div className="row">
                <div className="col-lg-12">
                  <div className="form-group">
                    <label className="form-label" htmlFor="cardholdername">
                      Card Holder Name
                    </label>
                    <input
                      className="form-control"
                      id="cardholdername"
                      type="text"
                      defaultValue=""
                    />
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="form-group">
                    <label className="form-label" htmlFor="cardnumber">
                      Card Number
                    </label>
                    <input
                      className="form-control"
                      id="cardnumber"
                      type="text"
                      defaultValue=""
                    />
                  </div>
                </div>
                <div className="col-lg-3 col-md-4 col-sm-12">
                  <div className="form-group">
                    <label className="form-label" htmlFor="month">
                      Month
                    </label>
                    <select
                      defaultValue={12}
                      className="form-control"
                      id="month"
                    >
                      <option value=""></option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="4">5</option>
                      <option value="4">6</option>
                      <option value="4">7</option>
                      <option value="4">8</option>
                      <option value="4">9</option>
                      <option value="4">10</option>
                      <option value="4">11</option>
                      <option value="4">12</option>
                    </select>
                  </div>
                </div>
                <div className="col-lg-3 col-md-4 col-sm-12">
                  <div className="form-group">
                    <label className="form-label" htmlFor="year">
                      Year
                    </label>
                    <select
                      defaultValue={"2023"}
                      className="form-control"
                      id="year"
                    >
                      <option value=""></option>
                      <option value="2023">2023</option>
                      <option value="2024">2024</option>
                      <option value="2025">2025</option>
                      <option value="2026">2026</option>
                      <option value="2027">2027</option>
                      <option value="2028">2028</option>
                    </select>
                  </div>
                </div>
                <div className="col-lg-6 col-md-4 col-sm-12">
                  <div className="form-group">
                    <label className="form-label" htmlFor="cvv">
                      CVV
                    </label>
                    <input
                      className="form-control"
                      id="cvv"
                      type="text"
                      defaultValue="850"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-0">
              <Image
                width={313}
                height={32}
                src="/assets/imgs/page/booking/payment-card.png"
                alt="luxride"
              />
            </div>
            <p className="text-14 mt-10 color-text">
              The credit card must be issued in the driver's name. Debit cards
              are accepted at some locations and for some car categories.
            </p>
            <div className="mt-30">
              <label className="mb-10 mb-15" htmlFor="agree-cb">
                <input className="cb-agree" id="agree-cb" type="checkbox" />I
                accept the Terms & Conditions - Booking Conditions and Privacy
                Policy. *
              </label>
              <label htmlFor="subscriber">
                <input
                  className="cb-subscriber"
                  id="subscriber"
                  type="checkbox"
                />
                I want to subscribe to Transfeero’s newsletter (Travel tips and
                special deals)
              </label>
            </div>
          </div>
          <div className="mt-30 mb-120 wow fadeInUp">
            <Link
              className="btn btn-primary btn-primary-big w-100"
              href="/booking-receved"
            >
              Book Now
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
