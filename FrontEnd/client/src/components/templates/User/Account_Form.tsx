"use client";
import { useEffect, useState, useRef } from "react";
import handleAPI from "@/axios/handleAPI";
import { useDispatch, useSelector } from "react-redux";
import { authSelector, updateAuthName, UserAuth } from "@/redux/reducers/authReducer";
import { toast } from "sonner";

interface UserProfile {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
}

export default function AccountForm() {
  const dispatch = useDispatch();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    displayName: "",
    email: "",
  });
  // State cho form password
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // State quản lý trạng thái UI
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false); // Trạng thái sửa profile
  const [showPasswordFields, setShowPasswordFields] = useState(false); // Trạng thái sửa password

  // State & Ref cho avatar
  const auth: UserAuth = useSelector(authSelector);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch profile khi component mount hoặc token thay đổi
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      setError(null);
      if (!auth.token) {
        setError("Vui lòng đăng nhập để xem thông tin.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await handleAPI("/User/profile", undefined, "get");
        console.log("API Response (đã là userProfile):", response);

        if (response) {
          const profileData = response as unknown as UserProfile;
          setProfile(profileData); // Lưu profile gốc

          // Cập nhật formData ban đầu
          setFormData({
            firstName: profileData.firstName || "",
            lastName: profileData.lastName || "",
            displayName: `${profileData.firstName || ""} ${profileData.lastName || ""
              }`.trim(),
            email: profileData.email || "",
          });

          setPreview(profileData.avatarUrl); // Cập nhật ảnh preview
        } else {
          setError("Không nhận được dữ liệu người dùng hợp lệ từ server.");
          toast.error("Lỗi dữ liệu trả về.");
        }
      } catch (err: any) {
        console.error("Lỗi fetch profile:", err);
        setError(
          err.response?.data?.message ||
          err.message ||
          "Lỗi không xác định khi tải thông tin."
        );
        toast.error("Không thể tải thông tin tài khoản.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [auth.token]);

  // Handler cho input profile
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handler cho input password
  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  // Handler cho file avatar
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    }
  };

  // Handler upload avatar (ví dụ)
  const handleAvatarUpload = async (fileToUpload: File) => {
    if (!fileToUpload) return;
    const uploadData = new FormData();
    uploadData.append("file", fileToUpload);

    try {
      toast.loading("Đang tải ảnh lên...");
      // Giả sử API trả về { avatarUrl: "new_url" }
      const response = await handleAPI("/User/avatar", uploadData, "post");
      setSelectedFile(null); // Reset file đã chọn
      toast.dismiss();
      toast.success("Cập nhật ảnh đại diện thành công!");
    } catch (error: any) {
      toast.dismiss();
      console.error("Lỗi upload avatar:", error);
      toast.error(error.response?.data?.message || "Tải ảnh lên thất bại.");
    }
  };

  // Handler submit thông tin profile
  const handleSubmitInfo = async () => {
    try {
      toast.loading("Đang cập nhật thông tin...");
      const updateDto = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        fullName: `${formData.firstName} ${formData.lastName}`.trim(),
      };
      await handleAPI("/User/profile", updateDto, "put");
      toast.dismiss();
      toast.success("Cập nhật thông tin thành công!");
      setIsEditingProfile(false); 
      setProfile(prev => prev ? { ...prev, firstName: formData.firstName, lastName: formData.lastName } : null);
      const newDisplayName = `${formData.firstName} ${formData.lastName}`.trim();
      dispatch(updateAuthName({ name: newDisplayName }));
    } catch (error: any) {
      toast.dismiss();
      console.error("Lỗi cập nhật profile:", error);
      if (error.response && error.response.status === 400) {
        console.error("Validation Errors:", error.response.data.errors || error.response.data);
        const errorMessages = Object.values(error.response.data.errors || {}).flat().join('\n');
        toast.error(`Validation failed:\n${errorMessages || error.response.data.title || 'Please check your input.'}`);
      } else {
        toast.error(error.response?.data?.message || "Cập nhật thông tin thất bại.");
      }
    }
  };

  // Handler submit mật khẩu
  const handleSubmitPassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New password and confirmation do not match.");
      return;
    }
    if (!passwordData.oldPassword || !passwordData.newPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }

    try {
      toast.loading("Changing password...");
      await handleAPI("/User/change-password", { 
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      }, "put");

      toast.dismiss();
      toast.success("Password changed successfully!");
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setShowPasswordFields(false); 

    } catch (error: any) {
      toast.dismiss();
      console.error("Error changing password:", error);
      toast.error(error.response?.data?.message || "Failed to change password.");

    }
  };

  const handleCancelProfileEdit = () => {
    if (profile) {
      setFormData({ // Reset về giá trị gốc
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        displayName: `${profile.firstName || ""} ${profile.lastName || ""}`.trim(),
        email: profile.email || "",
      });
    }
    setIsEditingProfile(false); // Tắt chế độ edit
  };

  const handleCancelPasswordChange = () => {
    setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" }); // Xóa input
    setShowPasswordFields(false); // Ẩn field
  };


  if (isLoading) {
    return (
      <div className="p-6 text-center">Đang tải thông tin tài khoản...</div>
    );
  }
  if (error) {
    return <div className="p-6 text-red-600 text-center">Lỗi: {error}</div>;
  }
  if (!profile) {
    return <div className="p-6 text-center">Không có thông tin tài khoản.</div>;
  }

  // --- Render Form ---
  return (
    <div>
      <div className="flex items-center mb-6">
        <img
          src="https://res.cloudinary.com/do0im8hgv/image/upload/v1757949078/image_1_gmpnkd.png"
          alt=""
          className="w-[43px] h-[43px] mr-3"
        />
        <h2 className="text-xl font-semibold text-[25px]">Account Details</h2>
      </div>

      {/* Bỏ onSubmit khỏi form */}
      <form className="grid grid-cols-1 gap-y-6 w-full font-sans-serif text-[15px]">

        {/* First Name */}
        <div className="w-full">
          <label className="block font-medium mb-1 text-[#6C7275]">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className={`w-full border border-[#CBCBCB] rounded-md p-2 ${!isEditingProfile ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            placeholder="Sofia"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            readOnly={!isEditingProfile}
          />
        </div>

        {/* Last Name */}
        <div className="w-full">
          <label className="block font-medium mb-1 text-[#6C7275]">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className={`w-full border border-[#CBCBCB] rounded-md p-2 ${!isEditingProfile ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            placeholder="Havertz"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            readOnly={!isEditingProfile}
          />
        </div>

        {/* Display Name */}
        <div className="w-full">
          <label className="block font-medium mb-1 text-[#6C7275]">
            Display Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className={`w-full border border-[#CBCBCB] rounded-md p-2 ${!isEditingProfile ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            placeholder="Sofia"
            name="displayName"
            value={formData.displayName}
            onChange={handleInputChange}
            readOnly={!isEditingProfile}
          />
          <p className="text-xs text-gray-500 mt-1">
            This will be how your name will be displayed in the account section
            and in reviews
          </p>
        </div>

        {/* Email (Luôn readOnly) */}
        <div className="w-full">
          <label className="block font-medium mb-1 text-[#6C7275]">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            className="w-full border border-[#CBCBCB] rounded-md p-2 bg-gray-100 cursor-not-allowed"
            placeholder="sofiahavertz@gmail.com"
            name="email"
            value={formData.email}
            readOnly
          />
        </div>

        {/* Nút điều khiển Profile */}
        <div className="flex items-center gap-4 mt-2">
          <button
            type="button"
            onClick={() => {
              if (isEditingProfile) {
                handleSubmitInfo();
              } else {
                setIsEditingProfile(true);
              }
            }}
            className={`relative inline-block px-6 py-2 font-semibold text-white ${isEditingProfile ? 'bg-green-600' : 'bg-black'} rounded-md overflow-hidden group`}
          >
            <span className={`absolute inset-0 ${isEditingProfile ? 'bg-green-700' : 'bg-gray-800'} transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out`}></span>
            <span className="relative z-10">
              {isEditingProfile ? "Save Profile Changes" : "Edit Profile"}
            </span>
          </button>

          {isEditingProfile && (
            <button
              type="button"
              onClick={handleCancelProfileEdit}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
          )}
        </div>


        {/* Password Section */}
        <div className="w-full border-t pt-4 mt-6">
          <div className="flex items-center justify-between mb-4"> {/* Giữ mb-4 để có khoảng cách */}
            <h2 className="text-xl font-semibold text-[25px]">Password</h2>
            <div className="flex items-center gap-4">
              {/* Nút điều khiển Password */}
              <button
                type="button"
                onClick={() => {
                  if (showPasswordFields) {
                    handleSubmitPassword();
                  } else {
                    setShowPasswordFields(true);
                  }
                }}
                className={`relative inline-block px-6 py-2 font-semibold text-white ${showPasswordFields ? 'bg-green-600' : 'bg-blue-600'} rounded-md overflow-hidden group text-sm`}
              >
                <span className={`absolute inset-0 ${showPasswordFields ? 'bg-green-700' : 'bg-[#29c9d7]'} transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out`}></span>
                <span className="relative z-10">
                  {showPasswordFields ? "Save Password Changes" : "Change Password"}
                </span>
              </button>

              {/* Nút Cancel Password */}
              {showPasswordFields && (
                <button
                  type="button"
                  onClick={handleCancelPasswordChange}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* === BỌC KHỐI INPUT BẰNG ĐIỀU KIỆN NÀY === */}
          {showPasswordFields && (
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block font-medium mb-1 text-[#6C7275]">
                  Old Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="oldPassword"
                  // Bỏ class điều kiện disabled vì div cha đã ẩn/hiện
                  className="w-full border border-[#CBCBCB] rounded-md p-2"
                  placeholder="Enter old password"
                  value={passwordData.oldPassword}
                  onChange={handlePasswordInputChange}
                // Bỏ disabled vì div cha đã ẩn/hiện
                />
              </div>
              <div>
                <label className="block font-medium mb-1 text-[#6C7275]">
                  New Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="newPassword"
                  className="w-full border border-[#CBCBCB] rounded-md p-2"
                  placeholder="Enter new password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordInputChange}
                />
              </div>
              <div>
                <label className="block font-medium mb-1 text-[#6C7275]">
                  Repeat New Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="w-full border border-[#CBCBCB] rounded-md p-2"
                  placeholder="Repeat new password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordInputChange}
                />
              </div>
            </div>
          )}
          {/* === KẾT THÚC BỌC ĐIỀU KIỆN === */}

        </div>
        {/* === KẾT THÚC PHẦN PASSWORD === */}

      </form>
    </div>
  );
}