import Image from "next/image";

type Props = {
  size?: number;
};

const LoadingLogo = ({ size = 100 }: Props) => {
  return (
    <section className="h-full w-full flex justify-center items-center">
      <Image
        src={"/logo.svg"}
        alt="Logo"
        width={size}
        height={size}
        className="animate-pulse duration-700"
      />
    </section>
  );
};

export default LoadingLogo;
