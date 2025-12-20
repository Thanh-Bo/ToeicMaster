"use client";

interface Props {
  /** URL audio */
  src: string;
  /** Tiêu đề hiển thị */
  title?: string;
  /** Có dính (sticky) không */
  sticky?: boolean;
  /** Vị trí top khi sticky */
  stickyTop?: string;
}

export default function AudioPlayer({
  src,
  title = "Audio",
  sticky = false,
  stickyTop = "top-20",
}: Props) {
  return (
    <div className={`${sticky ? `sticky ${stickyTop} z-40` : ""} mb-6`}>
      <div className="bg-linear-to-r from-green-600 to-teal-600 text-white p-4 rounded-2xl shadow-lg">
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div className="bg-white/20 p-2.5 rounded-full shrink-0">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
              />
            </svg>
          </div>

          {/* Title */}
          <span className="font-medium text-sm shrink-0">{title}</span>

          {/* Audio Element */}
          <audio
            controls
            src={src}
            className="flex-1 h-10"
            style={{ filter: "invert(1) brightness(1.2)" }}
          />
        </div>
      </div>
    </div>
  );
}
