import { useState, useEffect } from "react";
import { useSelection } from "../../context";
import { useRouter } from "next/navigation";

export default function PasswordGeneratorBox() {
  const { account, password, changePassword } = useSelection();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [visible, setVisible] = useState(false);

  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [repeatPass, setRepeatPass] = useState("");

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showRepeat, setShowRepeat] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (isModalOpen) setShouldRender(true);
  }, [isModalOpen]);

  useEffect(() => {
    if (shouldRender) {
      const enter = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(enter);
    }
  }, [shouldRender]);

  useEffect(() => {
    if (!isModalOpen && shouldRender) {
      setVisible(false);
      const timeout = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isModalOpen]);

  const handlePasswordChange = async () => {
    const result = await changePassword(oldPass, newPass, repeatPass);
    if (result.success) {
      closeModal();
    } else {
      alert(result.error);
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    router.push("/login");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setOldPass("");
    setNewPass("");
    setRepeatPass("");
    setShowOld(false);
    setShowNew(false);
    setShowRepeat(false);
  };

  return (
    <div className="w-full flex flex-col gap-5">
      <div className="w-full py-4 pl-4 pr-20 border-gray-200 border-[0.5px] bg-gray-100 text-center text-lg font-mono break-all relative">
        {/* Placeholder */}
      </div>

      <div className="flex w-full flex-col gap-3 text-sm text-gray-700">
        <div className="flex w-full items-center justify-between border-b border-gray-200 pb-5 px-8 md:px-[10%]">
          <span className="text-gray-500 font-medium">User</span>
          <span className="font-semibold">{account}</span>
        </div>

        <div className="flex w-full items-center justify-between border-b border-gray-200 pb-5 px-8 md:px-[10%]">
          <span className="text-gray-500 font-medium">Password</span>
          <input
            type="password"
            value={password}
            readOnly
            className="bg-transparent border-none outline-none font-semibold w-[180px] select-all text-right"
            style={{ letterSpacing: "2px" }}
          />
        </div>

        <div className="flex w-full justify-end gap-2 border-b border-gray-200 pb-4 px-8 md:px-[10%]">
          <button
            className="rounded bg-blue-100 text-gray-700 px-3 py-1 text-sm hover:bg-blue-200 transition"
            onClick={() => setIsModalOpen(true)}
          >
            Edit Password
          </button>
          <button
            className="rounded bg-blue-100 text-gray-700 px-3 py-1 text-sm hover:bg-blue-200 transition"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {shouldRender && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30 px-4">
          <div
            className={`bg-white rounded-lg shadow-lg relative p-6
              transform transition-all duration-300 ease-in-out
              ${visible ? "opacity-100 scale-100" : "opacity-0 scale-95"}
              max-w-md w-full max-h-[90vh] overflow-auto`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Edit Password</h2>
            </div>

            <div className="flex flex-col gap-3">
              {/* Old Password */}
              <div className="relative">
                <input
                  type={showOld ? "text" : "password"}
                  value={oldPass}
                  onChange={(e) => setOldPass(e.target.value)}
                  placeholder="Old password"
                  className="border border-gray-300 rounded px-3 py-2 pr-10 w-full focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowOld((v) => !v)}
                  className="absolute right-2 top-2.5 text-gray-600 hover:text-gray-900"
                  aria-label={showOld ? "Nascondi password" : "Mostra password"}
                >
                  <span className="material-symbols-outlined text-base">
                    {showOld ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>

              {/* New Password */}
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="New password"
                  className="border border-gray-300 rounded px-3 py-2 pr-10 w-full focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowNew((v) => !v)}
                  className="absolute right-2 top-2.5 text-gray-600 hover:text-gray-900"
                  aria-label={showNew ? "Nascondi password" : "Mostra password"}
                >
                  <span className="material-symbols-outlined text-base">
                    {showNew ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>

              {/* Repeat Password */}
              <div className="relative">
                <input
                  type={showRepeat ? "text" : "password"}
                  value={repeatPass}
                  onChange={(e) => setRepeatPass(e.target.value)}
                  placeholder="Repeat new password"
                  className="border border-gray-300 rounded px-3 py-2 pr-10 w-full focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowRepeat((v) => !v)}
                  className="absolute right-2 top-2.5 text-gray-600 hover:text-gray-900"
                  aria-label={showRepeat ? "Nascondi password" : "Mostra password"}
                >
                  <span className="material-symbols-outlined text-base">
                    {showRepeat ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  onClick={closeModal}
                  className="px-3 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordChange}
                  className="px-3 py-1 text-sm rounded bg-blue-100 text-gray-700 hover:bg-blue-200 transition"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
