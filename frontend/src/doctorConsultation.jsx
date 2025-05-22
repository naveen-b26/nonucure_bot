import { motion } from 'framer-motion';
import doctorImage from './pics/doctor.png';

const DoctorConsultation = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-white shadow-xl rounded-2xl overflow-hidden mb-8 mt-12 max-w-7xl mx-auto hover:shadow-2xl transition-shadow duration-300"
  >
    <div className="flex flex-col lg:flex-row items-stretch">
      {/* Left side - Doctor Image */}
      <div className="w-full lg:w-1/2 relative bg-gradient-to-br from-[#f8f9ff] to-[#f1f4ff] p-6 lg:p-12">
        <motion.div 
          className="relative rounded-2xl overflow-hidden shadow-lg"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <img
            src={doctorImage}
            alt="Medical consultation"
            className="w-full h-full object-cover rounded-2xl"
          />
          <div className="absolute bottom-4 right-4">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="bg-green-500 rounded-full p-2 shadow-lg"
            >
              <div className="w-3 h-3 bg-white rounded-full" />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Right side - Content */}
      <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center bg-gradient-to-br from-white to-gray-50">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="space-y-4">
            <motion.span 
              className="text-orange-600 text-sm font-semibold tracking-wider uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Expert Consultation
            </motion.span>
            <h2 className="text-3xl font-bold text-gray-900 leading-tight">
              Want Expert Medical Advice?
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Connect with our certified dermatologists for a personalized consultation about your hair concerns.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: "🎯", text: 'Professional medical assessment', description: 'Get a thorough evaluation of your condition' },
              { icon: "📋", text: 'Personalized treatment plans', description: 'Customized solutions for your specific needs' },
              { icon: "🔄", text: 'Follow-up consultations', description: 'Regular check-ins to track your progress' }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <span className="text-2xl">{benefit.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">{benefit.text}</h3>
                  <p className="text-gray-500 text-sm">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="pt-4"
          >
            <a
              href="https://nonucare.com/pages/consult-a-doctor"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <button className="group bg-orange-400 w-full sm:w-auto px-8 py-4 rounded-xl text-white font-medium hover:bg-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2">
                <span>Book Consultation Now</span>
                <motion.span
                  className="inline-block"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  →
                </motion.span>
              </button>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  </motion.div>
);

export default DoctorConsultation;