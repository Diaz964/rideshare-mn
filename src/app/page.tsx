import Link from "next/link";

function ModernCarIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-16 h-16 mx-auto"
    >
      <rect x="6" y="28" width="52" height="16" rx="4" fill="#7B1E34" />
      <path
        d="M14 28L20 16H44L50 28"
        stroke="#7B1E34"
        strokeWidth="3"
        fill="#A3324B"
      />
      <rect x="22" y="18" width="8" height="9" rx="1" fill="#E8D5DC" />
      <rect x="34" y="18" width="8" height="9" rx="1" fill="#E8D5DC" />
      <circle cx="18" cy="44" r="5" fill="#333" />
      <circle cx="18" cy="44" r="2.5" fill="#888" />
      <circle cx="46" cy="44" r="5" fill="#333" />
      <circle cx="46" cy="44" r="2.5" fill="#888" />
      <rect x="10" y="32" width="6" height="3" rx="1" fill="#FFD700" />
      <rect x="48" y="32" width="6" height="3" rx="1" fill="#FF4444" />
      <rect x="24" y="30" width="16" height="6" rx="1" fill="#5A1528" />
    </svg>
  );
}

function CardPaymentIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-16 h-16 mx-auto"
    >
      <rect x="6" y="14" width="52" height="36" rx="5" fill="#7B1E34" />
      <rect x="6" y="22" width="52" height="8" fill="#5A1528" />
      <rect x="12" y="36" width="20" height="4" rx="2" fill="#E8D5DC" />
      <rect x="12" y="44" width="12" height="2" rx="1" fill="#A3324B" />
      <rect x="42" y="36" width="10" height="8" rx="2" fill="#FFD700" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-16 h-16 mx-auto"
    >
      <path
        d="M32 6L10 18V34C10 48 32 58 32 58C32 58 54 48 54 34V18L32 6Z"
        fill="#7B1E34"
      />
      <path
        d="M32 10L14 20V34C14 45.5 32 54 32 54C32 54 50 45.5 50 34V20L32 10Z"
        fill="#A3324B"
      />
      <path
        d="M26 32L30 36L40 26"
        stroke="white"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-burgundy to-burgundy-dark text-white py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold tracking-tight mb-6">
            Your Ride, Your Way
          </h1>
          <p className="text-xl text-burgundy-200 mb-4 max-w-2xl mx-auto">
            Affordable and reliable rides across Minnesota. Book in seconds, pay
            with card, and get where you need to go.
          </p>
          <p className="text-lg text-burgundy-200 mb-10 max-w-2xl mx-auto italic">
            Viajes accesibles y confiables en todo Minnesota. Reserve en segundos,
            pague con tarjeta y llegue a donde necesite.
          </p>
          <Link
            href="/book"
            className="inline-block bg-white text-burgundy font-semibold text-lg px-8 py-4 rounded-full hover:bg-burgundy-50 transition-colors shadow-lg"
          >
            Book a Ride Now / Reserve Ahora
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-burgundy-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-burgundy-dark mb-4">
            Why XELAJU?
          </h2>
          <p className="text-center text-gray-500 italic mb-14">
            ¿Por qué XELAJU?
          </p>
          <div className="grid md:grid-cols-3 gap-10">
            <FeatureCard
              icon={<ModernCarIcon />}
              title="Fast Pickup"
              titleEs="Recogida Rápida"
              description="Get matched with a nearby driver in minutes. No long waits."
              descriptionEs="Lo conectamos con un conductor cercano en minutos. Sin largas esperas."
            />
            <FeatureCard
              icon={<CardPaymentIcon />}
              title="Card Payment"
              titleEs="Pago con Tarjeta"
              description="Pay securely with your credit or debit card. No cash needed."
              descriptionEs="Pague de forma segura con su tarjeta de crédito o débito. No necesita efectivo."
            />
            <FeatureCard
              icon={<ShieldIcon />}
              title="Safe & Reliable"
              titleEs="Seguro y Confiable"
              description="Verified drivers and real-time ride tracking for your peace of mind."
              descriptionEs="Conductores verificados y seguimiento en tiempo real para su tranquilidad."
            />
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-burgundy-dark mb-4">
            Our Services / Nuestros Servicios
          </h2>
          <p className="text-center text-gray-500 mb-14 max-w-2xl mx-auto">
            We provide transportation services throughout the Minneapolis &amp; St. Paul
            metro area and across Minnesota.
            <br />
            <span className="italic">
              Ofrecemos servicios de transporte en el área metropolitana de
              Minneapolis y St. Paul y en todo Minnesota.
            </span>
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <ServiceCard
              title="Airport Rides"
              titleEs="Viajes al Aeropuerto"
              description="Reliable rides to MSP Airport and other airports."
              descriptionEs="Viajes confiables al aeropuerto MSP y otros aeropuertos."
            />
            <ServiceCard
              title="Medical Appointments"
              titleEs="Citas Médicas"
              description="Safe and timely transportation to clinics, hospitals, and medical centers."
              descriptionEs="Transporte seguro y puntual a clínicas, hospitales y centros médicos."
            />
            <ServiceCard
              title="Daily Transportation"
              titleEs="Transporte Diario"
              description="Everyday rides for work, errands, shopping, and more."
              descriptionEs="Viajes diarios para trabajo, mandados, compras y más."
            />
          </div>
        </div>
      </section>

      {/* Drive with us */}
      <section className="py-20 px-6 bg-burgundy-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-burgundy-dark mb-4">
            Want to Drive with Us?
          </h2>
          <p className="text-lg text-gray-600 mb-2">
            Earn money on your own schedule. Join the XELAJU driver team today.
          </p>
          <p className="text-lg text-gray-500 italic mb-8">
            Gane dinero con su propio horario. Únase al equipo de conductores de
            XELAJU hoy.
          </p>
          <Link
            href="/drive"
            className="inline-block bg-burgundy-900 text-white font-semibold text-lg px-8 py-4 rounded-full hover:bg-burgundy-dark transition-colors shadow-lg"
          >
            Apply to Drive / Solicitar Conducir
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-burgundy mb-6">
            Ready to Go? / ¿Listo para salir?
          </h2>
          <p className="text-lg text-gray-600 mb-2">
            Enter your pickup and destination, choose your ride, and pay — all
            in one place.
          </p>
          <p className="text-lg text-gray-500 italic mb-8">
            Ingrese su recogida y destino, elija su viaje y pague — todo en un
            solo lugar.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/book"
              className="inline-block bg-burgundy text-white font-semibold text-lg px-8 py-4 rounded-full hover:bg-burgundy-dark transition-colors shadow-lg"
            >
              Get Started / Comenzar
            </Link>
            <span className="text-gray-400">or / o</span>
            <a
              href="tel:6125582880"
              className="inline-flex items-center gap-2 text-lg font-semibold text-burgundy hover:text-burgundy-dark transition-colors"
            >
              <span>📞</span> Call (612) 558-2880
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  titleEs,
  description,
  descriptionEs,
}: {
  icon: React.ReactNode;
  title: string;
  titleEs: string;
  description: string;
  descriptionEs: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-burgundy-100 text-center">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-burgundy mb-1">{title}</h3>
      <p className="text-sm text-burgundy-dark italic mb-3">{titleEs}</p>
      <p className="text-gray-600 mb-2">{description}</p>
      <p className="text-gray-500 text-sm italic">{descriptionEs}</p>
    </div>
  );
}

function ServiceCard({
  title,
  titleEs,
  description,
  descriptionEs,
}: {
  title: string;
  titleEs: string;
  description: string;
  descriptionEs: string;
}) {
  return (
    <div className="bg-burgundy-50 rounded-2xl p-6 border border-burgundy-100">
      <h3 className="text-lg font-semibold text-burgundy-dark mb-1">{title}</h3>
      <p className="text-sm text-burgundy italic mb-3">{titleEs}</p>
      <p className="text-gray-600 text-sm mb-2">{description}</p>
      <p className="text-gray-500 text-sm italic">{descriptionEs}</p>
    </div>
  );
}
