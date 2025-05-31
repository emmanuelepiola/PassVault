import { useEffect, useState } from "react";
import { Copy, RefreshCw, Check } from "lucide-react";

export default function PasswordGeneratorBox() {
    const [passwordLength, setPasswordLength] = useState(12);
    const [includeUppercase, setIncludeUppercase] = useState(true);
    const [includeNumbers, setIncludeNumbers] = useState(true);
    const [includeSymbols, setIncludeSymbols] = useState(true);
    const [generatedPassword, setGeneratedPassword] = useState("");
    const [copied, setCopied] = useState(false); 

    function generatePassword(
        length: number,
        uppercase: boolean,
        numbers: boolean,
        symbols: boolean
    ): string {
        const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
        const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const numberChars = "0123456789";
        const symbolChars = "@!$%&*";

        let characterPool = lowercaseChars;
        if (uppercase) characterPool += uppercaseChars;
        if (numbers) characterPool += numberChars;
        if (symbols) characterPool += symbolChars;

        if (characterPool.length === 0) return "";

        let password = "";
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characterPool.length);
            password += characterPool[randomIndex];
        }

        return password;
    }

    const regeneratePassword = () => {
        const newPassword = generatePassword(passwordLength, includeUppercase, includeNumbers, includeSymbols);
        setGeneratedPassword(newPassword);
    };

    const copyToClipboard = async () => {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(generatedPassword);
            } else {
                const textarea = document.createElement("textarea");
                textarea.value = generatedPassword;
                textarea.style.position = "fixed"; 
                textarea.style.left = "-9999px"; 
                document.body.appendChild(textarea);
                textarea.focus();
                textarea.select();
                document.execCommand("copy");
                document.body.removeChild(textarea);
            }
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Copy failed", err);
        }
    };

    useEffect(() => {
        regeneratePassword();
    }, [passwordLength, includeUppercase, includeNumbers, includeSymbols]);

    return (
        <div className="w-full flex flex-col gap-6">
            <div className="w-full py-4 pl-4 pr-20 border-gray-200 border-[0.5px] bg-gray-100 text-center text-lg font-mono break-all relative">
                <div className="absolute right-5 md:top-5 md:right-30 flex gap-2">
                    <button
                        onClick={copyToClipboard}
                        className="p-1 rounded-full hover:bg-gray-200"
                        title="Copy"
                    >
                        {copied ? <Check size={16} className="text-green-600" /> : <Copy size={18} />}
                    </button>
                    <button
                        onClick={regeneratePassword}
                        className="p-1 rounded-full hover:bg-gray-200"
                        title="Regenerate"
                    >
                        <RefreshCw size={16} />
                    </button>
                </div>
                {generatedPassword}
            </div>

            <div className="flex items-center pl-8 pr-5 md:pl-[10%] md:pr-[8%] px-5 border-gray-200 border-b-1 pb-5">
                <label htmlFor="length-slider" className="text-sm bg-white font-medium text-gray-700">
                    Length
                </label>
                <div className="w-full flex items-center justify-end">
                    <input
                        id="length-slider"
                        type="range"
                        min={4}
                        max={32}
                        value={passwordLength}
                        onChange={(e) => setPasswordLength(Number(e.target.value))}
                        className="w-50 md:w-[80%] h-2  border-gray-200 border-[0.5px] [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:md:h-4 [&::-webkit-slider-thumb]:md:w-4 [&::-webkit-slider-thumb]:bg-blue-200 [&::-webkit-slider-thumb]:hover:bg-blue-300 [&::-webkit-slider-thumb]:border-[0.5px] [&::-webkit-slider-thumb]:border-gray-300 [&::-webkit-slider-thumb]:cursor-pointer bg-gray-100 rounded-3xl appearance-none accent-blue-100 transition-all duration-200"
                    />
                    <span className="ml-4 w-10 text-sm text-black">{passwordLength}</span>
                </div>
            </div>

            <div className="flex w-full flex-col gap-3 text-sm text-gray-700">
                <div className="flex w-full items-center justify-between border-b-1 border-gray-200 pb-5 px-8 md:px-[10%]">
                    <span>Include Uppercase Letters (A-Z)</span>
                    <button
                        onClick={() => setIncludeUppercase(!includeUppercase)}
                        className={`px-4 py-1 rounded-full text-sm font-medium border ${
                            includeUppercase
                                ? "bg-blue-300 ease-in-out duration-200 text-gray-700 border-blue d-300"
                                : "bg-blue-100 ease-in-out duration-200 text-gray-700 border-blue d-300"
                        }`}
                    >
                        {includeUppercase ? "On" : "Off"}
                    </button>
                </div>
                <div className="flex w-full items-center justify-between border-b-1 border-gray-200 pb-5 px-8 md:px-[10%]">
                    <span>Include Numbers (from 0 to 9)</span>
                    <button
                        onClick={() => setIncludeNumbers(!includeNumbers)}
                        className={`px-4 py-1 rounded-full text-sm font-medium border ${
                            includeNumbers
                                ? "bg-blue-300 ease-in-out duration-200 text-gray-700 border-blue d-300"
                                : "bg-blue-100 ease-in-out duration-200 text-gray-700 border-gray-300"
                        }`}
                    >
                        {includeNumbers ? "On" : "Off"}
                    </button>
                </div>
                <div className="flex w-full items-center justify-between border-b-1 border-gray-200 pb-5 px-8 md:px-[10%]">
                    <span>Include Symbols (@!$%&) </span>
                    <button
                        onClick={() => setIncludeSymbols(!includeSymbols)}
                        className={`px-4 py-1 rounded-full text-sm font-medium border ${
                            includeSymbols
                                ? "bg-blue-300 ease-in-out duration-200 text-gray-700 border-blue d-300"
                                : "bg-blue-100 ease-in-out duration-200 text-gray-700 border-blue d-300"
                        }`}
                    >
                        {includeSymbols ? "On" : "Off"}
                    </button>
                </div>
            </div>
        </div>
    );
}

