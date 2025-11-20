
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Technician, Availability, NewsArticle, Video, Partner, SiteConfig } from '../types/types';
import { motion, AnimatePresence, useInView, animate } from 'framer-motion';
import ChatWidget from '../components/ChatWidget';
import PartnersMarquee from '../components/PartnersMarquee';
import apiClient from '../api/client';
import { useLanguage } from '../contexts/LanguageContext';
import { SITE_CONFIG_DATA } from '../api/mock-data';

const AvailabilityIndicator: React.FC<{ availability: Availability }> = ({ availability }) => {
  const baseClasses = "h-3 w-3 rounded-full inline-block mr-2";
  let colorClass = '';
  switch (availability) {
    case Availability.AVAILABLE:
      colorClass = 'bg-green-500';
      break;
    case Availability.SOON:
      colorClass = 'bg-yellow-500';
      break;
    case Availability.UNAVAILABLE:
      colorClass = 'bg-red-500';
      break;
  }
  return <span className={`${baseClasses} ${colorClass}`}></span>;
};

const TechnicianCard: React.FC<{ technician: Technician }> = ({ technician }) => (
    <motion.div 
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ duration: 0.2 }}
        className="bg-brand-gray rounded-lg overflow-hidden shadow-lg cursor-pointer"
    >
        <img className="w-full h-56 object-cover" src={technician.avatarUrl} alt={technician.name} />
        <div className="p-4">
            <h3 className="text-xl font-bold text-white">{technician.name}</h3>
            <p className="text-brand-red">{technician.specialty}</p>
            <div className="text-sm text-gray-300 mt-2 flex items-center">
                <AvailabilityIndicator availability={technician.availability} />
                {technician.availability}
            </div>
        </div>
    </motion.div>
);

const NewsCard: React.FC<{ article: NewsArticle }> = ({ article }) => (
    <motion.div 
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ duration: 0.2 }}
        className="bg-brand-gray rounded-lg overflow-hidden shadow-lg cursor-pointer"
    >
        <img className="w-full h-56 object-cover" src={article.imageUrl} alt={article.title} />
        <div className="p-4">
            <p className="text-sm text-gray-400 mb-1">{new Date(article.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <h3 className="text-xl font-bold text-white mb-2">{article.title}</h3>
            <p className="text-gray-300 text-sm line-clamp-3">{article.summary}</p>
        </div>
    </motion.div>
);

const VideoCard: React.FC<{ video: Video; onClick: () => void }> = ({ video, onClick }) => (
    <motion.div 
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="bg-brand-gray rounded-lg overflow-hidden shadow-lg cursor-pointer group"
      onClick={onClick}
    >
        <div className="relative">
            <img className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" src={video.thumbnailUrl} alt={video.title} />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <svg className="h-16 w-16 text-white text-opacity-80 group-hover:text-opacity-100 transform group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path></svg>
            </div>
            <span className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs font-semibold px-2 py-1 rounded">
                {video.duration}
            </span>
        </div>
        <div className="p-4">
            <h3 className="text-md font-bold text-white line-clamp-2">{video.title}</h3>
        </div>
    </motion.div>
);

const VideoModal: React.FC<{ video: Video; onClose: () => void }> = ({ video, onClose }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4"
        onClick={onClose}
    >
        <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="relative bg-brand-dark rounded-lg shadow-xl w-full max-w-4xl overflow-hidden"
            onClick={e => e.stopPropagation()}
        >
            <div className="relative" style={{ paddingTop: '56.25%' }}> {/* 16:9 Aspect Ratio */}
                <iframe
                    src={`${video.videoUrl}?autoplay=1&rel=0`}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full"
                ></iframe>
            </div>
            <div className="p-4">
                 <h3 className="text-xl font-bold text-white">{video.title}</h3>
            </div>
            <button onClick={onClose} className="absolute -top-3 -right-3 text-white bg-brand-red rounded-full h-8 w-8 flex items-center justify-center text-xl font-bold z-10 hover:bg-opacity-80 transition-opacity">&times;</button>
        </motion.div>
    </motion.div>
);

const AnimatedStat: React.FC<{ value: number; suffix?: string; }> = ({ value, suffix = '' }) => {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    useEffect(() => {
        if (isInView && ref.current) {
            const controls = animate(0, value, {
                duration: 2,
                ease: "easeOut",
                onUpdate(latest) {
                    if(ref.current) {
                       ref.current.textContent = Math.round(latest).toLocaleString('fr-FR') + suffix;
                    }
                }
            });
            return () => controls.stop();
        }
    }, [isInView, value, suffix]);

    return <span ref={ref}>0{suffix}</span>;
};


const StatCard: React.FC<{ value: number; label: string; suffix?: string; icon: React.ReactNode; }> = ({ value, label, suffix, icon }) => (
    <motion.div 
        whileHover={{ scale: 1.05 }}
        className="bg-brand-gray p-8 rounded-lg text-center flex flex-col items-center"
    >
        <div className="text-brand-red mb-4">{icon}</div>
        <div className="text-6xl lg:text-7xl font-extrabold text-white" style={{ lineHeight: '1' }}>
             <AnimatedStat value={value} suffix={suffix} />
        </div>
        <p className="text-gray-400 mt-2 text-lg">{label}</p>
    </motion.div>
);


const StatsSection: React.FC<{ memberCount: number }> = ({ memberCount }) => (
    <section className="my-16 py-12 bg-brand-dark">
        <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Le RETECHCI en Chiffres</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <StatCard 
                    value={memberCount} 
                    label="Membres Actifs"
                    icon={<svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.125-1.274-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.125-1.274.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                />
                <StatCard 
                    value={150} 
                    label="Projets Accompagnés" 
                    suffix="+"
                    icon={<svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>}
                />
                <StatCard 
                    value={800} 
                    label="Heures de Formation" 
                    suffix="+"
                    icon={<svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
                />
                 <StatCard 
                    value={25} 
                    label="Partenaires Stratégiques"
                    icon={<svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
                />
            </div>
        </div>
    </section>
);


const HomePage: React.FC = () => {
    const [technicians, setTechnicians] = useState<Technician[]>([]);
    const [news, setNews] = useState<NewsArticle[]>([]);
    const [videos, setVideos] = useState<Video[]>([]);
    const [partners, setPartners] = useState<Partner[]>([]);
    const [siteConfig, setSiteConfig] = useState<SiteConfig>(SITE_CONFIG_DATA);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
    const { t } = useLanguage();
    
    // Fallback image if config fails or is empty
    const defaultHeroImage = "https://images.unsplash.com/photo-1585676623395-ad1d493f968c?q=80&w=2070&auto=format&fit=crop";

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setIsLoading(true);
                const [techData, newsData, videosData, partnersData, configData] = await Promise.all([
                    apiClient.get('/api/technicians'),
                    apiClient.get('/api/news'),
                    apiClient.get('/api/videos'),
                    apiClient.get('/api/partners'),
                    apiClient.get('/api/config'),
                ]);

                setTechnicians(techData);
                setNews(newsData);
                setVideos(videosData);
                setPartners(partnersData);
                if (configData) setSiteConfig(configData);

            } catch (error) {
                console.error("Erreur lors de la récupération des données pour la page d'accueil:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllData();
    }, []);
    
    const featuredTechnicians = technicians.slice(0, 3);
    const latestNews = news.slice(0, 2);
    
    // Use config image if available, otherwise use the default fallback immediately
    const heroImageUrl = siteConfig.heroImageUrl || defaultHeroImage;

    return (
        <div className="relative">
            {/* Hero Section */}
            <div 
              className="relative bg-black rounded-lg overflow-hidden shadow-2xl mb-16 h-96 text-white text-center flex flex-col justify-center items-center p-4 z-0"
              style={{ 
                backgroundImage: `url('${heroImageUrl}')`, 
                backgroundSize: 'cover', 
                backgroundPosition: 'center', 
                backgroundRepeat: 'no-repeat' 
              }}
            >
              {/* Opacité réduite à 50% pour que l'image soit visible tout en gardant le texte lisible */}
              <div className="absolute inset-0 bg-black bg-opacity-50"></div>
              <div className="relative z-10">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">{siteConfig.heroTitle || t('home.heroTitle')}</h1>
                <p className="text-lg md:text-xl max-w-2xl drop-shadow-lg">{siteConfig.heroSubtitle || t('home.heroSubtitle')}</p>
                <Link to="/technicians" className="mt-12 inline-block bg-brand-red text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-opacity-80 transition-colors shadow-lg">
                  {t('home.cta')}
                </Link>
              </div>
            </div>

            {/* Featured Technicians */}
            <section className="mb-16 relative z-10">
                <h2 className="text-3xl font-bold text-center mb-8">{t('home.featuredTechs')}</h2>
                {isLoading ? <div className="text-center">Chargement...</div> :
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {featuredTechnicians.map(tech => (
                                <Link to="/directory/technicians" key={tech.id}><TechnicianCard technician={tech} /></Link>
                            ))}
                        </div>
                        <div className="text-center mt-8">
                            <Link to="/directory/technicians" className="text-brand-red font-semibold hover:underline">
                                {t('home.seeAll')} &rarr;
                            </Link>
                        </div>
                    </>
                }
            </section>

            {/* Stats Section */}
            {!isLoading && <StatsSection memberCount={technicians.length} />}

            {/* Latest News */}
            <section className="my-16">
                <h2 className="text-3xl font-bold text-center mb-8">{t('home.latestNews')}</h2>
                 {isLoading ? <div className="text-center">Chargement...</div> :
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {latestNews.map(article => (
                                <Link to="/news" key={article.id}><NewsCard article={article} /></Link>
                            ))}
                        </div>
                        <div className="text-center mt-8">
                            <Link to="/news" className="text-brand-red font-semibold hover:underline">
                                {t('home.seeAllNews')} &rarr;
                            </Link>
                        </div>
                    </>
                }
            </section>
            
            {/* Videos Section */}
            <section className="my-16">
                <h2 className="text-3xl font-bold text-center mb-8">{t('home.videos')}</h2>
                 {isLoading ? <div className="text-center">Chargement...</div> :
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {videos.slice(0, 6).map(video => (
                            <VideoCard key={video.id} video={video} onClick={() => setSelectedVideo(video)} />
                        ))}
                    </div>
                }
            </section>

            {/* Partners Section */}
            <section className="my-16">
                <h2 className="text-3xl font-bold text-center mb-4">{t('home.partners')}</h2>
                <p className="text-center text-gray-400 mb-8">{t('home.partnersText')}</p>
                 {isLoading ? <div className="text-center">Chargement...</div> : <PartnersMarquee partners={partners} />}
            </section>

            <AnimatePresence>
                {selectedVideo && <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />}
            </AnimatePresence>

            <ChatWidget />
        </div>
    );
};

export default HomePage;
