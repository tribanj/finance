import { FaBalanceScale, FaShieldAlt, FaUserLock } from "react-icons/fa";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Terms & Conditions
          </h1>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Please read these terms carefully before using our services. By
            accessing or using our platform, you agree to be bound by these
            terms.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Section 1 */}
          <div className="bg-gray-800 p-8 rounded-xl border border-gray-700/50 hover:border-cyan-400/30 transition-all">
            <div className="text-cyan-400 text-4xl mb-4">
              <FaBalanceScale />
            </div>
            <h2 className="text-2xl font-semibold mb-4">Legal Framework</h2>
            <ul className="space-y-4 text-gray-300">
              <li>• Governing law and jurisdiction</li>
              <li>• Dispute resolution process</li>
              <li>• Limitation of liability</li>
              <li>• Intellectual property rights</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="bg-gray-800 p-8 rounded-xl border border-gray-700/50 hover:border-cyan-400/30 transition-all">
            <div className="text-cyan-400 text-4xl mb-4">
              <FaShieldAlt />
            </div>
            <h2 className="text-2xl font-semibold mb-4">
              User Responsibilities
            </h2>
            <ul className="space-y-4 text-gray-300">
              <li>• Account security requirements</li>
              <li>• Prohibited activities</li>
              <li>• Content submission guidelines</li>
              <li>• Payment obligations</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="bg-gray-800 p-8 rounded-xl border border-gray-700/50 hover:border-cyan-400/30 transition-all">
            <div className="text-cyan-400 text-4xl mb-4">
              <FaUserLock />
            </div>
            <h2 className="text-2xl font-semibold mb-4">Privacy & Data</h2>
            <ul className="space-y-4 text-gray-300">
              <li>• Data collection practices</li>
              <li>• Cookie policy</li>
              <li>• Third-party sharing</li>
              <li>• Data retention policy</li>
            </ul>
          </div>
        </div>

        {/* Detailed Terms */}
        <div className="mt-16 space-y-8 max-w-4xl mx-auto">
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold text-cyan-400">
              1. Introduction
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Welcome to Life Comrade MicroFinserv. These terms govern your use
              of our services. By accessing our platform, you agree to these
              terms.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-semibold text-cyan-400">
              2. Account Management
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Users must maintain accurate account information and are
              responsible for all activities under their account. Immediate
              reporting of unauthorized access is required.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-semibold text-cyan-400">
              3. Service Usage
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Our services are provided "as-is" without warranties. We reserve
              the right to modify or discontinue services at any time.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-semibold text-cyan-400">
              4. Amendments
            </h2>
            <p className="text-gray-300 leading-relaxed">
              We may update these terms periodically. Continued use after
              changes constitutes acceptance of the new terms.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <p className="text-gray-400 mb-4">
            Need further clarification? Contact our support team
          </p>
          <button className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
