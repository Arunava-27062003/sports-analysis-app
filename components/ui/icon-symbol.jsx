import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'sportscourt.fill': 'sports-cricket',
  'person.fill': 'person',
};

export function IconSymbol({ name, size = 24, color, style }) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
