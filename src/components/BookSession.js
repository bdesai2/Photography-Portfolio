import React, { useState } from "react";
import { Calendar, Clock, DollarSign, Check, Camera } from "lucide-react";
// BookSession: a simple booking form for clients to request a photography session.
const calandlyUrl = 'https://calendly.com/bdesai2';
const BookingSystem = () => {
    const [ selectedPackage, setSelectedPackage ] = useState(null);
    const [ showCalendly, setShowCalendly ] = useState(false);

    //Photography packages
    const packages = [
        { id: 'portrait', name: 'Portrait Session', price: '200', duration: "1 hour", 
            calendlyevent: '/portrait',
            features: [
                'Professional outdoor or studio session', '1 hour of shooting time', 
                '15 - 20 professionally edited high-resolution photos', 'Online gallery for viewing and downloading'
            ], icon: Camera, color: 'teal'
        },
        { id: 'family', name: 'Family Session', price: '350', duration: "2 hours", 
            calendlyevent: '/family',
            features: [
                'Perfect for families', '2 hours of shooting time', 
                '15 - 20 professionally edited high-resolution photos', 'Online gallery for viewing and downloading'
            ], icon: Camera, color: 'blue'
        },
        { id: 'event', name: 'Event Coverage', price: '600', duration: "4 hours",
            calendlyevent: '/event',
            features: [
                'Birthday, anniversary, corporate event, concert Etc.', 'Up to 4 hours of coverage', 
                'Pre-event consultation to understand your needs',
                '150 - 200 professionally edited high-resolution photos', 'Online gallery for viewing and downloading'
            ], icon: Camera, color: 'orange'
        }
    ];

    const openCalendly = (pkg) => {
        setSelectedPackage(pkg);
        //open Calendly widget
        if(window.Calendly) {
            window.Calendly.initPopupWidget({ url: calandlyUrl + pkg.calendlyevent });
        } else {
            //fallback to opening in new tab if Calendly script isn't loaded
            window.open(calandlyUrl + pkg.calendlyevent, '_blank');
        }

        //track booking click in GA
        if(window.gtag) {
            window.gtag('event', 'booking_initiated', {
                'event_label': pkg.name,
                'event_price': pkg.price
            });
        }
    };

    return (
        <div className="min-h-screen bg-neutral-900 py-20 px-4">
            {/* Calendly Widget Script - Add to public/index.html */}
            {/* <script src="https://assets.calendly.com/assets/external/widget.js"></script> */}
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <h1 className="text-4xl md:text-5xl font-light text-white mb-12 text-center tracking-wide">
                    Book a Photography Session
                </h1>
                <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
                    Choose the perfect photography package for your needs. 
                    All packages include professional editing and high-resolution digital files.
                </p>
            </div>

            {/* Packages Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 py-20 mb-16">
                {packages.map((pkg) => (
                    <div key={pkg.id}
                    className="bg-neutral-800 rounded-2xl p-6 hover:transform hover:scale-105 transition-all border border-neutral-700 hover:border-blue-500">
                        {/* Package Header */}
                        <div className="mb-6">
                            <div className={`w-12 h-12 rounded-lg bg-${pkg.color}-600 bg-opacity-20 flex items-center justify-center mb-4`}>
                                <pkg.icon className={`text-${pkg.color}-500`} size={24} />
                            </div>
                            <h3 className="text-2xl font-light text-white mb-2">{pkg.name}</h3>
                            <div className="flex items-center gap-2 text-neutral-400 text-sm mb-3">
                                <Clock size={16} />
                                <span>{pkg.duration}</span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-white">${pkg.price}</span>
                                <span className="text-neutral-500">starting</span>
                            </div>
                        </div>

                        {/* Features */}
                        <ul className="space-y-3 mb-6">
                            {pkg.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-neutral-300 text-sm">
                                <Check size={16} className="text-green-500 shrink-0 mt-0.5" />
                                <span>{feature}</span>
                            </li>
                            ))}
                        </ul>

                        {/* Book Button */}
                        <button onClick={() => openCalendly(pkg)}
                            className={`w-full py-3 bg-${pkg.color}-600 hover:bg-${pkg.color}-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2`}>
                            <Calendar size={18} />
                            Book Now
                        </button>
                    </div>
                ))}
            </div>

            {/* Process Timeline */}
            <div className="bg-neutral-800 rounded-2xl p-8 mb-16">
                <h2 className="text-3xl font-light text-white mb-8 text-center">Booking Process</h2>
                <div className="grid md:grid-cols-4 gap-8">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-600 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl font-bold text-blue-500">1</span>
                        </div>
                        <h3 className="text-white font-medium mb-2">Choose Package</h3>
                        <p className="text-neutral-400 text-sm">Select the session type that fits your needs</p>
                    </div>
                
                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-600 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl font-bold text-blue-500">2</span>
                        </div>
                        <h3 className="text-white font-medium mb-2">Pick Date & Time</h3>
                        <p className="text-neutral-400 text-sm">View real-time availability and book instantly</p>
                    </div>
                
                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-600 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl font-bold text-blue-500">3</span>
                        </div>
                        <h3 className="text-white font-medium mb-2">Confirmation</h3>
                        <p className="text-neutral-400 text-sm">Receive booking details and preparation guide</p>
                    </div>
                
                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-600 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl font-bold text-blue-500">4</span>
                        </div>
                        <h3 className="text-white font-medium mb-2">Your Session</h3>
                        <p className="text-neutral-400 text-sm">Enjoy your photography experience!</p>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-neutral-800 rounded-2xl p-8">
                <h2 className="text-3xl font-light text-white mb-8 text-center">Frequently Asked Questions</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-white font-medium mb-2">How do I prepare for my session?</h3>
                        <p className="text-neutral-400 text-sm">
                            You'll receive a detailed preparation guide after booking, including wardrobe tips, 
                            location details, and a shot list questionnaire.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-white font-medium mb-2">When will I receive my photos?</h3>
                        <p className="text-neutral-400 text-sm">
                            Portrait and family sessions: 2 weeks. Events: 1 week. Weddings: 4-6 weeks. 
                            You'll receive a private online gallery with download access.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-white font-medium mb-2">What's your cancellation policy?</h3>
                        <p className="text-neutral-400 text-sm">
                            Free cancellation up to 48 hours before your session. Within 48 hours, 
                            the deposit is non-refundable but can be applied to a future booking.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-white font-medium mb-2">Do you offer prints?</h3>
                        <p className="text-neutral-400 text-sm">
                            Yes! After receiving your digital gallery, you can order professional 
                            prints, canvases, and albums directly through our print shop.
                        </p>
                    </div>
                </div>
            </div>

            {/* Contact CTA */}
            <div className="text-center mt-16">
                <p className="text-neutral-400 mb-4">
                    Have questions or need a custom package?
                </p>    
                <a href="#contact"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors">
                    Get in Touch
                </a>
            </div>
        </div>
    );
};
export default BookingSystem;