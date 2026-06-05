import Image from "next/image";

export default function Settings() {
  return (
    <div className="flex h-full items-center justify-center">
      <Image
        src="/undraw_under-construction_c2y1.svg"
        alt="Under Construction"
        width={400}
        height={400}
        priority
        className="shrink-0"
      />
    </div>
  );
}
