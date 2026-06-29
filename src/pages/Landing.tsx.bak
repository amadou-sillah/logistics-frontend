import { motion } from 'framer-motion';
import { Package, Truck, Globe, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-secondary-50 dark:from-secondary-950 dark:to-secondary-900">
      <div className="container mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-5xl font-extrabold tracking-tight text-secondary-900 dark:text-white sm:text-6xl md:text-7xl">
            <span className="bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
              Smart Logistics
            </span>
            <br />
            for Modern Business
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-secondary-600 dark:text-secondary-300">
            Real-time tracking, intelligent routing, and full visibility across your supply chain.
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            <Link to="/login">
              <Button size="lg" className="group">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Button variant="secondary" size="lg">
              Learn More
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {[
            { icon: Package, title: 'Track & Trace', desc: 'Real‑time visibility of every shipment.' },
            { icon: Truck, title: 'Fleet Management', desc: 'Optimize routes and driver performance.' },
            { icon: Globe, title: 'Global Coverage', desc: 'Seamless logistics across borders.' },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -8 }}
              className="rounded-2xl bg-white p-8 shadow-card transition-shadow hover:shadow-card-hover dark:bg-secondary-800"
            >
              <item.icon className="h-10 w-10 text-primary-500" />
              <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>
              <p className="mt-2 text-secondary-600 dark:text-secondary-300">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
