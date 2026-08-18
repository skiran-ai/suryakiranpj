import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Mail, MapPin, Sparkles, Loader2 } from 'lucide-react';
import { apiClient } from '../services/apiClient';
import SocialLinks from './SocialLinks';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState({
    submitting: false,
    success: false,
    error: null,
    message: null
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      setStatus({ submitting: false, success: false, error: 'Please fill in all required fields (Name, Email, Message).', message: null });
      return;
    }

    setStatus({ submitting: true, success: false, error: null, message: null });

    const res = await apiClient.submitContact(formData);

    if (res.success) {
      setStatus({
        submitting: false,
        success: true,
        error: null,
        message: res.message || "Thank you! Your message has been sent successfully."
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } else {
      setStatus({
        submitting: false,
        success: false,
        error: res.message || 'Failed to submit contact message. Please try again.',
        message: null
      });
    }
  };

  return (
    <section id="contact" className="section-padding position-relative">
      <div className="container">
        {/* Section Heading */}
        <div className="text-center mb-5">
          <div className="badge-brand mb-2">
            <Sparkles size={16} />
            <span>Get In Touch</span>
          </div>
          <h2 className="display-5 section-title">
            Let's Build Something <span className="text-gradient">Together</span>
          </h2>
          <p className="section-subtitle">
            Have a project opportunity, career inquiry, or full-stack software project? Send Suryakiran a direct message below.
          </p>
        </div>

        <div className="row gy-4 align-items-stretch">
          {/* Contact Details Left Column */}
          <div className="col-lg-5">
            <div className="glass-card p-4 p-md-5 h-100 d-flex flex-column justify-content-between">
              <div>
                <h3 className="h4 text-primary fw-bold mb-3">Direct Contact Channels</h3>
                <p className="text-secondary mb-4">
                  Feel free to reach out via email, inspect code repositories on GitHub, or connect on LinkedIn and Instagram.
                </p>

                <div className="glass-panel p-3 mb-3 d-flex align-items-center gap-3">
                  <div
                    className="rounded-circle p-3 d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ background: 'var(--gradient-glow)', color: 'var(--accent-cyan)' }}
                  >
                    <Mail size={24} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <span className="small text-muted d-block font-code">EMAIL ADDRESS</span>
                    <a
                      href="mailto:suryakiranpjineesh@gmail.com"
                      className="text-primary fw-semibold text-decoration-none contact-email-link"
                    >
                      suryakiranpjineesh@gmail.com
                    </a>
                  </div>
                </div>

                {/* Location Box */}
                <div className="glass-panel p-3 mb-4 d-flex align-items-center gap-3">
                  <div
                    className="rounded-circle p-3 d-flex align-items-center justify-content-center"
                    style={{ background: 'var(--gradient-glow)', color: 'var(--accent-purple)' }}
                  >
                    <MapPin size={24} />
                  </div>
                  <div>
                    <span className="small text-muted d-block font-code">LOCATION</span>
                    <span className="text-primary fw-semibold">Kerala, India</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="h6 text-primary fw-bold mb-3 font-code">Connect & Follow:</h4>
                <SocialLinks iconSize={20} />
              </div>
            </div>
          </div>

          {/* Contact Form Right Column */}
          <div className="col-lg-7">
            <div className="glass-card p-4 p-md-5">
              {status.success && (
                <div className="alert alert-success d-flex align-items-center gap-2 mb-4 font-code" role="alert">
                  <CheckCircle2 size={20} />
                  <div>{status.message}</div>
                </div>
              )}

              {status.error && (
                <div className="alert alert-danger d-flex align-items-center gap-2 mb-4 font-code" role="alert">
                  <AlertCircle size={20} />
                  <div>{status.error}</div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row gy-3">
                  <div className="col-md-6">
                    <label htmlFor="name" className="form-label text-secondary small fw-semibold font-code">
                      Your Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Alex Smith"
                      className="form-control glass-panel text-primary border-0 p-3"
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="email" className="form-label text-secondary small fw-semibold font-code">
                      Your Email <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. alex@example.com"
                      className="form-control glass-panel text-primary border-0 p-3"
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label htmlFor="subject" className="form-label text-secondary small fw-semibold font-code">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="e.g. Full Stack Project Inquiry"
                      className="form-control glass-panel text-primary border-0 p-3"
                    />
                  </div>

                  <div className="col-12">
                    <label htmlFor="message" className="form-label text-secondary small fw-semibold font-code">
                      Message <span className="text-danger">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Write your message details here..."
                      className="form-control glass-panel text-primary border-0 p-3"
                      required
                    ></textarea>
                  </div>

                  <div className="col-12 pt-2">
                    <button
                      type="submit"
                      disabled={status.submitting}
                      className="btn btn-brand w-100 py-3 justify-content-center font-code"
                    >
                      {status.submitting ? (
                        <>
                          <Loader2 size={18} className="animate-spin me-2" />
                          <span>Sending... (may take up to 30s on first send)</span>
                        </>
                      ) : (
                        <>
                          <Send size={18} className="me-2" />
                          <span>Send Message</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
