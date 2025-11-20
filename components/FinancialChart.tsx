import React from 'react';
import { FinancialYearData } from '../types';

interface FinancialChartProps {
    data: FinancialYearData[];
}

const FinancialChart: React.FC<FinancialChartProps> = ({ data }) => {
    const maxValue = Math.max(...data.flatMap(d => [d.recettes, d.dépenses]));

    const formatCurrency = (value: number) => {
        if (value >= 1000000) {
            return `${(value / 1000000).toFixed(1)}M`;
        }
        if (value >= 1000) {
            return `${(value / 1000).toFixed(0)}K`;
        }
        return value.toString();
    };

    return (
        <div className="w-full">
            <div className="flex justify-end space-x-4 text-xs mb-4">
                <div className="flex items-center">
                    <span className="h-3 w-3 rounded-sm bg-green-500 mr-2"></span>
                    <span>Recettes</span>
                </div>
                <div className="flex items-center">
                    <span className="h-3 w-3 rounded-sm bg-red-500 mr-2"></span>
                    <span>Dépenses</span>
                </div>
            </div>
            <div className="flex justify-between items-end h-64 border-l border-b border-gray-700 px-4 space-x-4">
                {data.map(item => (
                    <div key={item.year} className="flex-1 flex flex-col items-center justify-end">
                        <div className="w-full flex justify-center items-end space-x-2 h-full">
                             <div className="w-1/2 group relative">
                                <div 
                                    className="w-full bg-green-500 rounded-t-sm hover:bg-green-400 transition-colors"
                                    style={{ height: `${(item.recettes / maxValue) * 100}%` }}
                                ></div>
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-black text-white text-xs rounded py-1 px-2 pointer-events-none">
                                    {item.recettes.toLocaleString('fr-FR')} FCFA
                                </div>
                            </div>
                            <div className="w-1/2 group relative">
                                <div 
                                    className="w-full bg-red-500 rounded-t-sm hover:bg-red-400 transition-colors"
                                    style={{ height: `${(item.dépenses / maxValue) * 100}%` }}
                                ></div>
                                 <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-black text-white text-xs rounded py-1 px-2 pointer-events-none">
                                    {item.dépenses.toLocaleString('fr-FR')} FCFA
                                </div>
                            </div>
                        </div>
                        <span className="text-sm text-gray-400 mt-2">{item.year}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FinancialChart;
