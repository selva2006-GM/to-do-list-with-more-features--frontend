import React from "react";
import { Link } from "react-router-dom";
import Nav from "./Nav";
import API_URL from "../config/api";

export default function Heatmap() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Nav />

      <main className="mx-auto max-w-6xl px-6 py-8">

        <Link
          to="/dashboard"
          className="text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          ← Back to Dashboard
        </Link>

        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Activity Heatmap
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Your task completion activity over time.
          </p>

          <div className="mt-8">
            {/* Heatmap will go here */}
            <p className="text-sm text-gray-500">
              Heatmap coming next.
            </p>
          </div>
        </div>

      </main>
    </div>
  );
}