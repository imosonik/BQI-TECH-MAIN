"use client"

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Shield, Lightbulb, Code, Users, Target, Award } from 'lucide-react'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { useRouter } from 'next/navigation'

const expertise = [
  { 
    icon: Code, 
    title: 'Software Development', 
    description: 'Custom solutions tailored to your needs, including web applications, mobile solutions, and enterprise systems. Our development process follows federal security standards and best practices.',
    features: [
      'Custom Application Development',
      'Legacy System Modernization',
      'Cloud-Native Solutions',
      'API Development & Integration'
    ]
  },
  { 
    icon: Lightbulb, 
    title: 'Configuration Services', 
    description: 'Expert configuration and customization of enterprise platforms and government systems. We optimize your technology infrastructure for maximum efficiency and performance.',
    features: [
      'Enterprise Platform Setup',
      'System Optimization',
      'Workflow Automation',
      'Performance Tuning'
    ]
  },
]

const leadership = [
 
  {
    title: "Our Community",
    description: "We actively participate in technology conferences and government innovation forums to stay at the forefront of public sector solutions.",
    image: "/community.jpg",
    link: "Join our Community"
  }
]

export default function AboutPage() {
  const breadcrumbItems = [
    { label: "About" }
  ]

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  }

  const router = useRouter()

  return (
    <motion.main 
      className="container mx-auto px-4 py-16 -mt-16"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.5 }}
    >
      <Breadcrumb items={breadcrumbItems} />

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative mb-16 py-24 overflow-hidden rounded-2xl"
      >
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/about-hero-bg.jpg"
            alt=""
            fill
            className="object-cover"
            priority
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#272055]/90 to-[#31CDFF]/80" />
        </div>

        {/* Animated Grid Pattern Overlay - similar to Hero component */}
        <motion.div
          className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-20"
          initial={{ backgroundPosition: "0% 0%" }}
          animate={{ backgroundPosition: "100% 100%" }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
        />

        {/* Content */}
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-white">
            About{" "}
            <span className="bg-gradient-to-r from-[#31CDFF] to-purple-600 text-transparent bg-clip-text">
              BQI Tech
            </span>
          </h1>
          <p className="text-xl text-gray-100 max-w-3xl mx-auto">
          BQI Tech is a leading software development and IT consulting firm specializing in custom technology solutions for government agencies and businesses. We combine cutting-edge innovation, security-first approaches, and enterprise-level expertise to help organizations streamline operations, modernize legacy systems, and enhance digital transformation.          </p>
        </div>
      </motion.section>

    

      {/* Our Mission Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold mb-6">Our Mission</h2>
        <p className="text-lg text-gray-700">
          We empower organizations with tailor-made technology solutions designed to improve efficiency, security, and scalability. Our mission is to bridge the gap between technology and government operations, ensuring that agencies can deliver better public services through digital innovation.
        </p>
      </section>

      {/* Expertise Section */}
      <motion.section className="mb-24">
        <h2 className="text-3xl font-semibold mb-8 text-center text-gray-800">Our Expertise</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {expertise.map((item, index) => (
            <motion.div
              key={item.title}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300
                         border border-gray-100 hover:border-[#31CDFF]/30"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="bg-gradient-to-br from-[#31CDFF]/10 to-blue-500/10 p-4 rounded-2xl mb-6">
                  <item.icon className="w-12 h-12 text-[#31CDFF] mb-4 mx-auto" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">{item.title}</h3>
                <p className="text-gray-600 mb-6">{item.description}</p>
                
                {/* Features List */}
                <div className="w-full space-y-3 mt-4">
                  {item.features.map((feature, i) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + (i * 0.1) }}
                      className="flex items-center gap-2 text-left"
                    >
                      <div className="h-2 w-2 rounded-full bg-[#31CDFF]" />
                      <span className="text-gray-700">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Leadership & Community Sections */}
      {leadership.map((section, index) => (
        <motion.section
          key={section.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 * index }}
          className="mb-24"
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className={`space-y-6 ${index % 2 === 0 ? 'md:order-1' : 'md:order-2'}`}>
              <h2 className="text-3xl font-bold text-gray-800">{section.title}</h2>
              <p className="text-lg text-gray-600">{section.description}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-teal-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-teal-600 transition-colors duration-300"
                onClick={() => router.push('https://www.linkedin.com/company/bqi-technologies')}
              >
                {section.link}
              </motion.button>
            </div>
            <div className={`relative h-[400px] ${index % 2 === 0 ? 'md:order-2' : 'md:order-1'}`}>
              <Image
                src={section.image}
                alt={section.title}
                fill
                className="object-cover rounded-lg shadow-xl"
              />
            </div>
          </div>
        </motion.section>
      ))}

    

      {/* Commitment Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="bg-gradient-to-r from-teal-500 to-blue-600 text-white py-16 px-4 rounded-lg"
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-4">Our Commitment</h2>
          <p className="text-lg mb-6">
            At BQI Tech, we are committed to delivering practical, secure, and sustainable solutions that empower government agencies to serve their communities better.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-teal-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300"
            onClick={() => router.push('/services')}
          >
            Learn More About Our Services
          </motion.button>
        </div>
      </motion.section>
    </motion.main>
  )
}
