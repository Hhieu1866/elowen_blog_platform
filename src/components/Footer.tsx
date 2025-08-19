import React from "react";

const Footer = () => {
  const marqueeTexts = Array(12).fill("NEWSLETTER+++");

  const footerLinks = [
    ["Art", "Sculptures", "Street Art"],
    ["Magazine", "Podcast", "Authors"],
    ["Styleguide", "Licensing", "Changelog"],
  ];

  return (
    <div className="mt-32 h-auto overflow-hidden bg-black">
      {/* Marquee */}
      <div className="animate-marquee flex py-4">
        {marqueeTexts.map((text, idx) => (
          <span
            key={idx}
            className="mx-3 text-2xl font-bold tracking-wider text-white"
          >
            {text}
          </span>
        ))}
      </div>

      {/* Newsletter */}
      <div className="container mx-auto flex flex-col items-start justify-between gap-8 py-32 md:flex-row md:gap-0">
        <p className="flex-1 text-6xl font-bold uppercase text-white md:text-8xl">
          Design new to <br /> your inbox
        </p>
        <div className="flex flex-1 justify-end gap-4">
          <input type="text" placeholder="email" className="w-96 p-4" />
          <button className="bg-white p-4 text-black">SIGN UP</button>
        </div>
      </div>

      {/* Footer Links */}
      <div className="container mx-auto grid grid-cols-2 gap-8 md:grid-cols-4">
        <h1 className="text-3xl font-bold uppercase text-white">Elowen</h1>
        {footerLinks.map((links, idx) => (
          <div key={idx} className="border-t border-t-white/20">
            <ul className="flex flex-col text-white">
              {links.map((link, i) => (
                <li key={i} className="py-3">
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
