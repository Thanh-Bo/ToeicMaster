"use client";

interface Props {
  /** Tên part (vd: "Part 1: Photographs") */
  name: string;
  /** Số part (1-7) */
  partNumber?: number;
}

export default function PartHeader({ name, partNumber }: Props) {
  // Tự động detect part number từ tên nếu không truyền vào
  const detectPartNumber = (): number => {
    if (partNumber) return partNumber;
    const match = name.match(/part\s*(\d)/i);
    return match ? parseInt(match[1]) : 0;
  };

  const partNum = detectPartNumber();
  const isListening = partNum >= 1 && partNum <= 4;
  const isReading = partNum >= 5 && partNum <= 7;

  return (
    <div className="flex items-center gap-4 mb-6">
      <h2 className="text-2xl font-bold text-gray-800">{name}</h2>
      <div className="h-1 flex-1 bg-gray-200 rounded-full"></div>
      {isListening && (
        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
          🎧 Listening
        </span>
      )}
      {isReading && (
        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold">
          📖 Reading
        </span>
      )}
    </div>
  );
}
