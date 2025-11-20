import React from 'react';

const SocialIcon: React.FC<{ href: string; label: string; children: React.ReactNode }> = ({ href, label, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="text-gray-400 hover:text-brand-red transition-colors duration-300"
  >
    {children}
  </a>
);

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-gray mt-12 border-t border-gray-800">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* Column 1: About & Social */}
          <div>
            <h3 className="font-bold text-white text-lg mb-4">RETECHCI</h3>
            <p className="text-gray-400 text-sm mb-4">
              Le Réseau des Techniciens du Cinéma de Côte d'Ivoire. Fait avec passion pour le cinéma ivoirien.
            </p>
            <div className="flex justify-center md:justify-start space-x-6">
              <SocialIcon href="#" label="Suivez-nous sur Facebook">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
              </SocialIcon>
              <SocialIcon href="#" label="Suivez-nous sur Twitter">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
              </SocialIcon>
              <SocialIcon href="#" label="Suivez-nous sur LinkedIn">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
              </SocialIcon>
            </div>
          </div>

          {/* Column 2: Contact Info */}
          <div>
            <h3 className="font-bold text-white text-lg mb-4">Nous Contacter</h3>
            <div className="text-gray-400 text-sm space-y-2">
              <p>📍 Siège social, Abidjan, Côte d'Ivoire</p>
              <p>✉️ contact@retechci.ci</p>
              <p>📞 +225 01 23 45 67 89</p>
            </div>
          </div>

          {/* Column 3: Geolocation */}
          <div>
            <h3 className="font-bold text-white text-lg mb-4">Notre Siège</h3>
            <div className="rounded-lg overflow-hidden h-40">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d254236.4172483868!2d-4.145638125866113!3d5.34842240905146!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfc1ea5311da4cf%3A0x63b469a458314988!2sAbidjan!5e0!3m2!1sfr!2sci!4v1692711019231!5m2!1sfr!2sci"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'grayscale(1) invert(0.9) contrast(0.9)' }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Siège du RETECHCI"
              ></iframe>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} Réseau des Techniciens du Cinéma de Côte d'Ivoire (RETECHCI). Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;