import founderImg from "../../../assets/about foundder.jpeg";

const About = () => {
  return (
    <div className="min-h-screen pt-20 flex flex-col items-center px-6 md:px-20 bg-gray-900 text-white m-10">
      <div className="flex flex-col md:flex-row items-center justify-center w-full mb-12">
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-4xl font-bold mb-4 text-yellow-600">About Us</h1>
          <h3 className="text-2xl font-semibold text-teal-400 mb-4">
            Founded by : Er. Ravikant Sharma
          </h3>
          <p className="text-lg text-gray-300 mb-6">
            <span className=" text-2xl">Life Comrade MicroFinserve</span> is a leading microfinance company founded
            by Ravikant Sharma with the vision of promoting financial inclusion and
            empowering small businesses and individuals. Our goal is to reach
            those who are excluded from traditional financial services and
            provide them with reliable, transparent, and customized financial
            solutions.
          </p>
          <p className="text-lg text-gray-300">
            We are committed to enhancing financial literacy, offering
            accessible loan services, and fostering sustainable economic growth.
            With cutting-edge technology and expert guidance, we support our
            clients in becoming self-reliant and taking their businesses to new
            heights.
          </p>
          <p className="text-lg text-gray-300">
            We believe that financial independence is a fundamental right for
            everyone, and we continuously strive to unlock new opportunities for
            economic growth and development.
          </p>
        </div>
        <div className="md:w-1/2 flex justify-center mt-6 md:mt-0">
          <img
            src={founderImg}
            alt="Founder"
            className="w-full max-w-md rounded-lg shadow-lg"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 w-full max-w-5xl">
        {[
          {
            title: "Our Mission",
            text: "Our mission is to empower individuals and businesses by providing financial solutions that enhance growth and stability, ensuring a brighter future for our clients.",
          },
          {
            title: "Our Vision",
            text: "We want to build a financial ecosystem that enables businesses and individuals to progress through smart and sustainable financial solutions. Our goal is to make financial services accessible to every individual with trust, innovation, and transparency.",
          },
          {
            title: "Our Values",
            text: (
              <>
                <strong>Financial Empowerment:</strong> Enabling small businesses and individuals with accessible financial solutions.<br />
                <strong>Transparency & Trust:</strong> Ensuring honesty, clarity, and ethical financial practices.<br />
                <strong>Customer-Centric Approach:</strong> Providing tailored financial services with flexible solutions.<br />
                <strong>Innovation:</strong> Leveraging technology to enhance financial accessibility and efficiency.<br />
                <strong>Sustainable Growth:</strong> Promoting responsible lending and long-term financial success.<br />
                <strong>Inclusive Access:</strong> Serving the unbanked and underserved communities with fair financial opportunities.<br />
                <strong>Excellence:</strong> Continuously improving our services to deliver the best financial solutions.
              </>
            ),
          },
        ].map((item, index) => (
          <div
            key={index}
            className="p-6 bg-gray-800 rounded-lg shadow-lg text-center transition-all duration-300 hover:bg-teal-200 hover:text-gray-900"
          >
            <h2 className="text-3xl font-semibold text-yellow-600 mb-4 transition-all duration-300 group-hover:text-gray-900">
              {item.title}
            </h2>
            <p className="text-lg  transition-all duration-300 group-hover:text-gray-950">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
