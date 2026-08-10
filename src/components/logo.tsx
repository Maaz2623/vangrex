import Image from "next/image";

export const Logo = () => {
  return (
    <div>
      <Image src={`/logo.png`} alt="logo" width={128} height={128} />
    </div>
  );
};
