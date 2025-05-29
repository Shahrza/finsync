import { Loader2 } from "lucide-react";

type Props = {
  size: number;
};

const Loader = ({ size }: Props) => {
  return <Loader2 className="animate-spin" size={size} />;
};

export default Loader;
