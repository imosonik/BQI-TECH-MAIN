"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
}

// Add floating shapes component
function FloatingShapes() {
  return (
    <>
      {/* Enhanced animated shapes with more vibrant colors */}
      <motion.div
        className="absolute -left-32 -top-32 w-96 h-96 bg-gradient-to-br from-[#31CDFF]/30 via-purple-500/25 to-blue-500/30 rounded-full blur-3xl"
        animate={{
          rotate: [0, 90, 0],
          scale: [1, 1.2, 1],
          x: [0, 20, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="absolute right-0 bottom-0 w-80 h-80 bg-gradient-to-bl from-blue-600/30 via-[#31CDFF]/25 to-purple-500/30 rounded-full blur-3xl"
        animate={{
          rotate: [0, -90, 0],
          scale: [1, 1.3, 1],
          x: [0, -30, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-500/20 rounded-full"
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight 
            }}
            animate={{
              y: [null, -20, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Enhanced geometric pattern */}
      <div className="absolute inset-0  opacity-[0.07]" />
      
      {/* Improved glass effect */}
      <div className="absolute inset-0 backdrop-blur-sm bg-gradient-to-br from-white/40 via-transparent to-white/40" />
    </>
  );
}

export default function CallToAction() {
  // Remove the 3D morph transition variants
  // const ctaMorphVariants = {
  //   hidden: { 
  //     opacity: 0,
  //     rotateX: 15, 
  //     rotateY: -4,
  //     rotateZ: 1,
  //     scale: 0.9,
  //     transformPerspective: 1800,
  //     z: -200,
  //     filter: "blur(10px)"
  //   },
  //   visible: { 
  //     opacity: 1,
  //     rotateX: 0, 
  //     rotateY: 0,
  //     rotateZ: 0,
  //     scale: 1,
  //     transformPerspective: 1800,
  //     z: 0,
  //     filter: "blur(0px)",
  //     transition: { 
  //       type: "spring", 
  //       stiffness: 35, 
  //       damping: 15,
  //       mass: 1.4,
  //       duration: 1.3
  //     } 
  //   }
  // };

  return (
    <motion.section 
      className="relative py-32 overflow-hidden bg-gradient-to-b from-gray-50 via-white to-gray-50/80"
      // Remove the morph variants
      // variants={ctaMorphVariants}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.25 }}
    >
      {/* <FloatingShapes /> */}

      <div className="container relative mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* First Card */}
          <motion.div
            className="rounded-3xl bg-gradient-to-br from-[#0A1128] to-[#1B3C73] 
                       p-8 md:p-12 space-y-6 border border-white/10 
                       shadow-2xl shadow-blue-900/30 
                       hover:scale-[1.02] transition-transform duration-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 bg-white/10 rounded-full py-2 px-4 w-fit">
              <Sparkles className="w-5 h-5 text-[#31CDFF]" />
              <span className="bg-gradient-to-r from-[#31CDFF] to-blue-400 text-transparent bg-clip-text 
                             font-semibold uppercase tracking-wider text-sm">
                Trusted by Government Agencies
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              Across the United States, Kenya and Beyond
            </h2>

            <p className="text-gray-300 text-lg leading-relaxed">
              We understand the complex needs of government digital transformation. Our experience working with both local and national agencies gives us the edge to deliver technology that works in real world public sector environments.
            </p>
          </motion.div>

          {/* Second Card */}
          <motion.div
            className="rounded-3xl bg-gradient-to-br from-[#0A1128] to-[#1B3C73] 
                       p-8 md:p-12 space-y-6 border border-white/10 
                       shadow-2xl shadow-blue-900/30 
                       hover:scale-[1.02] transition-transform duration-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3 bg-white/10 rounded-full py-2 px-4 w-fit">
              <Sparkles className="w-5 h-5 text-[#31CDFF]" />
              <span className="bg-gradient-to-r from-[#31CDFF] to-blue-400 text-transparent bg-clip-text 
                             font-semibold uppercase tracking-wider text-sm">
                Get Started with BQI Tech
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              Ready to Transform Your Agency
            </h2>

            <p className="text-gray-300 text-lg leading-relaxed">
              Ready to take your agency to the next level? Talk to our team today about building secure, scalable, and tailored digital solutions for your department.
            </p>

            <div className="pt-4">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full 
                           bg-[#31CDFF] text-white font-semibold text-lg 
                           hover:bg-blue-500 transition-colors duration-300 
                           group"
              >
                Explore Our Services
                <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Add noise texture */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
    </motion.section>
  );
}
// Add these styles to your global CSS
const globalStyles = `
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
    100% { transform: translateY(0px); }
  }

  .bg-radial-gradient {
    background: radial-gradient(circle at center, var(--tw-gradient-from) 0%, var(--tw-gradient-via) 50%, var(--tw-gradient-to) 100%);
  }
`;
