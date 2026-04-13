interface AvatarProps {
  name: string;
  color: string;
  image?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

const sizeMap = { xs: 'w-5 h-5', sm: 'w-8 h-8', md: 'w-10 h-10', lg: 'w-12 h-12' };
const fontMap = { xs: 'text-[8px]', sm: 'text-xs', md: 'text-sm', lg: 'text-base' };

const Avatar = ({ name, color, image, size = 'md' }: AvatarProps) => {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const bgColor = color + '20';
  const textColor = color;

  if (image) return (
    <img src={image} alt={name} className={`${sizeMap[size]} rounded-full object-cover shrink-0`} />
  );

  return (
    <div
      className={`${sizeMap[size]} rounded-full flex items-center justify-center shrink-0 font-bold ${fontMap[size]}`}
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      {initials}
    </div>
  );
};
export default Avatar;