"use client";

const avatarUrl =
  process.env.NEXT_PUBLIC_AVATAR_URL ??
  "http://127.0.0.1:8087/Image?Name=Avatars";
const avatarMax = Number(process.env.NEXT_PUBLIC_AVATAR_MAX ?? 64);
const avatarSize = Number(process.env.NEXT_PUBLIC_AVATAR_SIZE ?? 32);

type AvatarPickerProps = {
  value: string;
  onChange: (value: string) => void;
};

export function AvatarPicker({ value, onChange }: AvatarPickerProps) {
  return (
    <div
      className="h-[175px] w-[100px] overflow-auto border-2 border-gray-400 bg-white"
      role="radiogroup"
      aria-label="Select avatar"
    >
      {Array.from({ length: avatarMax }, (_, i) => {
        const avatarValue = String(i + 1);
        const id = `avatar-${avatarValue}`;

        return (
          <label
            key={avatarValue}
            htmlFor={id}
            className="flex cursor-pointer items-center gap-1 px-1 py-2 hover:bg-gray-50"
          >
            <input
              type="radio"
              id={id}
              name="Avatar"
              value={avatarValue}
              checked={value === avatarValue}
              onChange={() => onChange(avatarValue)}
              className="shrink-0"
            />
            <span
              className="inline-block shrink-0"
              style={{
                width: avatarSize,
                height: avatarSize,
                background: `url('${avatarUrl}') no-repeat -${i * avatarSize}px 0px`,
              }}
              aria-hidden
            />
          </label>
        );
      })}
    </div>
  );
}
