
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { JobSalary } from '../types/types';
import apiClient from '../api/client';

const JoinPage: React.FC = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        specialty: '',
        otherSpecialty: '',
        bio: '',
        motivation: '',
        cvFile: null as File | null,
        agree: false,
    });
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [specialties, setSpecialties] = useState<string[]>([]);

    useEffect(() => {
        const fetchSpecialties = async () => {
            try {
                const salaries: JobSalary[] = await apiClient.get('/api/salaries');
                const specialtyList = salaries.map(job => job.jobTitle).sort((a, b) => a.localeCompare(b, 'fr'));
                setSpecialties(specialtyList);
            } catch (error) {
                console.error("Erreur lors de la récupération des spécialités:", error);
            }
        };
        fetchSpecialties();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setFormData({ ...formData, [name]: checked });
        } else if (name === 'phone') {
            const onlyNums = value.replace(/[^0-9]/g, '');
            if (onlyNums.length <= 10) {
                setFormData({ ...formData, phone: onlyNums });
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFormData({ ...formData, cvFile: e.target.files[0] });
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const finalSpecialty = formData.specialty === 'Autre' ? formData.otherSpecialty : formData.specialty;

            await apiClient.post('/api/applications', {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                specialty: finalSpecialty,
                bio: formData.bio,
                motivation: formData.motivation,
                cvFileName: formData.cvFile?.name,
            });

            setSubmitted(true);
        } catch (err: any) {
            setError(err.message || 'Une erreur est survenue lors de l\'envoi de la candidature.');
        }
    };

    if (submitted) {
        return (
            <div className="max-w-2xl mx-auto bg-brand-gray p-8 rounded-lg shadow-xl text-center">
                <div className="bg-green-500 text-white p-4 rounded-md mb-6">
                    <h2 className="text-2xl font-bold">Merci pour votre demande !</h2>
                </div>
                <p className="text-gray-300">
                    Votre candidature sera examinée par le Conseil d'Administration. Nous vous recontacterons très prochainement par email pour vous informer de la suite du processus.
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto bg-brand-gray p-8 rounded-lg shadow-xl">
            <h1 className="text-3xl font-bold text-center mb-2">Demande d'Adhésion au RETECHCI</h1>
            <p className="text-center text-gray-400 mb-8">Rejoignez notre réseau de professionnels passionnés. Remplissez le formulaire ci-dessous pour soumettre votre candidature.</p>
            
            {error && (
                <div className="bg-red-500 text-white p-4 rounded-md mb-6 text-center">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-300">Prénom</label>
                        <input type="text" name="firstName" id="firstName" required value={formData.firstName} onChange={handleChange}
                               className="mt-1 block w-full bg-brand-dark border-gray-600 rounded-md shadow-sm p-3 focus:ring-brand-red focus:border-brand-red" />
                    </div>
                     <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-300">Nom</label>
                        <input type="text" name="lastName" id="lastName" required value={formData.lastName} onChange={handleChange}
                               className="mt-1 block w-full bg-brand-dark border-gray-600 rounded-md shadow-sm p-3 focus:ring-brand-red focus:border-brand-red" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300">Adresse Email</label>
                        <input type="email" name="email" id="email" required value={formData.email} onChange={handleChange}
                               className="mt-1 block w-full bg-brand-dark border-gray-600 rounded-md shadow-sm p-3 focus:ring-brand-red focus:border-brand-red" />
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-300">Numéro de Téléphone (10 chiffres)</label>
                        <input type="tel" name="phone" id="phone" required value={formData.phone} onChange={handleChange}
                               maxLength={10} pattern="\d{10}"
                               title="Veuillez entrer 10 chiffres."
                               className="mt-1 block w-full bg-brand-dark border-gray-600 rounded-md shadow-sm p-3 focus:ring-brand-red focus:border-brand-red" />
                    </div>
                </div>
                <div>
                    <label htmlFor="specialty" className="block text-sm font-medium text-gray-300">Spécialité Principale</label>
                    <select name="specialty" id="specialty" required value={formData.specialty} onChange={handleChange}
                            className="mt-1 block w-full bg-brand-dark border-gray-600 rounded-md shadow-sm p-3 focus:ring-brand-red focus:border-brand-red">
                        <option value="" disabled>Sélectionnez votre métier...</option>
                        {specialties.length > 0 ? (
                            specialties.map(spec => (
                                <option key={spec} value={spec}>{spec}</option>
                            ))
                        ) : (
                            <option disabled>Chargement des spécialités...</option>
                        )}
                        <option value="Autre">Autre (préciser)</option>
                    </select>
                </div>
                {formData.specialty === 'Autre' && (
                    <div>
                        <label htmlFor="otherSpecialty" className="block text-sm font-medium text-gray-300">Précisez votre spécialité</label>
                        <input type="text" name="otherSpecialty" id="otherSpecialty" required value={formData.otherSpecialty} onChange={handleChange}
                               className="mt-1 block w-full bg-brand-dark border-gray-600 rounded-md shadow-sm p-3 focus:ring-brand-red focus:border-brand-red" />
                    </div>
                )}
                <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-300">Courte biographie</label>
                    <textarea name="bio" id="bio" rows={4} required value={formData.bio} onChange={handleChange}
                              placeholder="Présentez-vous en quelques lignes..."
                              className="mt-1 block w-full bg-brand-dark border-gray-600 rounded-md shadow-sm p-3 focus:ring-brand-red focus:border-brand-red"></textarea>
                </div>
                <div>
                    <label htmlFor="motivation" className="block text-sm font-medium text-gray-300">Pourquoi souhaitez-vous rejoindre le RETECHCI ?</label>
                    <textarea name="motivation" id="motivation" rows={4} required value={formData.motivation} onChange={handleChange}
                              placeholder="Expliquez vos motivations, ce que vous pouvez apporter au réseau et ce que vous en attendez."
                              className="mt-1 block w-full bg-brand-dark border-gray-600 rounded-md shadow-sm p-3 focus:ring-brand-red focus:border-brand-red"></textarea>
                </div>
                 <div>
                    <label htmlFor="cvFile" className="block text-sm font-medium text-gray-300">Votre CV ou Dossier</label>
                    <div className="mt-1 flex items-center">
                         <label htmlFor="cvFile" className="cursor-pointer bg-brand-dark border border-gray-600 rounded-md shadow-sm p-3 focus:ring-brand-red focus:border-brand-red text-gray-300 hover:bg-gray-800">
                             Parcourir...
                         </label>
                         <input type="file" name="cvFile" id="cvFile" onChange={handleFileChange} accept=".pdf,.doc,.docx" className="hidden" />
                         {formData.cvFile && <span className="ml-3 text-gray-400 text-sm">{formData.cvFile.name}</span>}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Formats acceptés : PDF, Word (.doc, .docx).</p>
                </div>
                <div className="flex items-start">
                     <div className="flex items-center h-5">
                        <input id="agree" name="agree" type="checkbox" checked={formData.agree} onChange={handleChange} required
                               className="focus:ring-brand-red h-4 w-4 text-brand-red border-gray-300 rounded"/>
                     </div>
                     <div className="ml-3 text-sm">
                        <label htmlFor="agree" className="font-medium text-gray-300">
                           Je certifie l'exactitude des informations fournies et j'ai lu et j'accepte la <Link to="/conventions/charte-image" target="_blank" className="text-brand-red hover:underline">charte de l'association</Link>.
                        </label>
                     </div>
                </div>
                <div>
                    <button type="submit"
                            disabled={!formData.agree}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-brand-red hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">
                        Envoyer ma Candidature
                    </button>
                </div>
            </form>
        </div>
    );
};

export default JoinPage;