"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Mail, Phone, MapPin, ChevronRight, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import Link from 'next/link';

// Define an interface for the form data
interface FormData {
  name: string
  role: string
  phone: string
  organization: string
  service: string
  email: string
  message: string
}

const services = [
  "Software Engineering Services",
  "Professional and Implementation Services",
  "Enterprise Platform Solutions",
  "Strategic IT Consulting",
  "DevOps and Cloud Engineering"
]

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function ContactUsPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    role: '',
    phone: '',
    organization: '',
    service: '',
    email: '',
    message: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear status when user starts typing
    if (submitStatus.type) {
      setSubmitStatus({ type: null, message: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitStatus({ type: null, message: '' });
    
    try {
      const BACKEND_URL = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'http://localhost:10000';
      const response = await fetch(`${BACKEND_URL}/api/contact/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send message');
      }

      setSubmitStatus({
        type: 'success',
        message: 'Thank you! Your message has been sent successfully. We\'ll get back to you soon.'
      });
      
      // Reset form
      setFormData({
        name: '',
        role: '',
        phone: '',
        organization: '',
        service: '',
        email: '',
        message: ''
      });
      
      // Redirect to confirmation page after a brief delay
      setTimeout(() => {
        window.location.href = '/contact-us/confirmation';
      }, 2000);
      
    } catch (error: any) {
      console.error('Error sending message:', error);
      setSubmitStatus({
        type: 'error',
        message: error.message || 'Failed to send message. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 pt-24 pb-12">
        <Breadcrumb items={[{ label: "Contact Us" }]} />
        
        {/* Hero Section */}
        <motion.div
          className="text-center mb-12"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ready to transform your organization with our expert IT consulting and software development services? 
            Let's discuss your project and explore how we can help you achieve your goals.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12 mt-12">
          {/* Contact Form */}
          <motion.div
            className="lg:col-span-3 bg-white rounded-3xl shadow-xl shadow-gray-100/50 overflow-hidden"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="p-8 bg-gradient-to-r from-teal-500 to-blue-500">
              <h2 className="text-2xl font-bold text-white mb-2">Send us a message</h2>
              <p className="text-teal-50">Fill out the form below and we'll get back to you shortly.</p>
            </div>
            
            <form className="p-8 space-y-6" onSubmit={handleSubmit}>
              {/* Status Message */}
              {submitStatus.type && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-xl flex items-center gap-3 ${
                    submitStatus.type === 'success'
                      ? 'bg-green-50 text-green-800 border border-green-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {submitStatus.type === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className="font-medium">{submitStatus.message}</span>
                </motion.div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                {['name', 'email'].map((field) => (
                  <div key={field} className="relative">
                    <input
                      type={field === 'email' ? 'email' : 'text'}
                      id={field}
                      name={field}
                      placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                      required
                      onChange={handleChange}
                      value={formData[field as keyof FormData]}
                    />
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {['organization', 'phone'].map((field) => (
                  <div key={field} className="relative">
                    <input
                      type={field === 'phone' ? 'tel' : 'text'}
                      id={field}
                      name={field}
                      placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                      required
                      onChange={handleChange}
                      value={formData[field as keyof FormData]}
                    />
                  </div>
                ))}
              </div>

              <div className="relative">
                <select
                  id="service"
                  name="service"
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 appearance-none"
                  required
                  onChange={handleChange}
                  value={formData.service}
                >
                  <option value="">Select Service Type</option>
                  {services.map((service) => (
                    <option key={service} value={service}>{service}</option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <textarea
                  id="message"
                  name="message"
                  placeholder="Your Message"
                  rows={4}
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                  required
                  onChange={handleChange}
                  value={formData.message}
                ></textarea>
              </div>

              <motion.button
                type="submit"
                className="w-full bg-gradient-to-r from-teal-500 to-blue-500 text-white px-8 py-4 rounded-xl font-medium inline-flex items-center justify-center space-x-2 shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: isLoading ? 1 : 1.01 }}
                whileTap={{ scale: isLoading ? 1 : 0.99 }}
                disabled={isLoading}
              >
                <span>{isLoading ? 'Sending...' : 'Send Message'}</span>
                <Send className="w-5 h-5" />
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            className="lg:col-span-2 space-y-8"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-100/50 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Connect With Us</h2>
              <div className="space-y-6">
                {[
                  {
                    icon: MapPin,
                    title: "Visit our office",
                    content: "The Piano, 8th Floor, Brookside Drive, Westlands, Nairobi, Kenya",
                  },
                  {
                    icon: Phone,
                    title: "Call us",
                    content: "+254 (0)11 229 5287",
                  },
                  {
                    icon: Mail,
                    title: "Email us",
                    content: "info@bqitech.com",
                    isLink: true,
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start p-4 hover:bg-gray-50 rounded-2xl transition-colors cursor-pointer group"
                    whileHover={{ x: 5 }}
                  >
                    <div className="bg-gradient-to-br from-teal-500 to-blue-500 p-3 rounded-xl text-white">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium text-gray-900">{item.title}</h3>
                      {item.isLink ? (
                        <a href={`mailto:${item.content}`} className="text-gray-600 hover:text-teal-500">
                          {item.content}
                        </a>
                      ) : (
                        <p className="text-gray-600">{item.content}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl shadow-gray-100/50 overflow-hidden">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8176744277105!2d36.80943661475403!3d-1.2635390990699898!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f17366e8d5d8f%3A0x1b3b7bd8d8a9d4a0!2sThe%20Piano%2C%20Brookside%20Dr%2C%20Nairobi!5e0!3m2!1sen!2ske"
                width="100%" 
                height="300" 
                style={{border:0}} 
                allowFullScreen={true} 
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
                title="BQI Tech Office Location - The Piano, Brookside Drive, Westlands, Nairobi"
              ></iframe>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}