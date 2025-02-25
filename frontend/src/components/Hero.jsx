import { ArrowRight } from "lucide-react";
const Hero = () => {
  return (
    <section id="home" className="pt-24 pb-16 px-4 min-h-[90vh] flex items-center bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center animate-fadeIn">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            Make a Difference Today
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Together We Can Create a Better World
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
            Join us in making a positive impact. Every donation, no matter how small, helps us build a brighter future for those in need.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-all transform hover:scale-105 flex items-center justify-center gap-2">
              Donate Now
              <ArrowRight className="w-4 h-4" />
            </button>
            <button className="px-8 py-3 border-2 border-primary text-primary rounded-full hover:bg-primary/5 transition-all">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Hero;