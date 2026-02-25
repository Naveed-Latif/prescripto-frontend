export type Doctor = {
  _id: string;
  name: string;
  image: string; // or StaticImageData if you're using Next.js
  speciality: string;
  degree: string;
  experience: string;
  about: string;
  fees: number;
  address: {
    line1: string;
    line2: string;
  };
};