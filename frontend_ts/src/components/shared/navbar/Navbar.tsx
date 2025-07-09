/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import ThemeButton from "../themeButton/ThemeButton";
import { FaWallet } from "react-icons/fa";

const Navbar = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const connectWallet = async () => {
    const { ethereum } = window as any;
    if (!ethereum) {
      alert("MetaMask not detected. Please install it to connect.");
      return;
    }

    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setWalletAddress(accounts[0]);
    } catch (error) {
      console.error("Wallet connection failed:", error);
    }
  };

  const shortenAddress = (address: string) =>
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <div className="w-full justify-between items-center flex flex-col">
      <header className="fixed w-full top-5 z-[500] mx-auto flex items-center justify-between px-6 py-3 rounded-full bg-[#21211f] backdrop-blur-md shadow-md max-w-5xl mx-auto mt-6 border border-black/20">
        <div className="w-full flex items-center justify-between">
          {/* Logo */}
          <div className="flex shrink-0">
            <a href="/" className="flex items-center gap-2">
              <img
                src="https://framerusercontent.com/images/PJNHXIJ2aoby0HhcegQEMzXqc.svg"
                alt="Logo"
                className="w-28 sm:w-44"
              />
            </a>
          </div>

          {/* Links */}
          <div className="hidden md:flex gap-8">
            <a href="#" className="text-md text-gray-200 hover:text-[#a4ff4c]">
              How it works
            </a>
            <a href="#" className="text-md text-gray-200 hover:text-[#a4ff4c]">
              About
            </a>
            <a href="#" className="text-md text-gray-200 hover:text-[#a4ff4c]">
              Pricing
            </a>
            <a href="#" className="text-md text-gray-200 hover:text-[#a4ff4c]">
              Contact
            </a>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Wallet Connect Button */}
            {walletAddress ? (
              <span
                className="flex items-center gap-2 px-5 py-3 rounded-full text-sm bg-gradient-to-r from-neutral-800 to-neutral-900 text-white border border-neutral-700 shadow-inner shadow-black/30 hover:ring-2 hover:ring-[#a4ff4c] transition-all cursor-default"
                title="Connected with MetaMask"
              >
                <FaWallet className="text-[#a4ff4c]" />
                {shortenAddress(walletAddress)}
              </span>
            ) : (
              <ThemeButton connectWallet={connectWallet} />
            )}
          </div>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
