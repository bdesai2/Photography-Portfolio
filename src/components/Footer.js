import React from 'react';
import CookieConsent from 'react-cookie-consent';
import { initGA } from './components/GoogleAnalytics';

const Footer = () => {
  return (
    <footer className="bg-neutral-950 text-neutral-400 py-8 text-center">
      <p className="text-sm">© 2026 Photofy Me Photography. All rights reserved.</p>
      <CookieConsent location="bottom" buttonText="Accept" cookieName="photofy-analytics-consent"
        style={{ background: "#1e293b" }}
        buttonStyle={{ background: "#3b82f6", color: "white", borderRadius: "8px", padding: "10px 20px" }}
        expires={365}
        onAccept={() => { initGA(); // Only initialize after consent
      }}>
      This website uses cookies to enhance your experience and analyze site traffic.
      </CookieConsent>
    </footer>
  );
};

export default Footer;