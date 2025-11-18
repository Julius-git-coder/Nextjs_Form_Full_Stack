import Particles from "../Particles";
import { PARTICLES_CONFIG } from "../utils/constants";

export default function BackgroundParticles() {
  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
      <Particles {...PARTICLES_CONFIG} className="w-full h-full" />
    </div>
  );
}
