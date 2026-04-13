import type { MultiValueProps, OptionProps } from "react-select";
import { components } from "react-select";
import Avatar from "../Avatar";

export type DoctorOption = {
  value: number;
  label: string;
  color: string | null;
  image?: string | null;
};

/* ── Custom Option (dropdown row) ───────────────────────────────── */
export const CustomOption = (props: OptionProps<DoctorOption, true>) => {
  const { label, color, image } = props.data;

  return (
    <components.Option {...props}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 shrink-0">
            <Avatar
              name={label}
              color={color ?? "#888"}
              image={image}
              size="sm"
            />
          </div>
          <span>{label}</span>
        </div>

        <CheckboxIndicator checked={props.isSelected} />
      </div>
    </components.Option>
  );
};

/* ── Custom MultiValue (selected tag / pill) ────────────────────── */
export const CustomMultiValue = (
  props: MultiValueProps<DoctorOption, true>,
) => {
  const { color, image, label, value } = props.data;

  return (
    <components.MultiValue {...props}>
      <div className="flex items-center gap-1">
        {value !== 0 && (
          <Avatar
            name={label}
            color={color ?? "#888"}
            image={image}
            size="xs"
          />
        )}
        <span>{label.replace("Dr. ", "")}</span>
      </div>
    </components.MultiValue>
  );
};

/** Small indigo checkbox shown on the right side of each option. */
const CheckboxIndicator = ({ checked }: { checked: boolean }) => (
  <div
    className={`w-4 h-4 rounded-[3px] border-[1.5px] flex items-center justify-center shrink-0 ${checked ? "border-indigo-500 bg-indigo-500" : "border-gray-300 bg-transparent"}
`}
  >
    {checked && (
      <div
        className="w-[9px] h-[6px] border-l-2 border-b-2 border-white -rotate-45 translate-x-px -translate-y-px"
      />
    )}
  </div>
);
