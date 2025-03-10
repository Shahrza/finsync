import React from "react";

interface Props {
  error: string | undefined;
}

const InputError: React.FC<Props> = ({ error }) => {
  if (!error) return null;
  return <span className="text-red-500 text-sm">{error}</span>;
};

export default InputError;
