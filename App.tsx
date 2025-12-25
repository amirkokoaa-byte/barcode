
import React, { useState, useEffect } from 'react';
import { Scanner } from './components/Scanner';
import { ProductDetails } from './components/ProductDetails';
import { getProductDetails } from './services/geminiService';
import { ProductInfo, ShoppingListItem, HistoryItem } from './types';
import { ShoppingBag, Search, Scan, History, Heart, Loader2, Sparkles, X, Trash2 } from 'lucide-react';

const App: React.FC = () => {
  const [scannedProduct, setScannedProduct] = useState<ProductInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>(() => {
    const saved = localStorage.getItem('shopping_list');
    return saved ? JSON.parse(saved) : [];
  });
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem('scan_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [showList, setShowList] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('shopping_list', JSON.stringify(shoppingList));
  }, [shoppingList]);

  useEffect(() => {
    localStorage.setItem('scan_history', JSON.stringify(history));
  }, [history]);

  const handleScan = async (barcode: string, imageBase64?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const details = await getProductDetails(barcode, imageBase64);
      setScannedProduct(details);
      
      // Add to history
      setHistory(prev => {
        // Optional: Remove existing entries for the same product name to keep history unique
        const filtered = prev.filter(item => item.product.name !== details.name);
        return [
          { id: Date.now().toString(), product: details, scannedAt: Date.now() },
          ...filtered
        ].slice(0, 50); // Keep last 50 items
      });
    } catch (err) {
      console.error(err);
      setError('عذراً، لم نتمكن من العثور على المنتج. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  const addToShoppingList = (product: ProductInfo) => {
    setShoppingList(prev => [
      { id: Date.now().toString(), product, addedAt: Date.now() },
      ...prev
    ]);
    setShowList(true);
  };

  const removeFromList = (id: string) => {
    setShoppingList(prev => prev.filter(item => item.id !== id));
  };

  const removeFromHistory = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const clearHistory = () => {
    if (window.confirm('هل أنت متأكد من مسح سجل البحث بالكامل؟')) {
      setHistory([]);
    }
  };

  const selectFromHistory = (product: ProductInfo) => {
    setScannedProduct(product);
    setShowHistory(false);
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl">
              <Scan className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">ماسح ذكي</h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowList(true)}
              className="relative p-2 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
              aria-label="قائمة التسوق"
            >
              <ShoppingBag className="w-6 h-6 text-gray-700" />
              {shoppingList.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {shoppingList.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8">
        {!scannedProduct ? (
          <div className="flex flex-col items-center gap-12">
            <div className="text-center space-y-4 px-4">
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">اتخذ قراراً ذكياً بمجرد مسحة</h2>
              <p className="text-lg text-gray-500 max-w-lg mx-auto">
                قم بمسح الباركود للحصول على المعلومات الغذائية، مقارنة الأسعار، ومعرفة بلد المنشأ فوراً.
              </p>
            </div>

            <Scanner onScan={handleScan} isLoading={isLoading} />

            {isLoading && (
              <div className="flex flex-col items-center gap-4 animate-in fade-in duration-300">
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
                <p className="text-indigo-600 font-bold">جاري تحليل بيانات المنتج والأسعار...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 max-w-md text-center">
                {error}
              </div>
            )}

            {/* Quick Stats/Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 w-full">
              {[
                { icon: Sparkles, title: "تحليل صحي", desc: "تقييم شامل للمكونات ومدى جودتها" },
                { icon: Search, title: "مقارنة أسعار", desc: "روابط مباشرة لأفضل العروض المتاحة" },
                { icon: Heart, title: "بدائل محلية", desc: "دعم المنتج الوطني باقتراحات مصرية" }
              ].map((f, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-start gap-4">
                  <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                    <f.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{f.title}</h4>
                    <p className="text-sm text-gray-500">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <ProductDetails 
            product={scannedProduct} 
            onReset={() => setScannedProduct(null)}
            onAddToShoppingList={addToShoppingList}
          />
        )}
      </main>

      {/* Shopping List Modal */}
      {showList && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setShowList(false)} />
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <ShoppingBag className="w-6 h-6 text-indigo-600" />
                <span>قائمة التسوق</span>
              </h3>
              <button onClick={() => setShowList(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-4 space-y-3">
              {shoppingList.length === 0 ? (
                <div className="py-12 text-center text-gray-400">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>قائمة التسوق فارغة حالياً</p>
                </div>
              ) : (
                shoppingList.map(item => (
                  <div key={item.id} className="flex gap-4 p-3 bg-gray-50 rounded-2xl group border border-transparent hover:border-indigo-100 transition">
                    <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center overflow-hidden border">
                      {item.product.images?.[0] ? (
                        <img src={item.product.images[0]} className="w-full h-full object-contain" />
                      ) : (
                        <ShoppingBag className="w-6 h-6 text-gray-300" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 line-clamp-1">{item.product.name}</h4>
                      <p className="text-sm text-indigo-600">{item.product.brand}</p>
                      <span className="text-xs text-gray-400">{new Date(item.addedAt).toLocaleDateString('ar-EG')}</span>
                    </div>
                    <button 
                      onClick={() => removeFromList(item.id)}
                      className="p-2 self-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))
              )}
            </div>
            <div className="p-6 bg-gray-50 border-t">
              <button 
                onClick={() => setShowList(false)}
                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition"
              >
                متابعة التسوق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setShowHistory(false)} />
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <History className="w-6 h-6 text-indigo-600" />
                <span>سجل عمليات المسح</span>
              </h3>
              <div className="flex items-center gap-2">
                {history.length > 0 && (
                  <button 
                    onClick={clearHistory}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition"
                    title="مسح السجل"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
                <button onClick={() => setShowHistory(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-4 space-y-3">
              {history.length === 0 ? (
                <div className="py-12 text-center text-gray-400">
                  <History className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>لا يوجد تاريخ عمليات مسح بعد</p>
                </div>
              ) : (
                history.map(item => (
                  <div 
                    key={item.id} 
                    className="flex gap-4 p-3 bg-gray-50 rounded-2xl group border border-transparent hover:border-indigo-100 transition cursor-pointer"
                    onClick={() => selectFromHistory(item.product)}
                  >
                    <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center overflow-hidden border">
                      {item.product.images?.[0] ? (
                        <img src={item.product.images[0]} className="w-full h-full object-contain" />
                      ) : (
                        <Search className="w-6 h-6 text-gray-300" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 line-clamp-1">{item.product.name}</h4>
                      <p className="text-sm text-indigo-600">{item.product.brand}</p>
                      <span className="text-xs text-gray-400">{new Date(item.scannedAt).toLocaleString('ar-EG')}</span>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromHistory(item.id);
                      }}
                      className="p-2 self-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
            <div className="p-6 bg-gray-50 border-t">
              <button 
                onClick={() => setShowHistory(false)}
                className="w-full bg-white text-gray-700 border-2 border-gray-200 py-4 rounded-2xl font-bold hover:bg-gray-100 transition"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Bottom Nav (Mobile Friendly) */}
      <nav className="fixed bottom-6 left-4 right-4 z-40">
        <div className="max-w-md mx-auto bg-gray-900/90 backdrop-blur-xl rounded-full p-2 shadow-2xl flex items-center justify-around border border-white/10">
          <button 
            onClick={() => {
              setScannedProduct(null);
              setShowHistory(false);
              setShowList(false);
            }}
            className={`flex-1 flex flex-col items-center gap-1 py-2 transition ${!scannedProduct && !showHistory && !showList ? 'text-indigo-400' : 'text-gray-400 hover:text-white'}`}
          >
            <Scan className="w-6 h-6" />
            <span className="text-[10px] font-bold">المسح</span>
          </button>
          <button 
            onClick={() => setShowHistory(true)}
            className={`flex-1 flex flex-col items-center gap-1 py-2 transition ${showHistory ? 'text-indigo-400' : 'text-gray-400 hover:text-white'}`}
          >
            <History className="w-6 h-6" />
            <span className="text-[10px] font-bold">السجل</span>
          </button>
          <button 
            onClick={() => setShowList(true)}
            className={`flex-1 flex flex-col items-center gap-1 py-2 transition ${showList ? 'text-indigo-400' : 'text-gray-400 hover:text-white'}`}
          >
            <ShoppingBag className="w-6 h-6" />
            <span className="text-[10px] font-bold">القائمة</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default App;
