import React from "react";

const Footer = () => {
  const marqueeTexts = Array(12).fill("NEWSLETTER+++");

  const footerLinks = [
    ["Art", "Sculptures", "Street Art"],
    ["Magazine", "Posts", "Authors"],
    ["Styleguide", "Licensing", "Changelog"],
  ];

  return (
    <div className="mt-32 h-auto overflow-hidden bg-black">
      {/* Marquee */}
      <div className="animate-marquee flex py-4">
        {marqueeTexts.map((text, idx) => (
          <span
            key={idx}
            className="mx-3 text-base font-bold tracking-wider text-white md:text-2xl"
          >
            {text}
          </span>
        ))}
      </div>

      {/* Newsletter */}
      <div className="container mx-auto flex flex-col gap-6 px-6 py-16 md:flex-row md:items-center md:justify-between md:gap-0 md:py-32">
        <p className="flex-1 text-4xl font-bold uppercase text-white md:text-8xl">
          Design new to <br className="hidden md:block" /> your inbox
        </p>

        <div className="flex w-full flex-col gap-4 md:w-auto md:flex-row md:justify-end">
          <input
            type="text"
            placeholder="email"
            className="w-full rounded-sm p-4 md:w-96"
          />
          <button className="bg-white p-4 text-black md:min-w-[120px]">
            SIGN UP
          </button>
        </div>
      </div>

      {/* Footer Links */}
      <div className="container mx-auto grid grid-cols-1 gap-8 px-6 pb-16 md:grid-cols-4 md:gap-12">
        <h1 className="text-2xl font-bold uppercase text-white md:text-3xl">
          Elowen
        </h1>
        {footerLinks.map((links, idx) => (
          <div key={idx} className="border-t border-t-white/20 pt-4 md:pt-0">
            <ul className="flex flex-col text-white">
              {links.map((link, i) => (
                <li key={i} className="py-2 md:py-3">
                  {link}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Footer;
