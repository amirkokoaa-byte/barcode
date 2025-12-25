
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ProductInfo } from '../types';

export const NutritionInfo: React.FC<{ nutrition: ProductInfo['nutrition'] }> = ({ nutrition }) => {
  if (!nutrition) return null;

  const data = [
    { name: 'بروتين', value: nutrition.protein, color: '#4f46e5' },
    { name: 'دهون', value: nutrition.fat, color: '#f59e0b' },
    { name: 'كربوهيدرات', value: nutrition.carbs, color: '#10b981' },
  ];

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
      <h3 className="text-xl font-bold mb-6 flex justify-between items-center">
        <span>القيمة الغذائية</span>
        <span className="text-sm font-normal text-gray-500">حصة: {nutrition.servingSize}</span>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="text-center -mt-28">
            <p className="text-3xl font-black text-indigo-600">{nutrition.calories}</p>
            <p className="text-xs text-gray-400 uppercase">سعرة</p>
          </div>
        </div>

        <div className="space-y-4">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-gray-600">{item.name}</span>
              </div>
              <span className="font-bold">{item.value}جم</span>
            </div>
          ))}
          <div className="pt-4 border-t border-dashed space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">سكريات:</span>
              <span>{nutrition.sugar}جم</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">ألياف:</span>
              <span>{nutrition.fiber}جم</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">صوديوم:</span>
              <span>{nutrition.sodium}ملجم</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
