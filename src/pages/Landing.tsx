import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Truck, Globe, Shield, Clock, Users, BarChart } from 'lucide-react';
import Button from '../components/ui/Button';

export default function Landing() {
  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-secondary-50 dark:from-secondary-950 dark:to-secondary-900">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-secondary-900 dark:text-white">
            Smart Logistics
            <span className="block text-primary-600 dark:text-primary-400">for Modern Business</span>
          </h1>
          <p className="mt-4 text-lg md:text-xl text-secondary-600 dark:text-secondary-300 max-w-2xl mx-auto">
            Real-time tracking, intelligent routing, and full visibility across your supply chain.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button variant="secondary" size="lg" className="w-full sm:w-auto" onClick={scrollToFeatures}>
              Learn More
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 dark:text-white">
            Why Choose LogiTrack?
          </h2>
          <p className="mt-2 text-secondary-600 dark:text-secondary-300">
            Everything you need to manage your logistics efficiently
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * (index + 1) }}
              className="bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-secondary-100 dark:border-secondary-700"
            >
              <div className="h-12 w-12 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">{feature.title}</h3>
              <p className="mt-2 text-secondary-600 dark:text-secondary-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-primary-600 dark:bg-primary-700 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Ready to transform your logistics?
          </h2>
          <p className="mt-2 text-primary-100">
            Join thousands of businesses already using LogiTrack.
          </p>
          <Link to="/register">
            <Button variant="secondary" size="lg" className="mt-6 bg-white text-primary-600 hover:bg-primary-50">
              Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

const features = [
  {
    icon: MapPin,
    title: 'Track & Trace',
    description: 'Real-time visibility of every shipment with live GPS tracking and status updates.'
  },
  {
    icon: Truck,
    title: 'Fleet Management',
    description: 'Optimize routes, monitor driver performance, and reduce delivery times.'
  },
  {
    icon: Globe,
    title: 'Global Coverage',
    description: 'Seamless logistics across borders with multi-carrier integration.'
  },
  {
    icon: Shield,
    title: 'Secure & Reliable',
    description: 'Enterprise-grade security with role-based access and audit trails.'
  },
  {
    icon: Clock,
    title: 'Real-time Updates',
    description: 'Instant notifications and live tracking for every shipment.'
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Assign roles, manage agents, and collaborate across your organization.'
  }
];
