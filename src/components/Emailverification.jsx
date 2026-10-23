import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../config/api";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const inputs = useRef([]);

  const email = sessionStorage.getItem("verificationEmail");

  function handleChange(value, index) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const updated = [...otp];
    updated[index] = digit;
    setOtp(updated);
    setError("");
    setMessage("");

    if (digit && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(e, index) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e) {
    e.preventDefault();
    const digits = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    const updated = ["", "", "", "", "", ""];
    digits.split("").forEach((digit, i) => {
      updated[i] = digit;
    });

    setOtp(updated);
    inputs.current[Math.min(digits.length, 5)]?.focus();
  }

  async function verifyEmail(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email) {
      setError("Email not found. Please register again.");
      return;
    }

    const code = otp.join("");

    if (code.length !== 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid verification code.");
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      sessionStorage.removeItem("verificationEmail");
      setMessage("Email verified successfully!");
      navigate("/login", {
        state: { message: "Email verified successfully. Please log in." },
      });
    } catch (err) {
      setError(err.message || "Unable to verify email.");
    } finally {
      setLoading(false);
    }
  }

  async function resendCode() {
    if (!email) {
      setError("Email not found. Please register again.");
      return;
    }

    setResending(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not resend the code.");
      }

      setOtp(["", "", "", "", "", ""]);
      setMessage("A new verification code has been sent.");
      inputs.current[0]?.focus();
    } catch (err) {
      setError(err.message || "Unable to resend the code.");
    } finally {
      setResending(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-xl">
        <form
          onSubmit={verifyEmail}
          className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-10"
        >
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="mb-4 rounded-lg bg-gray-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Back
          </button>

          <h1 className="text-2xl font-semibold text-gray-900">
            Verify your email
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            We&apos;ve sent a verification code to your email address.
          </p>

          {email && (
            <p className="mt-2 break-all text-sm font-medium text-gray-700">
              {email}
            </p>
          )}

          <div className="my-8 flex justify-center text-gray-500">
            <svg
              viewBox="0 0 24 24"
              width="68"
              height="68"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
              <path d="M12 1v2 M5 2l2 2 M19 2l-2 2" />
            </svg>
          </div>

          <label className="mb-3 block text-sm font-medium text-gray-700">
            Verification code
          </label>

          <div className="flex justify-between gap-2 sm:gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputs.current[index] = el)}
                type="text"
                inputMode="numeric"
                autoComplete={index === 0 ? "one-time-code" : "off"}
                aria-label={`Verification digit ${index + 1}`}
                value={digit}
                maxLength={1}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                className="h-12 w-full min-w-0 rounded-lg border border-gray-300 text-center text-lg text-gray-900 outline-none transition focus:border-gray-500 focus:ring-1 focus:ring-gray-500 sm:h-14"
              />
            ))}
          </div>

          <p className="mt-3 text-sm text-gray-500">
            Enter the 6-digit code from your inbox.
          </p>

          {error && (
            <p role="alert" className="mt-4 text-sm text-red-600">
              {error}
            </p>
          )}

          {message && (
            <p role="status" className="mt-4 text-sm text-green-700">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-7 w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>

          <p className="mt-6 text-center text-sm text-gray-500">
            Didn&apos;t receive the code?{" "}
            <button
              type="button"
              onClick={resendCode}
              disabled={resending}
              className="font-medium text-gray-900 hover:underline disabled:opacity-60"
            >
              {resending ? "Sending..." : "Resend code"}
            </button>
          </p>

          <p className="mt-4 text-center text-sm text-gray-500">
            Check your spam folder if you don&apos;t see the email.
          </p>
        </form>
      </div>
    </main>
  );
}