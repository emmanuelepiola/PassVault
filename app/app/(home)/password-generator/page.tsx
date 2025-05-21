'use client'

import React, { useEffect, useState, ChangeEvent, MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { useSelection } from "../context";

type Mode = 'random' | 'custom';

interface PasswordGeneratorProps {}

interface InputEvent extends ChangeEvent<HTMLInputElement> {
  target: HTMLInputElement;
}

interface SelectEvent extends ChangeEvent<HTMLSelectElement> {
  target: HTMLSelectElement;
}

interface ButtonEvent extends MouseEvent<HTMLButtonElement> {
  target: HTMLButtonElement;
}

export default function PasswordGenerator({}: PasswordGeneratorProps) {
  const { selection } = useSelection();
  const router = useRouter();
  const [password, setPassword] = useState<string>("");
  const [length, setLength] = useState<number>(12);

  // Stati per checkbox
  const [includeUppercase, setIncludeUppercase] = useState<boolean>(true);
  const [includeLowercase, setIncludeLowercase] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);

  // Stati per modalità (random/custom) e conteggi
  const [uppercaseMode, setUppercaseMode] = useState<Mode>('random');
  const [lowercaseMode, setLowercaseMode] = useState<Mode>('random');
  const [numbersMode, setNumbersMode] = useState<Mode>('random');
  const [symbolsMode, setSymbolsMode] = useState<Mode>('random');

  const [uppercaseCount, setUppercaseCount] = useState<number>(2);
  const [lowercaseCount, setLowercaseCount] = useState<number>(2);
  const [numbersCount, setNumbersCount] = useState<number>(2);
  const [symbolsCount, setSymbolsCount] = useState<number>(2);

  // Calcola la somma dei caratteri custom richiesti
  const customSum =
    (includeUppercase && uppercaseMode === "custom" ? uppercaseCount : 0) +
    (includeLowercase && lowercaseMode === "custom" ? lowercaseCount : 0) +
    (includeNumbers && numbersMode === "custom" ? numbersCount : 0) +
    (includeSymbols && symbolsMode === "custom" ? symbolsCount : 0);

  const isCustomSumInvalid = customSum > length;

  useEffect(() => {
    if (selection === "Password Generator") {
      router.push("/password-generator");
    } else if (selection === "Settings") {
      router.push("/settings");
    } else {
      router.push("/dashboard");
    }
  }, [selection, router]);

  const generatePassword = async () => {
    const res = await fetch("http://localhost:8000/generatePassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        length,
        uppercase: includeUppercase,
        lowercase: includeLowercase,
        numbers: includeNumbers,
        symbols: includeSymbols,
        uppercaseCount: includeUppercase && uppercaseMode === "custom" ? uppercaseCount : undefined,
        lowercaseCount: includeLowercase && lowercaseMode === "custom" ? lowercaseCount : undefined,
        numbersCount: includeNumbers && numbersMode === "custom" ? numbersCount : undefined,
        symbolsCount: includeSymbols && symbolsMode === "custom" ? symbolsCount : undefined,
      }),
    });
    const data = await res.json();
    setPassword(data.password);
  };

  const handleNumberChange = (e: InputEvent, setter: (value: number) => void) => {
    setter(Number(e.target.value));
  };

  const handleCheckboxChange = (e: InputEvent, setter: (value: boolean) => void) => {
    setter(e.target.checked);
  };

  const handleModeChange = (e: SelectEvent, setter: (value: Mode) => void) => {
    setter(e.target.value as Mode);
  };

  const handleCopyClick = (e: ButtonEvent) => {
    navigator.clipboard.writeText(password);
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center gap-4">
      <div className="flex flex-col gap-2">
        <label>
          Password Length:
          <input
            type="number"
            min={1}
            value={length}
            onChange={(e) => handleNumberChange(e as InputEvent, setLength)}
            className="ml-2 border rounded px-2 py-1"
          />
        </label>
        <div className="flex flex-col gap-2 mt-2">
          {/* Uppercase */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={includeUppercase}
              onChange={(e) => handleCheckboxChange(e as InputEvent, setIncludeUppercase)}
            />
            A-Z
            {includeUppercase && (
              <>
                <select
                  value={uppercaseMode}
                  onChange={(e) => handleModeChange(e as SelectEvent, setUppercaseMode)}
                  className="ml-2 border rounded px-2 py-1"
                >
                  <option value="random">Random</option>
                  <option value="custom">Custom</option>
                </select>
                {uppercaseMode === "custom" && (
                  <input
                    type="number"
                    min={0}
                    max={length}
                    value={uppercaseCount}
                    onChange={(e) => handleNumberChange(e as InputEvent, setUppercaseCount)}
                    className="ml-2 border rounded px-2 py-1 w-20"
                  />
                )}
              </>
            )}
          </label>
          {/* Lowercase */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={includeLowercase}
              onChange={(e) => handleCheckboxChange(e as InputEvent, setIncludeLowercase)}
            />
            a-z
            {includeLowercase && (
              <>
                <select
                  value={lowercaseMode}
                  onChange={(e) => handleModeChange(e as SelectEvent, setLowercaseMode)}
                  className="ml-2 border rounded px-2 py-1"
                >
                  <option value="random">Random</option>
                  <option value="custom">Custom</option>
                </select>
                {lowercaseMode === "custom" && (
                  <input
                    type="number"
                    min={0}
                    max={length}
                    value={lowercaseCount}
                    onChange={(e) => handleNumberChange(e as InputEvent, setLowercaseCount)}
                    className="ml-2 border rounded px-2 py-1 w-20"
                  />
                )}
              </>
            )}
          </label>
          {/* Numbers */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={(e) => handleCheckboxChange(e as InputEvent, setIncludeNumbers)}
            />
            0-9
            {includeNumbers && (
              <>
                <select
                  value={numbersMode}
                  onChange={(e) => handleModeChange(e as SelectEvent, setNumbersMode)}
                  className="ml-2 border rounded px-2 py-1"
                >
                  <option value="random">Random</option>
                  <option value="custom">Custom</option>
                </select>
                {numbersMode === "custom" && (
                  <input
                    type="number"
                    min={0}
                    max={length}
                    value={numbersCount}
                    onChange={(e) => handleNumberChange(e as InputEvent, setNumbersCount)}
                    className="ml-2 border rounded px-2 py-1 w-20"
                  />
                )}
              </>
            )}
          </label>
          {/* Symbols */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={includeSymbols}
              onChange={(e) => handleCheckboxChange(e as InputEvent, setIncludeSymbols)}
            />
            Special Characters <span className="font-mono">!@#$%^&*()-_=+[]&#123;&#125;;:,.&lt;&gt;?</span>
            {includeSymbols && (
              <>
                <select
                  value={symbolsMode}
                  onChange={(e) => handleModeChange(e as SelectEvent, setSymbolsMode)}
                  className="ml-2 border rounded px-2 py-1"
                >
                  <option value="random">Random</option>
                  <option value="custom">Custom</option>
                </select>
                {symbolsMode === "custom" && (
                  <input
                    type="number"
                    min={0}
                    max={length}
                    value={symbolsCount}
                    onChange={(e) => handleNumberChange(e as InputEvent, setSymbolsCount)}
                    className="ml-2 border rounded px-2 py-1 w-20"
                  />
                )}
              </>
            )}
          </label>
        </div>
      </div>
      {isCustomSumInvalid && (
        <div className="text-red-600 font-semibold">
          La somma dei caratteri richiesti supera la lunghezza della password.
        </div>
      )}
      <button
        onClick={generatePassword}
        className="px-4 py-2 bg-blue-600 text-white rounded"
        disabled={isCustomSumInvalid}
      >
        Generate Password
      </button>
      {password && (
        <div className="mt-4 flex flex-col items-center gap-2">
          <div className="text-lg font-mono">
            Generated Password: {password}
          </div>
          <button
            onClick={handleCopyClick}
            className="px-3 py-1 bg-green-600 text-white rounded"
          >
            Copy Password
          </button>
        </div>
      )}
    </div>
  );
}