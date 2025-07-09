"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { IoLogoSlack, IoLogoUsd } from "react-icons/io";
import { SiEthereum } from "react-icons/si";
import { TiStarFullOutline } from "react-icons/ti";

const RemittanceCard = () => {
  const [amount, setAmount] = useState("100");
  const [toCurrency, setToCurrency] = useState("ETH");

  const conversionRates: Record<string, number> = {
    ETH: 0.00031,
    SOL: 0.012,
    MATIC: 0.55,
    BNB: 0.0029,
  };

  const getConvertedAmount = () => {
    const rate = conversionRates[toCurrency] || 0;
    return (parseFloat(amount) * rate).toFixed(4);
  };

  return (
    <motion.div
      className="max-w-4xl -mt-20 sm:mt-4  z-[100] mx-auto p-6 bg-[#1a1a1a] text-white backdrop-blur-md shadow-xl rounded-xl space-y-6 border border-neutral-800"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* TrustPilot section */}
      <div className="flex items-center space-x-2 text-sm text-gray-400">
        <div className="flex -gap-2">
          <TiStarFullOutline className="text-yellow-500 text-lg" />
          <TiStarFullOutline className="text-yellow-500 text-lg" />
          <TiStarFullOutline className="text-yellow-500 text-lg" />
        </div>
        <IoLogoSlack className="text-blue-500 text-lg" />
        <span>4.8 out of 5 based on 67,044+ reviews</span>
      </div>

      {/* Exchange Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
        {/* Sender */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label className="block text-sm font-medium text-gray-400">
            You Send (USDTc)
          </label>
          <div className="flex items-center border border-neutral-700 bg-neutral-900 rounded-md px-3 py-2">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 text-lg font-semibold bg-transparent text-white placeholder-gray-500 outline-none"
              placeholder="Amount in USDT"
            />
            <div className="flex items-center space-x-2 ml-3">
              <IoLogoUsd />
              <span className="text-sm font-semibold text-white">USDT</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            💸 Transfer fee: <strong>$1.5 USD</strong>
          </p>
        </motion.div>

        {/* Receiver */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <label className="block text-sm font-medium text-gray-400">
            Recipient Receives
          </label>
          <div className="flex items-center border border-neutral-700 bg-neutral-900 rounded-md px-3 py-2">
            <input
              type="text"
              value={getConvertedAmount()}
              readOnly
              className="flex-1 text-lg font-semibold bg-transparent text-white placeholder-gray-500 outline-none"
            />
            <div className="flex items-center space-x-2 ml-3">
              <SiEthereum />
              <select
                className="bg-g text-white font-medium outline-none"
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
              >
                <option value="ETH">ETH</option>
                <option value="SOL">SOL</option>
                <option value="MATIC">MATIC</option>
                <option value="BNB">BNB</option>
              </select>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            📦 Estimated delivery: <strong>Within 5 minutes</strong>
          </p>
        </motion.div>
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <button
          type="submit"
          className="flex justify-center gap-2 items-center mx-auto shadow-xl text-black text-md bg-white font-semibold hover:bg-[#baff38]/80 backdrop-blur-md
          isolation-auto before:absolute before:w-full before:transition-all 
         before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full 
         before:bg-red-500 before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 
         relative z-[100] px-3 py-1.5 overflow-hidden rounded-full group "
        >
          Send Now
          <svg
            className="w-9 h-9 justify-end bg-black group-hover:rotate-90 group-hover:bg-black -50 text-white ease-linear duration-300
           rounded-full  group-hover:border-none p-2 rotate-45"
            viewBox="0 0 16 19"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z"
              className="fill-white group-hover:fill-white"
            ></path>
          </svg>
        </button>
      </motion.div>
    </motion.div>
  );
};

export default RemittanceCard;
