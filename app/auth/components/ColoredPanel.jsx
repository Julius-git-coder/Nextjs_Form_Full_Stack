import Particles from "../Particles";
import { PARTICLES_CONFIG } from "../utils/constants";

export default function ColoredPanel({ config }) {
  return (
    <div className="relative overflow-hidden flex items-center justify-center p-8 lg:p-12 min-h-[200px] lg:min-h-0">
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <Particles {...PARTICLES_CONFIG} className="w-full h-full" />
      </div>
      <div className="relative z-10 text-center">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 transition-all duration-500">
          {config.title}
        </h1>
        <p className="text-sm sm:text-base lg:text-lg opacity-90 transition-all duration-500">
          {config.subtitle}
        </p>
      </div>
    </div>
  );
}
