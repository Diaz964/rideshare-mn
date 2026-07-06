"use client";

import { useState } from "react";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  driversLicense: string;
  licenseState: string;
  licenseExpiry: string;
  carMake: string;
  carModel: string;
  carYear: string;
  carColor: string;
  licensePlate: string;
  insurance: string;
  insuranceExpiry: string;
  experience: string;
  availability: string;
  about: string;
}

const INITIAL_FORM: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  driversLicense: "",
  licenseState: "",
  licenseExpiry: "",
  carMake: "",
  carModel: "",
  carYear: "",
  carColor: "",
  licensePlate: "",
  insurance: "",
  insuranceExpiry: "",
  experience: "",
  availability: "",
  about: "",
};

const REQUIRED_FIELDS: (keyof FormData)[] = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "driversLicense",
  "licenseState",
  "licenseExpiry",
  "carMake",
  "carModel",
  "carYear",
  "carColor",
  "licensePlate",
  "insurance",
  "insuranceExpiry",
];

export default function DriverApplicationForm() {
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );

  function update(field: keyof FormData, value: string) {
    setForm({ ...form, [field]: value });
    if (errors[field]) {
      const next = { ...errors };
      delete next[field];
      setErrors(next);
    }
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormData, string>> = {};
    for (const f of REQUIRED_FIELDS) {
      if (!form[f].trim()) next[f] = "Required";
    }
    if (form.email && !/\S+@\S+\.\S+/.test(form.email))
      next.email = "Invalid email";
    if (form.phone && !/^[\d\s()+-]{7,}$/.test(form.phone))
      next.phone = "Invalid phone";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const existing = JSON.parse(
      localStorage.getItem("xelaju_applications") || "[]"
    );
    existing.push({
      ...form,
      id: `app_${Date.now()}`,
      status: "pending",
      submittedAt: new Date().toISOString(),
    });
    localStorage.setItem("xelaju_applications", JSON.stringify(existing));
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-burgundy-dark mb-2">
          Application Submitted!
        </h2>
        <p className="text-gray-600 mb-4">
          Thank you for your interest in driving with XELAJU. We will review
          your application and get back to you soon.
        </p>
        <p className="text-sm text-gray-500">
          We will contact you at {form.phone} or {form.email}.
        </p>
      </div>
    );
  }

  function inputClass(field: keyof FormData) {
    return `w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-burgundy ${
      errors[field] ? "border-red-400" : "border-burgundy-200"
    }`;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section>
        <h3 className="text-lg font-semibold text-burgundy-dark mb-4">
          Personal Information
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field
            label="First Name *"
            value={form.firstName}
            onChange={(v) => update("firstName", v)}
            error={errors.firstName}
            className={inputClass("firstName")}
          />
          <Field
            label="Last Name *"
            value={form.lastName}
            onChange={(v) => update("lastName", v)}
            error={errors.lastName}
            className={inputClass("lastName")}
          />
          <Field
            label="Email *"
            type="email"
            value={form.email}
            onChange={(v) => update("email", v)}
            error={errors.email}
            className={inputClass("email")}
          />
          <Field
            label="Phone Number *"
            type="tel"
            value={form.phone}
            onChange={(v) => update("phone", v)}
            error={errors.phone}
            className={inputClass("phone")}
            placeholder="(612) 555-0000"
          />
          <Field
            label="Street Address"
            value={form.address}
            onChange={(v) => update("address", v)}
            className={inputClass("address")}
          />
          <Field
            label="City"
            value={form.city}
            onChange={(v) => update("city", v)}
            className={inputClass("city")}
          />
          <Field
            label="State"
            value={form.state}
            onChange={(v) => update("state", v)}
            className={inputClass("state")}
            placeholder="MN"
          />
          <Field
            label="ZIP Code"
            value={form.zip}
            onChange={(v) => update("zip", v)}
            className={inputClass("zip")}
          />
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-burgundy-dark mb-4">
          Driver&apos;s License
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field
            label="License Number *"
            value={form.driversLicense}
            onChange={(v) => update("driversLicense", v)}
            error={errors.driversLicense}
            className={inputClass("driversLicense")}
          />
          <Field
            label="Issuing State *"
            value={form.licenseState}
            onChange={(v) => update("licenseState", v)}
            error={errors.licenseState}
            className={inputClass("licenseState")}
            placeholder="MN"
          />
          <Field
            label="Expiration Date *"
            type="date"
            value={form.licenseExpiry}
            onChange={(v) => update("licenseExpiry", v)}
            error={errors.licenseExpiry}
            className={inputClass("licenseExpiry")}
          />
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-burgundy-dark mb-4">
          Vehicle Information
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field
            label="Car Make *"
            value={form.carMake}
            onChange={(v) => update("carMake", v)}
            error={errors.carMake}
            className={inputClass("carMake")}
            placeholder="Toyota"
          />
          <Field
            label="Car Model *"
            value={form.carModel}
            onChange={(v) => update("carModel", v)}
            error={errors.carModel}
            className={inputClass("carModel")}
            placeholder="Camry"
          />
          <Field
            label="Year *"
            value={form.carYear}
            onChange={(v) => update("carYear", v)}
            error={errors.carYear}
            className={inputClass("carYear")}
            placeholder="2023"
          />
          <Field
            label="Color *"
            value={form.carColor}
            onChange={(v) => update("carColor", v)}
            error={errors.carColor}
            className={inputClass("carColor")}
            placeholder="White"
          />
          <Field
            label="License Plate *"
            value={form.licensePlate}
            onChange={(v) => update("licensePlate", v)}
            error={errors.licensePlate}
            className={inputClass("licensePlate")}
            placeholder="MN-ABC-123"
          />
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-burgundy-dark mb-4">
          Insurance
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field
            label="Insurance Provider *"
            value={form.insurance}
            onChange={(v) => update("insurance", v)}
            error={errors.insurance}
            className={inputClass("insurance")}
            placeholder="State Farm"
          />
          <Field
            label="Policy Expiration *"
            type="date"
            value={form.insuranceExpiry}
            onChange={(v) => update("insuranceExpiry", v)}
            error={errors.insuranceExpiry}
            className={inputClass("insuranceExpiry")}
          />
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-burgundy-dark mb-4">
          Additional Information
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Driving Experience
            </label>
            <select
              value={form.experience}
              onChange={(e) => update("experience", e.target.value)}
              className="w-full px-3 py-2 border border-burgundy-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-burgundy"
            >
              <option value="">Select experience</option>
              <option value="1-2">1-2 years</option>
              <option value="3-5">3-5 years</option>
              <option value="5-10">5-10 years</option>
              <option value="10+">10+ years</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Availability
            </label>
            <select
              value={form.availability}
              onChange={(e) => update("availability", e.target.value)}
              className="w-full px-3 py-2 border border-burgundy-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-burgundy"
            >
              <option value="">Select availability</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="weekends">Weekends only</option>
              <option value="flexible">Flexible</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tell us about yourself
            </label>
            <textarea
              value={form.about}
              onChange={(e) => update("about", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-burgundy-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-burgundy resize-none"
              placeholder="Why do you want to drive with XELAJU?"
            />
          </div>
        </div>
      </section>

      <button
        type="submit"
        className="w-full py-4 rounded-full bg-burgundy text-white font-semibold text-lg hover:bg-burgundy-dark transition-colors shadow-lg"
      >
        Submit Application
      </button>

      <p className="text-xs text-gray-400 text-center">
        By submitting this application, you agree that all information provided
        is accurate and complete. We will review your application and contact you
        within 2-3 business days.
      </p>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
  className: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={className}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
