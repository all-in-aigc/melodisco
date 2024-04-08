import "../style.css";

import Markdown from "../../[locale]/(default)/_components/markdown";
import { MdOutlineHome } from "react-icons/md";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Privacy Policy",
    alternates: {
      canonical: `${process.env.NEXTAUTH_URL}/privacy-policy`,
    },
  };
}

export default function () {
  const content = `# Melodisco Privacy Policy

Effective Date: April 8, 2024

At Melodisco, we are committed to protecting the privacy and security of our users. This Privacy Policy describes the types of information we may collect from you or that you may provide when you use our service and our practices for collecting, using, maintaining, protecting, and disclosing that information.

## Information We Collect

### Information You Provide to Us

- **Account Information:** If you create an account, we may collect your name, email address, and password.
- **Interaction Infomation:** We collect the information you actively provide to us includes data you input during interactions, such as filling out forms on our website, communicating with us via contact forms, emails, social media interactions, surveys, or any other method where you actively send information to us.

### Information We Collect Automatically

- **Usage Details:** When you access and use our Service, we automatically collect details of your access to and use of our Service, including traffic data, location data, logs, and other communication data and the resources that you access and use on or through our Service.
- **Device Information:** We collect information about your device, including IP address, operating system, browser type, and device identifiers.

### Cookies and Tracking Technologies

- We use cookies and similar tracking technologies to track activity on our Service and hold certain information.

### Payment Information

- **Payment and Billing Information:** If you purchase a subscription or service from us, we may collect payment and billing information. This includes your credit card number, billing address, and other information necessary for processing payments. We use secure payment processing services to handle transactions and do not store your credit card information on our servers.

## Information We Do Not Collect

- **Sensitive Personal Information:** We do not collect sensitive personal information such as Social Security numbers, genetic data, health information, or religious beliefs.

## How We Use Your Information

We use the information we collect about you or that you provide to us, including any personal information:

- To provide you with our Service and its contents, and any other information, products or services that you request from us.
- To fulfill the purposes for which you provided the information or that were described when it was collected, or any other purpose for which you provide it.
- To give you notices about your account and subscription, including expiration and renewal notices.
- To carry out our obligations and enforce our rights arising from any contracts entered into between you and us, including for billing and collection.
- To notify you about changes to our Service or any products or services we offer or provide through it.
- To improve our Service, products, and services, and to develop new ones.
- To measure or understand the effectiveness of the advertising we serve to you and others, and to deliver relevant advertising to you.
- For any other purpose with your consent.

## Data Security

We implement measures designed to protect your personal information from accidental loss and from unauthorized access, use, alteration, and disclosure. However, the transmission of information via the internet is not completely secure, and we cannot guarantee the security of your personal information transmitted to our Service.

## Changes to Our Privacy Policy

We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.

## Contact Information

To ask questions or comment about this Privacy Policy and our privacy practices, contact us at: [support@thinkany.ai](mailto:support@thinkany.ai). 
`;
  return (
    <div>
      <a className="text-base-content cursor-pointer" href="/">
        <MdOutlineHome className="text-2xl mx-8 my-8" />
        {/* <img className="w-10 h-10 mx-4 my-4" src="/logo.png" /> */}
      </a>
      <div className="max-w-3xl mx-auto leading-loose pt-4 pb-8 px-8">
        <Markdown content={content} />
      </div>
    </div>
  );
}
