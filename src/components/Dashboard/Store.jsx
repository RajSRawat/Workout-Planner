import React from 'react';
import { ShoppingBag, Star } from 'lucide-react';

const products = [
    { id: 1, name: "Whey Protein Isolate", price: "$59.99", rating: 4.8, image: "protein" },
    { id: 2, name: "Creatine Monohydrate", price: "$29.99", rating: 4.9, image: "creatine" },
    { id: 3, name: "Pre-Workout Igniter", price: "$39.99", rating: 4.7, image: "pre" },
    { id: 4, name: "BCAA Recovery", price: "$24.99", rating: 4.5, image: "bcaa" },
];

const Store = () => {
    return (
        <div className="p-6 h-full overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-rose-500">Supplement Store</h2>
                <div className="px-3 py-1 bg-pink-500/10 text-pink-400 border border-pink-500/20 rounded-full text-xs">
                    Mock Environment
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map(product => (
                    <div key={product.id} className="bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-pink-500/50 transition group">
                        <div className="h-40 bg-black/40 flex items-center justify-center">
                            <ShoppingBag size={48} className="text-white/20 group-hover:text-pink-500 transition duration-500" />
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold text-lg">{product.name}</h3>
                                <span className="text-pink-400 font-bold">{product.price}</span>
                            </div>
                            <div className="flex items-center gap-1 text-yellow-400 text-sm mb-4">
                                <Star size={14} fill="currentColor" />
                                <span>{product.rating}</span>
                            </div>
                            <button className="w-full py-2 bg-white/10 hover:bg-pink-600 hover:text-white rounded-lg transition text-sm font-medium">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Store;
