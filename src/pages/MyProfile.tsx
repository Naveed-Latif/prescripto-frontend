import { useState, useRef } from "react";

type Profile = {
  name: string;
  email: string;
  phone: string;
  address: string;
  gender: string;
  birthday: string;
  avatar: string | null;
};

export default function MyProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<Profile>({
    name: "Saepe quibusdam dese",
    email: "figiwozif@mailinator.com",
    phone: "000000000",
    address: "",
    gender: "Male",
    birthday: "2026-02-01",
    avatar: null,
  });

  const [draft, setDraft] = useState<Profile>({ ...profile });

  const handleEdit = () => {
    setDraft({ ...profile });
    setIsEditing(true);
  };

  const handleSave = () => {
    setProfile({ ...draft });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDraft({ ...profile });
    setIsEditing(false);
  };

  const handleChange = (field: keyof Profile, value: string) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      handleChange("avatar", reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const inputClass =
    "border border-gray-300 rounded px-2 py-1 text-sm text-gray-700 outline-none focus:ring-1 focus:ring-indigo-400 w-64 bg-white";

  const currentAvatar = isEditing ? draft.avatar : profile.avatar;

  return (
    <div className="min-h-screen bg-white px-16 py-10">
      {/* Avatar */}
      <div className="relative w-36 h-36 mb-6">
        <div className="w-36 h-36 bg-indigo-100 rounded-lg flex items-center justify-center overflow-hidden">
          {currentAvatar ? (
            <img
              src={currentAvatar}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <svg
              className="w-16 h-16 text-indigo-300"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
          )}
        </div>

        {/* Edit overlay on avatar */}
        {isEditing && (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex flex-col items-center justify-center cursor-pointer group transition"
          >
            <svg
              className="w-7 h-7 text-white mb-1"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5V19a1 1 0 001 1h16a1 1 0 001-1v-2.5M16.5 3.5l4 4M13 7L4 16H3v-1L13 5l.5-.5 4 4-.5.5L7 19"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 6l3 3"
              />
            </svg>
            <span className="text-white text-xs font-medium">Upload photo</span>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
      </div>

      {/* Name */}
      <div className="mb-1">
        {isEditing ? (
          <input
            className="border border-gray-300 rounded px-2 py-1 text-2xl font-bold text-gray-900 outline-none focus:ring-1 focus:ring-indigo-400 w-80 bg-white"
            value={draft.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        ) : (
          <h2 className="text-3xl font-bold text-gray-900">{profile.name}</h2>
        )}
      </div>

      <hr className="border-gray-300 w-105 mb-6 mt-2" />

      {/* Contact Information */}
      <p className="text-xs font-semibold text-gray-500 underline tracking-wide mb-4">
        CONTACT INFORMATION
      </p>

      <div className="flex flex-col gap-3 mb-6">
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-gray-700 w-24">
            Email id:
          </span>
          {isEditing ? (
            <input
              className={inputClass}
              type="email"
              value={draft.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          ) : (
            <span className="text-sm text-indigo-500">{profile.email}</span>
          )}
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-gray-700 w-24">
            Phone:
          </span>
          {isEditing ? (
            <input
              className={inputClass}
              type="tel"
              value={draft.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          ) : (
            <span className="text-sm text-indigo-500">{profile.phone}</span>
          )}
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-gray-700 w-24">
            Address:
          </span>
          {isEditing ? (
            <input
              className={inputClass}
              value={draft.address}
              placeholder="Enter address"
              onChange={(e) => handleChange("address", e.target.value)}
            />
          ) : (
            <span className="text-sm text-gray-700">
              {profile.address || "—"}
            </span>
          )}
        </div>
      </div>

      {/* Basic Information */}
      <p className="text-xs font-semibold text-gray-500 underline tracking-wide mb-4">
        BASIC INFORMATION
      </p>

      <div className="flex flex-col gap-3 mb-10">
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-gray-700 w-24">
            Gender:
          </span>
          {isEditing ? (
            <select
              className={inputClass}
              value={draft.gender}
              onChange={(e) => handleChange("gender", e.target.value)}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          ) : (
            <span className="text-sm text-gray-700">{profile.gender}</span>
          )}
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-gray-700 w-24">
            Birthday:
          </span>
          {isEditing ? (
            <input
              className={inputClass}
              type="date"
              value={draft.birthday}
              onChange={(e) => handleChange("birthday", e.target.value)}
            />
          ) : (
            <span className="text-sm text-gray-700">{profile.birthday}</span>
          )}
        </div>
      </div>

      {/* Edit / Save Buttons */}
      {isEditing ? (
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="px-6 py-2 border border-indigo-500 bg-indigo-500 text-white text-sm rounded-full hover:bg-indigo-600 transition"
          >
            Save information
          </button>
          <button
            onClick={handleCancel}
            className="px-6 py-2 border border-gray-300 text-sm rounded-full hover:bg-gray-50 transition text-gray-600"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={handleEdit}
          className="px-6 py-2 border border-gray-400 text-sm rounded-full hover:bg-gray-50 transition text-gray-700"
        >
          Edit
        </button>
      )}
    </div>
  );
}
