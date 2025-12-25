
import React from 'react';
import { BadgeCheck, Globe, ShoppingCart, Info, ThumbsUp, ThumbsDown, AlertTriangle, ExternalLink, ArrowLeft } from 'lucide-react';
import { ProductInfo } from '../types';
import { NutritionInfo } from './NutritionInfo';

interface ProductDetailsProps {
  product: ProductInfo;
  onReset: () => void;
  onAddToShoppingList: (product: ProductInfo) => void;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ product, onReset, onAddToShoppingList }) => {
  return (
    <div className="max-w-4xl mx-auto p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button 
        onClick={onReset}
        className="flex items-center gap-2 text-indigo-600 mb-6 font-bold hover:translate-x-1 transition"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>مسح منتج آخر</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header Info */}
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-48 aspect-square bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden border">
                {product.images?.[0] ? (
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-contain p-2" />
                ) : (
                  <ShoppingCart className="w-12 h-12 text-gray-200" />
                )}
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${product.isLocal ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {product.isLocal ? <BadgeCheck className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                    {product.origin}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold">
                    {product.category}
                  </span>
                </div>
                <h1 className="text-3xl font-black text-gray-900">{product.name}</h1>
                <p className="text-lg text-indigo-600 font-bold">{product.brand}</p>
                <p className="text-gray-500 leading-relaxed">{product.description}</p>
                
                <button 
                  onClick={() => onAddToShoppingList(product)}
                  className="mt-4 w-full md:w-auto bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition"
                >
                  إضافة لقائمة التسوق
                </button>
              </div>
            </div>
          </section>

          {/* Health Analysis */}
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative">
            <div className={`absolute top-0 right-0 w-2 h-full ${product.healthAnalysis.score > 70 ? 'bg-green-500' : product.healthAnalysis.score > 40 ? 'bg-yellow-500' : 'bg-red-500'}`} />
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Info className="w-6 h-6 text-indigo-500" />
              <span>التحليل الصحي للمكونات</span>
            </h3>
            <div className="flex items-center gap-4 mb-6">
              <div className="text-4xl font-black text-gray-800">{product.healthAnalysis.score}/100</div>
              <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${product.healthAnalysis.score > 70 ? 'bg-green-500' : product.healthAnalysis.score > 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${product.healthAnalysis.score}%` }}
                />
              </div>
            </div>
            <p className="text-gray-600 mb-6 italic">{product.healthAnalysis.summary}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-2xl">
                <h4 className="font-bold text-green-700 mb-2 flex items-center gap-2">
                  <ThumbsUp className="w-4 h-4" /> إيجابيات
                </h4>
                <ul className="text-sm text-green-600 space-y-1">
                  {product.healthAnalysis.pros.map((pro, i) => <li key={i}>• {pro}</li>)}
                </ul>
              </div>
              <div className="p-4 bg-red-50 rounded-2xl">
                <h4 className="font-bold text-red-700 mb-2 flex items-center gap-2">
                  <ThumbsDown className="w-4 h-4" /> سلبيات
                </h4>
                <ul className="text-sm text-red-600 space-y-1">
                  {product.healthAnalysis.cons.map((con, i) => <li key={i}>• {con}</li>)}
                </ul>
              </div>
            </div>
          </section>

          {/* Pricing Comparison */}
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold mb-6">مقارنة الأسعار</h3>
            <div className="space-y-4">
              {product.pricing.comparison.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl border hover:border-indigo-200 transition bg-gray-50/30">
                  <div>
                    <span className="block font-bold text-gray-900">{item.store}</span>
                    <span className="text-sm text-gray-500">متوفر الآن</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xl font-black text-indigo-600">{item.price}</span>
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Nutrition Facts */}
          {product.nutrition && <NutritionInfo nutrition={product.nutrition} />}

          {/* Allergens */}
          {product.allergens.length > 0 && (
            <section className="bg-red-50 p-6 rounded-3xl border border-red-100">
              <h3 className="text-xl font-bold text-red-700 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6" />
                <span>تحذير الحساسية</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.allergens.map((allergen, i) => (
                  <span key={i} className="px-4 py-2 bg-white text-red-600 rounded-xl font-bold shadow-sm border border-red-100">
                    {allergen}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Ingredients */}
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold mb-4">المكونات</h3>
            <div className="flex flex-wrap gap-2">
              {product.ingredients.map((ing, i) => (
                <span key={i} className="text-sm bg-gray-50 px-3 py-1.5 rounded-lg border text-gray-600">
                  {ing}
                </span>
              ))}
            </div>
          </section>

          {/* Alternatives */}
          <section className="bg-indigo-600 p-6 rounded-3xl text-white">
            <h3 className="text-xl font-bold mb-4">بدائل ذكية</h3>
            <div className="space-y-4">
              {product.alternatives.map((alt, i) => (
                <div key={i} className="p-4 bg-white/10 rounded-2xl border border-white/20">
                  <span className="block font-bold text-lg">{alt.name}</span>
                  <span className="text-sm text-indigo-100">{alt.reason}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
