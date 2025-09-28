import React, { useState } from 'react';
import { User, updateProfile } from 'firebase/auth';

interface ProfileProps {
  user: User;
  onSignOut: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onSignOut }) => {
    const [displayName, setDisplayName] = useState(user.displayName || '');
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (user.displayName === displayName) {
            setIsEditing(false);
            return;
        }
        setLoading(true);
        try {
            await updateProfile(user, { displayName });
            alert("Profile updated successfully!");
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating profile: ", error);
            alert("Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };
    
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md max-w-2xl mx-auto">
      <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 border-b dark:border-slate-700 pb-4">My Profile</h3>
      
      <div className="flex items-center space-x-6 mb-8">
        <img
          src={user.photoURL || 'https://picsum.photos/100'}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover"
        />
        <div>
           {isEditing ? (
                <form onSubmit={handleUpdateProfile}>
                    <input 
                        type="text" 
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="text-2xl font-bold text-slate-800 dark:text-white bg-transparent border-b-2 border-red-500 focus:outline-none"
                    />
                    <div className="mt-2">
                        <button type="submit" disabled={loading} className="text-sm text-green-600 hover:text-green-800 disabled:text-gray-400">
                          {loading ? 'Saving...' : 'Save'}
                        </button>
                        <button type="button" onClick={() => setIsEditing(false)} className="text-sm text-gray-500 hover:text-gray-700 ml-2">Cancel</button>
                    </div>
                </form>
           ) : (
             <>
                <h4 className="text-2xl font-bold text-slate-800 dark:text-white">{user.displayName || 'No name set'}</h4>
                 <button onClick={() => setIsEditing(true)} className="text-sm text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400">Edit Name</button>
             </>
           )}
          <p className="text-slate-600 dark:text-slate-400">{user.email}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Email Address</label>
          <p className="text-slate-800 dark:text-white p-2 bg-slate-100 dark:bg-slate-700 rounded-md mt-1">{user.email}</p>
        </div>
         <div>
          <label className="text-sm font-medium text-slate-500 dark:text-slate-400">User ID</label>
          <p className="text-slate-800 dark:text-white p-2 bg-slate-100 dark:bg-slate-700 rounded-md mt-1 text-xs">{user.uid}</p>
        </div>
      </div>
      
      <div className="mt-8 border-t dark:border-slate-700 pt-6">
        <button
          onClick={onSignOut}
          className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Profile;