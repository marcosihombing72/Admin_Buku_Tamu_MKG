import React from "react";
import Image from "next/image";
import { CardProps } from "@/interfaces/CardProps";

export default function Card({
  image,
  text,
  logo,
  onclick,
  textColor,
}: CardProps) {
  return (
    <div
      onClick={onclick}
      className="relative mt-4 w-[272px] h-[217px] hover:cursor-pointer hover:scale-105 transition ease-in-out delay-150 hover:-translate-y-1 duration-300"
    >
      {/* Gambar utama */}
      <Image
        src={image}
        alt="image"
        fill
        className="object-cover rounded-2xl"
        style={{ zIndex: 0 }}
        sizes="(max-width: 768px) 100vw, 272px"
      />

      {/* Overlay di atas gambar */}
      <div className="absolute -bottom-5 right-0 left-0 flex flex-col items-center justify-center rounded-full bg-white/70 z-10">
        <Image
          src={logo}
          alt="logo"
          width={47}
          height={42}
          className="rounded-2xl"
        />
        <div className="text-sm font-bold text-center justify-center items-center mb-2">
          <p className={`text-sm md:text-base ${textColor}`}>{text}</p>
        </div>
      </div>
    </div>
  );
}
