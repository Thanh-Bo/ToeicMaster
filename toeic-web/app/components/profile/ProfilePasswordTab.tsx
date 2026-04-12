import { useState } from "react";
import { authService } from "../../services/authService";
import { Check, X, Loader2, Eye, EyeOff } from "lucide-react";

export default function ProfilePasswordTab() {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [changingPassword, setChangingPassword] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleChangePassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordForm;
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage({ type: "error", text: "Vui lòng điền đầy đủ thông tin" });
      return;
    }
    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "Mật khẩu mới phải có ít nhất 6 ký tự" });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Mật khẩu xác nhận không khớp" });
      return;
    }
    setChangingPassword(true);
    setMessage(null);
    try {
      await authService.changePassword({ currentPassword, newPassword });
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setMessage({ type: "success", text: "Đổi mật khẩu thành công!" });
    } catch (error: any) {
      setMessage({ type: "error", text: error.response?.data?.message || "Đổi mật khẩu thất bại" });
    } finally {
      setChangingPassword(false);
    }
  };

  const inputClass = "w-full px-4 py-3 border border-gray-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white rounded-xl focus:border-gray-400 dark:focus:border-zinc-500 focus:ring-0 outline-none transition placeholder-gray-400 dark:placeholder-gray-500";

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Đổi mật khẩu</h3>

      {/* Alert */}
      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 border text-sm ${
          message.type === "success"
            ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300"
            : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300"
        }`}>
          {message.type === "success" ? <Check className="w-4 h-4 flex-shrink-0" /> : <X className="w-4 h-4 flex-shrink-0" />}
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="ml-auto">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">Mật khẩu hiện tại</label>
          <div className="relative">
            <input
              type={showPasswords.current ? "text" : "password"}
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              className={inputClass}
              placeholder="Nhập mật khẩu hiện tại"
            />
            <button
              type="button"
              onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition"
            >
              {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">Mật khẩu mới</label>
          <div className="relative">
            <input
              type={showPasswords.new ? "text" : "password"}
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              className={inputClass}
              placeholder="Tối thiểu 6 ký tự"
            />
            {passwordForm.newPassword && (
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition"
              >
                {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">Xác nhận mật khẩu mới</label>
          <div className="relative">
            <input
              type={showPasswords.confirm ? "text" : "password"}
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              className={inputClass}
              placeholder="Nhập lại mật khẩu mới"
            />
            {passwordForm.confirmPassword && (
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition"
              >
                {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={handleChangePassword}
        disabled={changingPassword}
        className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-medium hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {changingPassword ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Đang xử lý...</>
        ) : (
          "Đổi mật khẩu"
        )}
      </button>
    </div>
  );
}
