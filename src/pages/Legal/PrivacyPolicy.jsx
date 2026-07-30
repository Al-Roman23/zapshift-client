// Privacy Policy Page
import { Shield, Lock, Eye, Database } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="bg-base-100 min-h-screen py-12 px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Shield className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-base-content mb-4">Privacy Policy</h1>
          <p className="text-lg text-base-content/70">
            Current as of {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </p>
        </div>

        <div className="space-y-12">
          {/* Section 1 */}
          <section className="bg-base-200 rounded-2xl p-8 border border-base-300">
            <h2 className="text-2xl font-bold text-base-content mb-4 flex items-center gap-3">
              <Eye className="w-6 h-6 text-primary" /> 1. Information We Collect
            </h2>
            <div className="space-y-4 text-base-content/80 leading-relaxed">
              <p>
                We collect information you provide directly to us when you create an account, request a delivery, or communicate with us. This includes:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Name, email address, and phone number!</li>
                <li>Delivery and pickup addresses!</li>
                <li>Payment information (processed securely by Stripe)!</li>
                <li>Parcel details and photographs!</li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section className="bg-base-200 rounded-2xl p-8 border border-base-300">
            <h2 className="text-2xl font-bold text-base-content mb-4 flex items-center gap-3">
              <Database className="w-6 h-6 text-secondary" /> 2. How We Use Your Information
            </h2>
            <div className="space-y-4 text-base-content/80 leading-relaxed">
              <p>
                We use the information we collect to provide, maintain, and improve our services, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Process and deliver your parcels efficiently!</li>
                <li>Process payments and send receipts!</li>
                <li>Send you technical notices, updates, and support messages!</li>
                <li>Detect and prevent fraud and abuse!</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-base-200 rounded-2xl p-8 border border-base-300">
            <h2 className="text-2xl font-bold text-base-content mb-4 flex items-center gap-3">
              <Lock className="w-6 h-6 text-success" /> 3. Data Security
            </h2>
            <div className="space-y-4 text-base-content/80 leading-relaxed">
              <p>
                We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.
              </p>
              <p>
                Your payment data is never stored on our servers. It is handled directly by Stripe's secure infrastructure.
              </p>
            </div>
          </section>

          {/* Contact Section */}
          <div className="text-center p-8 bg-primary/10 rounded-2xl border border-primary/20">
            <h3 className="text-xl font-bold text-base-content mb-2">Have Questions?</h3>
            <p className="text-base-content/70 mb-4">
              If you have any questions about this Privacy Policy, please contact us.
            </p>
            <a href="mailto:privacy@zapshift.com" className="btn btn-primary">
              Contact Privacy Team
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
