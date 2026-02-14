import React, { useState } from 'react';
import { storage } from '../../services/storage';
import { Phone, UserCheck, Ambulance, Edit2 } from 'lucide-react';

const Contacts = () => {
    const [user, setUser] = useState(storage.getUser());
    const [editMode, setEditMode] = useState(false);

    const saveContacts = () => {
        storage.saveUser(user);
        setEditMode(false);
    };

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">Emergency & Contacts</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* SOS Section */}
                <div className="bg-red-900/20 border border-red-500/30 p-6 rounded-2xl flex flex-col items-center text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Ambulance size={120} />
                    </div>
                    <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-4 shadow-[0_0_20px_red]">
                        <Phone className="text-white" size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-red-100 mb-2">SOS Emergency</h3>
                    <p className="text-red-200/60 mb-6">Quick dial for medical emergencies</p>

                    {editMode ? (
                        <input
                            className="bg-black/40 border border-red-500/30 text-white p-2 rounded text-center text-2xl font-mono w-full max-w-[200px]"
                            value={user.contacts.sos}
                            onChange={e => setUser({ ...user, contacts: { ...user.contacts, sos: e.target.value } })}
                        />
                    ) : (
                        <a href={`tel:${user.contacts.sos}`} className="text-4xl font-mono font-bold text-white hover:scale-110 transition cursor-pointer">
                            {user.contacts.sos}
                        </a>
                    )}
                </div>

                {/* Trainer Section */}
                <div className="bg-blue-900/20 border border-blue-500/30 p-6 rounded-2xl flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4 shadow-[0_0_20px_blue]">
                        <UserCheck className="text-white" size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-blue-100 mb-2">Personal Trainer</h3>
                    <p className="text-blue-200/60 mb-6">Contact for guidance & plans</p>

                    {editMode ? (
                        <input
                            className="bg-black/40 border border-blue-500/30 text-white p-2 rounded text-center text-xl w-full"
                            value={user.contacts.trainer}
                            onChange={e => setUser({ ...user, contacts: { ...user.contacts, trainer: e.target.value } })}
                        />
                    ) : (
                        <div className="text-xl font-medium text-white">
                            {user.contacts.trainer}
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-8 flex justify-center">
                <button
                    onClick={() => editMode ? saveContacts() : setEditMode(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full transition border border-white/10"
                >
                    <Edit2 size={18} />
                    {editMode ? "Save Contacts" : "Update Contact Info"}
                </button>
            </div>
        </div>
    );
};

export default Contacts;
