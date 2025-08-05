import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#1A6EB5] to-[#073CA4] rounded-3xl text-white py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Copyright */}
        <p className="text-sm md:text-base">
          &copy; 2025 BMKG Provinsi Bengkulu. All rights reserved.
        </p>

        {/* Social Icons */}
        <div className="flex space-x-6 text-lg md:text-xl">
          <a
            href="#"
            aria-label="Facebook"
            className="hover:text-cyan-400 transition"
          >
            <FaFacebookF />
          </a>
          <a
            href="#"
            aria-label="Twitter"
            className="hover:text-cyan-400 transition"
          >
            <FaTwitter />
          </a>
          <a
            href="https://www.instagram.com/info_bmkg_bengkulu/"
            aria-label="Instagram"
            className="hover:text-cyan-400 transition"
          >
            <FaInstagram />
          </a>
          <a
            href="https://www.youtube.com/@infobmkgbengkulu3513"
            aria-label="Youtube"
            className="hover:text-cyan-400 transition"
          >
            <FaYoutube />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
