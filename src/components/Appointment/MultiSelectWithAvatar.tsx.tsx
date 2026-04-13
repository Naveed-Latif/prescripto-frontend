import { useMemo } from "react";
import Select, { components } from "react-select";
import type { MultiValueProps, OptionProps, StylesConfig } from "react-select";
import Avatar from "../Avatar";

export type AvatarOption = {
  value: number;
  label: string;
  color: string | null;
  image?: string | null;
};

interface MultiSelectWithAvatarProps {
  label: string;
  options: AvatarOption[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
  placeholder?: string;
  styles?: StylesConfig<AvatarOption, true>;
}

/* ── Custom Option ───────────────────────────────── */
const CustomOption = (props: OptionProps<AvatarOption, true>) => {
  const { label, color, image } = props.data;
  return (
    <components.Option {...props}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 shrink-0">
            <Avatar name={label} color={color ?? "#888"} image={image} size="sm" />
          </div>
          <span>{label}</span>
        </div>
        <CheckboxIndicator checked={props.isSelected} />
      </div>
    </components.Option>
  );
};

/* ── Custom MultiValue ───────────────────────────── */
const CustomMultiValue = (props: MultiValueProps<AvatarOption, true>) => {
  const { color, image, label } = props.data;
  return (
    <components.MultiValue {...props}>
      <div className="flex items-center gap-1">
        <Avatar name={label} color={color ?? "#888"} image={image} size="xs" />
        <span>{label}</span>
      </div>
    </components.MultiValue>
  );
};

/* ── Checkbox ────────────────────────────────────── */
const CheckboxIndicator = ({ checked }: { checked: boolean }) => (
  <div
    className={`w-4 h-4 rounded-[3px] border-[1.5px] flex items-center justify-center shrink-0 ${
      checked ? "border-indigo-500 bg-indigo-500" : "border-gray-300 bg-transparent"
    }`}
  >
    {checked && (
      <div className="w-[9px] h-[6px] border-l-2 border-b-2 border-white -rotate-45 translate-x-px -translate-y-px" />
    )}
  </div>
);

/* ── Main Component ──────────────────────────────── */
const MultiSelectWithAvatar = ({
  label,
  options,
  selectedIds,
  onChange,
  placeholder = "Select...",
  styles,
}: MultiSelectWithAvatarProps) => {
  const value = useMemo(
    () => options.filter((o) => selectedIds.includes(o.value)),
    [options, selectedIds]
  );

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <Select<AvatarOption, true>
        isMulti
        options={options}
        value={value}
        onChange={(selected) => onChange(selected ? selected.map((s) => s.value) : [])}
        components={{ Option: CustomOption, MultiValue: CustomMultiValue }}
        hideSelectedOptions={false}
        closeMenuOnSelect={false}
        placeholder={placeholder}
        styles={styles}
      />
    </div>
  );
};

export default MultiSelectWithAvatar;