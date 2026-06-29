import { motion } from 'framer-motion';
import { Package, Truck, Globe, ArrowRight, Info, X, MapPin, BarChart3, Shield, Zap, Calendar, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';

export default function Landing() {
  const featuresRef = useRef<HTMLDivElement>(null);
  const [showLearnModal, setShowLearnModal] = useState(false);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const features = [
    { icon: MapPin, title: 'Real‑Time Tracking', desc: 'Follow every shipment with live GPS updates.' },
    { icon: BarChart3, title: 'Analytics & Insights', desc: 'Visualize performance and optimize routes.' },
    { icon: Shield, title: 'Enterprise Security', desc: 'Role‑based access and encrypted data.' },
    { icon: Zap, title: 'Lightning Fast', desc: 'Get updates in milliseconds, not minutes.' },
    { icon: Globe, title: 'Global Coverage', desc: 'Seamless tracking across borders.' },
    { icon: Calendar, title: 'Smart Scheduling', desc: 'Predictive ETA and automated dispatch.' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-secondary-50 dark:from-secondary-950 dark:to-secondary-900">
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-secondary-900 dark:text-white">
            <span className="bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
              Smart Logistics
            </span>
            <br />
            for Modern Business
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-secondary-600 dark:text-secondary-300">
            Real-time tracking, intelligent routing, and full visibility across your supply chain.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 sm:gap-4">
            <Link to="/login">
              <Button size="lg" className="group">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Button variant="secondary" size="lg" onClick={scrollToFeatures}>
              Learn More
            </Button>
            <Button variant="ghost" size="lg" onClick={() => setShowLearnModal(true)}>
              <Info className="mr-2 h-4 w-4" /> Quick Tour
            </Button>
          </div>
        </motion.div>

        <motion.div
          ref={featuresRef}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-20"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-secondary-900 dark:text-white mb-10">
            Why LogiTrack
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -6 }}
                className="rounded-2xl bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover dark:bg-secondary-800"
              >
                <item.icon className="h-10 w-10 text-primary-500" />
                <h3 className="mt-4 text-lg sm:text-xl font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm sm:text-base text-secondary-600 dark:text-secondary-300">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-2 text-sm text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
            <CheckCircle className="h-4 w-4" />
            Trusted by 500+ logistics companies worldwide
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showLearnModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowLearnModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-secondary-900 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold">About LogiTrack</h3>
                  <p className="text-sm text-secondary-500 mt-1">Next‑gen logistics platform</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowLearnModal(false)}
                  className="rounded-full p-1"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <div className="space-y-4 text-secondary-600 dark:text-secondary-300">
                <p>
                  <strong className="text-secondary-900 dark:text-white">LogiTrack</strong> brings
                  together cutting‑edge tracking, AI‑driven analytics, and seamless integrations to
                  give you complete control over your supply chain.
                </p>
                <ul className="space-y-2">
                  {[
                    '📦 Real‑time GPS tracking',
                    '📊 Predictive delivery ETAs',
                    '🔐 Enterprise‑grade security',
                    '🌍 Multi‑carrier support',
                    '📱 Mobile‑friendly dashboard',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 rounded-lg bg-primary-50 p-4 dark:bg-primary-900/20">
                  <p className="text-sm text-primary-700 dark:text-primary-300">
                    🚀 Ready to transform your logistics?<br />
                    <Link
                      to="/login"
                      className="font-semibold underline hover:no-underline"
                      onClick={() => setShowLearnModal(false)}
                    >
                      Get started today
                    </Link>
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
