import { useState, useRef, useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

type Profile = {
  name: string;
  gender: string;
  dateOfBirth: string | null;
  profileImage: string | null;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  country: string;
};

export default function MyProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageFileRef = useRef<File | null>(null);
  const { userData, setUserData, token, backendurl } = useContext(AppContext);

  // Helper: pull first address from userData
  const firstAddr = userData?.addresses?.[0];

  const buildDraft = (): Profile => ({
    name: userData?.name ?? "",
    gender: userData?.gender ?? "",
    dateOfBirth:
      userData?.dateOfBirth && /^\d{4}/.test(userData.dateOfBirth)
        ? userData.dateOfBirth.slice(0, 10)
        : null,
    profileImage: userData?.profileImage ?? null,
    phone: userData?.phone ?? "",
    addressLine1: firstAddr?.line1 ?? "",
    addressLine2: firstAddr?.line2 ?? "",
    city: firstAddr?.city ?? "",
    country: firstAddr?.country ?? "",
  });

  const [draft, setDraft] = useState<Profile>(buildDraft);

  const UploadUserData = async (current: Profile) => {
    try {
      const formData = new FormData();
      formData.append("name", current.name);
      formData.append("gender", current.gender);
      formData.append("dateOfBirth", current.dateOfBirth ?? "");
      if (imageFileRef.current) {
        formData.append("profileImage", imageFileRef.current);
      }

      // Phone
      formData.append("phone", current.phone);

      // Addresses — same shape as CreateAccount
      const addresses = [
        {
          line1: current.addressLine1,
          ...(current.addressLine2 ? { line2: current.addressLine2 } : {}),
          city: current.city,
          country: current.country,
        },
      ];
      formData.append("addresses", JSON.stringify(addresses));

      const response = await axios.post(
        `${backendurl}/update-profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.data.status == 200) {
        const user = response.data.user;
        if (typeof user.addresses === "string") {
          try {
            user.addresses = JSON.parse(user.addresses);
          } catch {
            user.addresses = [];
          }
        }
        setUserData(user);
        toast.success("User data updated successfully");
      } else {
        toast.error("Failed to update user data");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error:", error.message);
      } else {
        console.error("Error:", String(error));
      }
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleEdit = () => {
    setDraft(buildDraft());
    setIsEditing(true);
  };

  const handleSave = () => {
    setUserData((prev) => (prev ? { ...prev, ...draft } : prev));
    setIsEditing(false);
    UploadUserData(draft);
  };

  const handleCancel = () => {
    setDraft(buildDraft());
    setIsEditing(false);
  };

  const handleChange = (field: keyof Profile, value: string | null) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    imageFileRef.current = file;
    const reader = new FileReader();
    reader.onload = () => {
      handleChange("profileImage", reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const inputClass =
    "border border-gray-300 rounded px-2 py-1 text-sm text-gray-700 outline-none focus:ring-1 focus:ring-indigo-400 w-64 bg-white";

  const currentAvatar = isEditing ? draft.profileImage : userData?.profileImage;

  // Formatted address for view mode
  const addressParts = [
    firstAddr?.line1,
    firstAddr?.line2,
    firstAddr?.city,
    firstAddr?.country,
  ].filter(Boolean);
  const addressDisplay =
    addressParts.length > 0 ? addressParts.join(", ") : "—";

  return (
    userData && (
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

          {isEditing && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex flex-col items-center justify-center cursor-pointer transition"
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
              <span className="text-white text-xs font-medium">
                Upload photo
              </span>
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
            <h2 className="text-3xl font-bold text-gray-900">
              {userData?.name}
            </h2>
          )}
        </div>

        <hr className="border-gray-300 w-105 mb-6 mt-2" />

        {/* ── CONTACT INFORMATION ── */}
        <p className="text-xs font-semibold text-gray-500 underline tracking-wide mb-4">
          CONTACT INFORMATION
        </p>

        <div className="flex flex-col gap-3 mb-6">
          {/* Email (read-only always) */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-gray-700 w-28">
              Email id:
            </span>
            <span className="text-sm text-indigo-500">{userData?.email}</span>
          </div>

          {/* Phone */}
          <div className="flex items-start gap-4">
            <span className="text-sm font-semibold text-gray-700 w-28 pt-1">
              Phone:
            </span>
            {isEditing ? (
              <PhoneInput
                country={"pk"}
                value={draft.phone.replace(/^\+/, "")}
                onChange={(value) => handleChange("phone", "+" + value)}
                masks={{ pk: "(...) ...-....", default: "(...) ...-...." }}
                inputStyle={{
                  width: "256px",
                  height: "34px",
                  fontSize: "14px",
                  backgroundColor: "#fff",
                  border: "1px solid #d1d5db",
                  borderRadius: "4px",
                  color: "#374151",
                }}
                buttonStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #d1d5db",
                  borderRadius: "4px 0 0 4px",
                }}
                placeholder="(300) 123-4567"
              />
            ) : (
              <span className="text-sm text-gray-700">
                {userData?.phone || "—"}
              </span>
            )}
          </div>

          {/* Address */}
          <div className="flex items-start gap-4">
            <span className="text-sm font-semibold text-gray-700 w-28 pt-1">
              Address:
            </span>
            {isEditing ? (
              <div className="flex flex-col gap-2">
                <input
                  className={inputClass}
                  placeholder="Address Line 1"
                  value={draft.addressLine1}
                  onChange={(e) => handleChange("addressLine1", e.target.value)}
                />
                <input
                  className={inputClass}
                  placeholder="Address Line 2 (optional)"
                  value={draft.addressLine2}
                  onChange={(e) => handleChange("addressLine2", e.target.value)}
                />
                <div className="flex gap-2">
                  <input
                    className="border border-gray-300 rounded px-2 py-1 text-sm text-gray-700 outline-none focus:ring-1 focus:ring-indigo-400 w-[124px] bg-white"
                    placeholder="City"
                    value={draft.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                  />
                  <input
                    className="border border-gray-300 rounded px-2 py-1 text-sm text-gray-700 outline-none focus:ring-1 focus:ring-indigo-400 w-[124px] bg-white"
                    placeholder="Country"
                    value={draft.country}
                    onChange={(e) => handleChange("country", e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <span className="text-sm text-gray-700">{addressDisplay}</span>
            )}
          </div>
        </div>

        {/* ── BASIC INFORMATION ── */}
        <p className="text-xs font-semibold text-gray-500 underline tracking-wide mb-4">
          BASIC INFORMATION
        </p>

        <div className="flex flex-col gap-3 mb-10">
          {/* Gender */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-gray-700 w-28">
              Gender:
            </span>
            {isEditing ? (
              <select
                className={inputClass}
                value={draft.gender}
                onChange={(e) => handleChange("gender", e.target.value)}
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            ) : (
              <span className="text-sm text-gray-700">{userData?.gender}</span>
            )}
          </div>

          {/* Birthday */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-gray-700 w-28">
              Birthday:
            </span>
            {isEditing ? (
              <input
                className={inputClass}
                type="date"
                value={draft.dateOfBirth ?? ""}
                onChange={(e) => handleChange("dateOfBirth", e.target.value)}
              />
            ) : (
              <span className="text-sm text-gray-700">
                {userData?.dateOfBirth
                  ? new Date(userData.dateOfBirth).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "—"}
              </span>
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
    )
  );
}
