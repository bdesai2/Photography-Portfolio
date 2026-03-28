import React, { useState } from 'react';
import { Mail, Instagram, Aperture, CheckCircle, XCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { trackContactFormSubmit, trackSocialClick } from './GoogleAnalytics';

// ─── EmailJS Configuration ───────────────────────────────────────────────────
// Credentials are loaded from environment variables (see .env)
const EMAILJS_SERVICE_ID  = process.env.REACT_APP_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY  = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;
// ─────────────────────────────────────────────────────────────────────────────


// ContactForm: Contact section with profile card and email form inputs
// Accepts onSubmit handler prop for backend integration (currently uses local alert demo)
const ContactForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '', email: '', message: '',
  });

   // Inline validation errors
  const [errors, setErrors] = useState({});

  // Submission state: 'idle' | 'loading' | 'success' | 'error'
  const [submitStatus, setSubmitStatus] = useState('idle');

  // ── Validation ──────────────────────────────────────────────────────────────
  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim())
      newErrors.name = 'Name is required.';
    else if (formData.name.trim().length < 2)
      newErrors.name = 'Name must be at least 2 characters.';

    if (!formData.email.trim())
      newErrors.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Please enter a valid email address.';

    if (!formData.message.trim())
      newErrors.message = 'Message is required.';
    else if (formData.message.trim().length < 10)
      newErrors.message = 'Message must be at least 10 characters.';

    return newErrors;
  };

  // Validate a single field on blur
  const handleBlur = (e) => {
    const { name } = e.target;
    const fieldErrors = validate();
    setErrors((prev) => ({
      ...prev,
      [name]: fieldErrors[name] || null,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value, }));
    // Clear error for this field on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Run full validation first
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitStatus('loading');

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name:    formData.name,
          from_email:   formData.email,
          message:      formData.message,
          to_name:      'Bhargav',
        },
        EMAILJS_PUBLIC_KEY
      );

      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setErrors({});

      if (onSubmit) onSubmit(formData);

      // Reset back to idle after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000);
      trackContactFormSubmit();
    } catch (err) {
      console.error('EmailJS error:', err);
      setSubmitStatus('error');
      // Reset back to idle after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }
  };

  //Field helper: border color based on error/valid state
  const fieldClass = (name) => {
    const base = 'w-full px-4 py-3 bg-neutral-900 text-white border rounded-lg focus:outline-none transition-colors';
    if (errors[name]) return `${base} border-red-500 focus:border-red-500`;
    if (formData[name] && !errors[name]) return `${base} border-green-500 focus:border-green-500`;
    return `${base} border-neutral-700 focus:border-blue-500`;
  };

  return (
    <section className="py-20 px-4 md:px-8 bg-neutral-800">
      <div className="max-w-4xl mx-auto" id="contact-me">
        <h2 className="text-4xl font-light text-white mb-16 text-center tracking-wide">Get In Touch</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Profile Card */}
          <div className="flex flex-col justify-center">
            <div className="bg-neutral-900 rounded-lg p-8 shadow-lg">
              <div className="w-32 h-32 rounded-full mx-auto mb-6 overflow-hidden border-4 border-neutral-700">
                <img src="https://res.cloudinary.com/du9uhtjxi/image/upload/v1771136308/D6bDLGVZT0aJHPvqzNgRfg_c8kcec.jpg" alt="Bhargav Desai" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-2xl font-light text-white text-center mb-2">Bhargav Desai</h3>
              <p className="text-neutral-400 text-center mb-6">Professional Photographer & Visual Storyteller</p>
              <p className="text-neutral-400 text-center text-sm mb-8 leading-relaxed">
                Capturing moments that tell stories. Specializing in portrait, landscape, events, and wildlife photography.
              </p>
              <div className="flex justify-center gap-6">
                <a href="mailto:bdesai2@gmail.com" className="text-neutral-400 hover:text-white transition-colors">
                  <Mail size={24} />
                </a>
                <a href="https://www.instagram.com/bdesai2" onClick={() => trackSocialClick('Instagram')} className="text-neutral-400 hover:text-white transition-colors">
                  <Instagram size={24} />
                </a>
                <a href="https://gurushots.com/bdesai2/" onClick={() => trackSocialClick('GuruShots')} className="text-neutral-400 hover:text-white transition-colors">
                  <Aperture size={24} />
                </a>
              </div>
              <div className="mt-6 flex justify-center">
                <a href="/book" className="action-btn action-btn--primary inline-flex items-center gap-2 px-5 py-3 rounded-lg">
                  Book Session
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            {/* Success Banner */}
            {submitStatus === 'success' && (
              <div className="flex items-center gap-3 bg-green-900 border border-green-600 text-green-300 px-4 py-3 rounded-lg mb-6 animate-fadeIn">
                <CheckCircle size={20} className="shrink-0" />
                <p className="text-sm">Message sent! Thank you, I'll get back to you soon.</p>
              </div>
            )}
            {/* Error Banner */}
            {submitStatus === 'error' && (
              <div className="flex items-center gap-3 bg-red-900 border border-red-600 text-red-300 px-4 py-3 rounded-lg mb-6 animate-fadeIn">
                <XCircle size={20} className="shrink-0" />
                <p className="text-sm">Something went wrong. Please try again or email me directly.</p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2">Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} onBlur={handleBlur}
                  className={fieldClass('name')} placeholder="Your name" />
                {errors.name && (
                  <p className="mt-1 text-red-400 text-xs flex items-center gap-1">
                    <XCircle size={12} /> {errors.name}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-white text-sm font-medium mb-2">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} onBlur={handleBlur}
                  className={fieldClass('email')} placeholder="your@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-red-400 text-xs flex items-center gap-1">
                    <XCircle size={12} /> {errors.email}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-white text-sm font-medium mb-2">Message</label>
                <textarea name="message" value={formData.message} onChange={handleChange} rows="5"
                  className={`${fieldClass('message')} resize-none`} onBlur={handleBlur}
                  placeholder="Your message..."
                ></textarea>
                {/* Character count */}
                <p className="mt-1 text-neutral-500 text-xs text-right">
                  {formData.message.length} characters
                  {formData.message.length < 10 && formData.message.length > 0 &&
                    <span className="text-red-400"> (min 10)</span>
                  }
                </p>
                {errors.message && (
                  <p className="mt-1 text-red-400 text-xs flex items-center gap-1">
                    <XCircle size={12} /> {errors.message}
                  </p>
                )}
              </div>
              <button
                type="submit" disabled={submitStatus === 'loading'}
                className="w-full action-btn action-btn--primary disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >{submitStatus === 'loading' ? (
                  <>
                    {/* Spinner */}
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
export default ContactForm;