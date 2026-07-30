// Terms of Service Page
import { FileText, CheckCircle, AlertTriangle, Scale } from "lucide-react";

const TermsOfService = () => {
  return (
    <div className="bg-base-100 min-h-screen py-12 px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <FileText className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-base-content mb-4">Terms of Service</h1>
          <p className="text-lg text-base-content/70">
            Last updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </p>
        </div>

        <div className="space-y-12">
          {/* Section 1 */}
          <section className="bg-base-200 rounded-2xl p-8 border border-base-300">
            <h2 className="text-2xl font-bold text-base-content mb-4 flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-primary" /> 1. Acceptance of Terms
            </h2>
            <div className="space-y-4 text-base-content/80 leading-relaxed">
              <p>
                By accessing or using ZaP ShifT's website and services, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="bg-base-200 rounded-2xl p-8 border border-base-300">
            <h2 className="text-2xl font-bold text-base-content mb-4 flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-warning" /> 2. Prohibited Items
            </h2>
            <div className="space-y-4 text-base-content/80 leading-relaxed">
              <p>
                You agree not to send any of the following items through our service:
              </p>
              <ul className="list-disc pl-6 space-y-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                <li>Illegal substances or drugs!</li>
                <li>Weapons or explosives!</li>
                <li>Live animals!</li>
                <li>Stolen goods!</li>
                <li>Hazardous materials!</li>
                <li>Currency or precious metals!</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-base-200 rounded-2xl p-8 border border-base-300">
            <h2 className="text-2xl font-bold text-base-content mb-4 flex items-center gap-3">
              <Scale className="w-6 h-6 text-info" /> 3. Liability Limitation
            </h2>
            <div className="space-y-4 text-base-content/80 leading-relaxed">
              <p>
                ZaP ShifT is not liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of our service.
              </p>
              <p>
                Our maximum liability for any parcel is limited to the declared value or ৳5,000, whichever is lower, unless extra insurance was purchased.
              </p>
            </div>
          </section>

          {/* Contact Section */}
          <div className="text-center p-8 bg-base-200 rounded-2xl border border-base-300">
            <h3 className="text-xl font-bold text-base-content mb-2">Questions regarding Terms?</h3>
            <p className="text-base-content/70 mb-4">
              Our legal team is available to clarify any points.
            </p>
            <a href="mailto:legal@zapshift.com" className="btn btn-outline">
              Contact Legal Team
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
