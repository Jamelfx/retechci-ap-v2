import { UserRole } from '../types/types';

export const ROLE_WEIGHTS: { [key: string]: number } = {
  'Directrice de la photographie': 5,
  'Chef opératrice': 5,
  'Chef preneur de son': 5,
  'Cheffe monteuse': 5,
  'Chef électricien': 4,
  'Chef machiniste': 4,
  'Scripte': 4,
  'Cadreuse': 3,
  'Perchman': 3,
  'Assistante monteuse': 3,
  'Électricien': 2,
  'Machiniste': 2,
};

export const EXECUTIVE_ROLES: UserRole[] = [
    'Directeur Exécutif',
    'Secrétaire Général',
    'Secrétaire Général Adjoint',
    'Secrétaire à la communication',
    'Secrétaire à la communication Adjoint',
    'Trésorière',
    'Trésorier Adjoint'
];

export const ALL_USER_ROLES: UserRole[] = [
    'Directeur Exécutif',
    'Président du CA',
    'Secrétaire Général',
    'Secrétaire Général Adjoint',
    'Secrétaire à la communication',
    'Secrétaire à la communication Adjoint',
    'Trésorière',
    'Trésorier Adjoint',
    'Membre',
];

export const IVORY_COAST_DISTRICTS: { [key: string]: string } = {
    Abidjan: "District Autonome d'Abidjan",
    BasSassandra: 'District du Bas-Sassandra',
    Comoe: 'District de la Comoé',
    Denguele: 'District du Denguélé',
    GohDjiboua: 'District du Gôh-Djiboua',
    Lacs: 'District des Lacs',
    Lagunes: 'District des Lagunes',
    Montagnes: 'District des Montagnes',
    SassandraMarahoue: 'District de Sassandra-Marahoué',
    Savanes: 'District des Savanes',
    ValleeDuBandama: 'District de la Vallée du Bandama',
    Woroba: 'District du Woroba',
    Yamoussoukro: 'District Autonome de Yamoussoukro',
    Zanzan: 'District du Zanzan',
};