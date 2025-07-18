'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Mail, ArrowLeft, Home } from 'lucide-react'
import Link from 'next/link'
import { Breadcrumb } from '@/components/ui/breadcrumb'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const successVariants = {
  initial: { scale: 0, rotate: -180 },
  animate: { 
    scale: 1, 
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
      delay: 0.3
    }
  }
}

export default function ConfirmationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 pt-24 pb-12">
        <Breadcrumb items={[
          { label: "Contact Us", href: "/contact-us" },
          { label: "Confirmation" }
        ]} />
        
        <motion.div
          className="max-w-2xl mx-auto"
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-100/50 p-8 md:p-12 text-center">
            {/* Success Icon */}
            <motion.div
              className="flex justify-center mb-8"
              variants={successVariants}
              initial="initial"
              animate="animate"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
            </motion.div>

            {/* Success Message */}
            <motion.div
              variants={fadeInUp}
              transition={{ delay: 0.6 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Thank You!
              </h1>
              
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Your message has been sent successfully. Our team will review your inquiry and get back to you within 24-48 hours during business days.
              </p>
            </motion.div>

            {/* What Happens Next */}
            <motion.div
              className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8"
              variants={fadeInUp}
              transition={{ delay: 0.8 }}
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <Mail className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-800">What happens next?</h3>
              </div>
              <ul className="text-left space-y-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  You'll receive a confirmation email shortly
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Our team will review your inquiry
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  We'll contact you within 24-48 hours
                </li>
              </ul>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={fadeInUp}
              transition={{ delay: 1.0 }}
            >
              <Link href="/">
                <motion.button
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/40 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Home className="w-5 h-5" />
                  Back to Home
                </motion.button>
              </Link>
              
              <Link href="/contact-us">
                <motion.button
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-teal-500 hover:text-teal-600 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ArrowLeft className="w-5 h-5" />
                  Send Another Message
                </motion.button>
              </Link>
            </motion.div>

            {/* Additional Info */}
            <motion.div
              className="mt-8 pt-6 border-t border-gray-100"
              variants={fadeInUp}
              transition={{ delay: 1.2 }}
            >
              <p className="text-sm text-gray-500">
                For urgent matters, feel free to call us at{' '}
                <a href="tel:+254112295287" className="text-teal-600 hover:text-teal-700 font-medium">
                  +254 (0)11 229 5287
                </a>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
