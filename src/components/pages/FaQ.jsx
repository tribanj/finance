// import React from "react";

const FaQ = () => {
  const faqs = [
    {
      question: "What are the eligibility criteria for applying for a loan?",
      answer:
        "Eligibility criteria depend on the type of loan but typically include age, income, employment status, and credit score.",
    },
    {
      question: "How long does the loan approval process take?",
      answer:
        "The approval process can take anywhere from a few hours to a few days, depending on the loan type and documentation.",
    },
    {
      question: "What documents are required for a loan application?",
      answer:
        "Commonly required documents include identity proof, address proof, income proof, and bank statements.",
    },
    {
      question: "Can I apply for a loan online?",
      answer:
        "Yes, our online application process is simple and secure. You can apply from the comfort of your home.",
    },
    {
      question: "What is the minimum and maximum loan amount I can apply for?",
      answer:
        "The loan amount depends on the type of loan, credit score, and eligibility criteria.",
    },
    {
      question: "Do I need a guarantor for my loan application?",
      answer:
        "A guarantor may be required depending on the loan type and your credit history.",
    },
    {
      question: "What is the interest rate for loans?",
      answer:
        "Interest rates vary based on the loan type and applicant's creditworthiness.",
    },
    {
      question: "Are there any hidden charges in the loan application?",
      answer:
        "No, we maintain complete transparency in our charges. All fees and charges are communicated upfront.",
    },
    {
      question: "Can I prepay my loan?",
      answer:
        "Yes, you can prepay your loan. However, prepayment charges may apply depending on the loan terms.",
    },
    {
      question: "How is my loan repayment schedule determined?",
      answer:
        "The repayment schedule is based on the loan tenure and EMI plan chosen by you.",
    },
    {
      question: "What happens if I miss an EMI payment?",
      answer:
        "Missing an EMI payment can lead to penalties and may impact your credit score.",
    },
    {
      question: "Can I apply for a loan with a low credit score?",
      answer:
        "Yes, but the approval chances and interest rates may vary based on your credit score.",
    },
    {
      question: "How can I check my loan application status?",
      answer:
        "You can track your application status through our website or customer service helpline.",
    },
    {
      question: "What types of loans do you offer?",
      answer:
        "We offer personal loans, business loans, home loans, car loans, and more.",
    },
    {
      question: "Is there an age limit for applying for a loan?",
      answer:
        "Yes, the applicant must be at least 21 years old and not older than 65 at the time of loan maturity.",
    },
    {
      question: "Can I transfer my existing loan to your company?",
      answer:
        "Yes, we offer loan balance transfer facilities at competitive interest rates.",
    },
    {
      question: "What is the maximum tenure for loan repayment?",
      answer:
        "The maximum tenure depends on the loan type and can range from 12 months to 30 years.",
    },
    {
      question: "Do I need collateral for a personal loan?",
      answer:
        "No, personal loans are usually unsecured and do not require collateral.",
    },
    {
      question: "How can I contact customer support for loan queries?",
      answer:
        "You can reach our support team via phone, email, or visit our branch.",
    },
    {
      question: "What is the processing fee for a loan application?",
      answer:
        "The processing fee varies based on the loan amount and type. Please check our website for detailed information.",
    },
  ];

  return (
    <div className="min-h-screen p-6 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold text-center mb-6">
        Frequently Asked Questions
      </h1>
      <div className="max-w-4xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="p-4 border border-gray-700 rounded-lg">
            <h2 className="text-lg font-semibold text-cyan-400">
              {faq.question}
            </h2>
            <p className="text-gray-300 mt-2">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FaQ;
