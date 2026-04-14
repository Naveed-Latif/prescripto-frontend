const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
  <button
    onClick={() => onChange(!checked)}
    className={`relative inline-flex w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none ${
      checked ? 'bg-indigo-500' : 'bg-gray-200'
    }`}
  >
    <span className={`inline-block w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200 mt-0.5 ${
      checked ? 'translate-x-5' : 'translate-x-1'
    }`} />
  </button>
);
export default Toggle