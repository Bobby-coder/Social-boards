'use client';
import FaqQuestion from "@/app/components/FaqQuestion";
import {useWideHeader} from "@/app/hooks/AppContext";

export default function HelpPage() {
  const email = 'support@feedbackboards.com';
  useWideHeader();
  return (
    <div className="mt-16">
      <h1 className="text-center text-4xl mb-6">Help Center</h1>
      <p className="text-center mb-8">
        Check our faq or drop us an email: {email}
      </p>
      <FaqQuestion question="Can I cancel my subscription anytime?">
        Yes, you can downgrade in your account page.
      </FaqQuestion>
      <FaqQuestion question="Can I use the free version forever?">
        Yes
      </FaqQuestion>
      <FaqQuestion question="How can i contact support?">
        Send us an email: {email}
      </FaqQuestion>
    </div>
  );
}